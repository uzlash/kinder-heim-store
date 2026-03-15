import { NextRequest, NextResponse } from 'next/server'
import { clientWithToken } from '@/lib/sanity.client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendOrderConfirmationEmail } from '@/lib/email'

// Server-side shipping fees (must match frontend ShippingMethod.tsx)
const DELIVERY_FEES = { store_pickup: 0, abuja: 5000, interstate: 7000 }
const INTERSTATE_ZONES: { value: string; fee: number }[] = [
  { value: 'northwest', fee: 7000 }, { value: 'northeast', fee: 7000 },
  { value: 'northcentral', fee: 7000 }, { value: 'southwest', fee: 7000 },
  { value: 'southeast', fee: 7000 }, { value: 'southsouth', fee: 7000 },
  { value: 'other', fee: 0 },
]

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { items, shippingAddress, shippingMethod, interstateZone, email, name, phone, notes } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Validate stock, resolve to Sanity product _id, and get server-side price + productOfMonth
    const productIdByItemKey: string[] = []
    const resolvedProducts: { _id: string; price: number; productOfMonth?: boolean }[] = []
    for (const item of items) {
      const idParam = item.id || item._id
      let product = await clientWithToken.fetch(
        `*[_type == "product" && _id == $id][0] { inventory, name, _id, price, productOfMonth, "sizeVariants": sizeVariants[]{ label, price } }`,
        { id: idParam }
      )
      if (!product && (item.slug || (typeof idParam === 'string' && !idParam.startsWith('product-') && idParam.length < 50))) {
        const slug = item.slug || idParam
        product = await clientWithToken.fetch(
          `*[_type == "product" && slug.current == $slug][0] { inventory, name, _id, price, productOfMonth, "sizeVariants": sizeVariants[]{ label, price } }`,
          { slug }
        )
      }

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.title}` },
          { status: 400 }
        )
      }

      if (product.inventory < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}. Only ${product.inventory} left.` },
          { status: 400 }
        )
      }

      // For products with per-variant pricing, resolve the price from the matching sizeVariant
      let resolvedPrice = Number(product.price) ?? 0
      const sizeVariants: Array<{ label: string; price: number }> = product.sizeVariants ?? []
      if (sizeVariants.length > 0 && item.size) {
        const matchedVariant = sizeVariants.find(
          (sv: { label: string; price: number }) => sv.label === item.size
        )
        if (matchedVariant) {
          resolvedPrice = Number(matchedVariant.price)
        }
      }

      productIdByItemKey.push(product._id)
      resolvedProducts.push({
        _id: product._id,
        price: resolvedPrice,
        productOfMonth: Boolean(product.productOfMonth),
      })
    }

    // Recompute subtotal from server-side prices (ignore client-supplied totals)
    const serverSubtotal = resolvedProducts.reduce(
      (sum, p, i) => sum + p.price * (items[i].quantity || 0),
      0
    )

    // Recompute shipping and total
    const method = shippingMethod === 'store_pickup' || shippingMethod === 'abuja' || shippingMethod === 'interstate'
      ? shippingMethod
      : 'store_pickup'
    const hasProductOfMonth = resolvedProducts.some((p) => p.productOfMonth)
    const freeAbujaDelivery = method === 'abuja' && hasProductOfMonth && items.length >= 3
    const serverShippingCost =
      method === 'store_pickup'
        ? 0
        : freeAbujaDelivery
          ? 0
          : method === 'abuja'
            ? DELIVERY_FEES.abuja
            : INTERSTATE_ZONES.find((z) => z.value === (interstateZone || 'northwest'))?.fee ?? DELIVERY_FEES.interstate
    const serverTotal = serverSubtotal + serverShippingCost

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    // Create customer if guest
    let customerId = session?.user?.customerId

    if (!customerId) {
      // Check if customer exists by email
      const existingCustomer = await clientWithToken.fetch(
        `*[_type == "customer" && email == $email][0]._id`,
        { email }
      )

      if (existingCustomer) {
        customerId = existingCustomer
      } else {
        // Create new customer
        const newCustomer = await clientWithToken.create({
          _type: 'customer',
          name,
          email,
          phone,
          createdAt: new Date().toISOString(),
          totalOrders: 0,
          totalSpent: 0
        })
        customerId = newCustomer._id
      }
    }

    // Orders are not scoped by brand (single bank account for HEIM + Kinder); one Orders list in Sanity.

    const sanitizedShippingAddress =
      shippingAddress && typeof shippingAddress === 'object'
        ? { fullName: shippingAddress.fullName ?? '', address1: shippingAddress.address1 ?? '' }
        : { fullName: '', address1: '' }

    // Create order
    const order = await clientWithToken.create({
      _type: 'order',
      orderNumber,
      customer: {
        _type: 'reference',
        _ref: customerId,
      },
      customerEmail: email,
      customerName: name,
      customerPhone: phone,
      items: items.map((item: any, index: number) => ({
        _key: Math.random().toString(36).substring(7),
        product: {
          _type: 'reference',
          _ref: productIdByItemKey[index],
        },
        productName: item.title,
        quantity: item.quantity,
        price: resolvedProducts[index].price,
        color: item.color,
        size: item.size,
      })),
      shippingAddress: sanitizedShippingAddress,
      shippingMethod: method,
      subtotal: serverSubtotal,
      shippingCost: serverShippingCost,
      total: serverTotal,
      status: 'pending',
      paymentStatus: 'pending',
      notes: notes ? String(notes).trim() : undefined,
      createdAt: new Date().toISOString(),
    })

    // Update inventory (use resolved Sanity product _id)
    for (let i = 0; i < items.length; i++) {
      await clientWithToken
        .patch(productIdByItemKey[i])
        .dec({ inventory: items[i].quantity })
        .commit()
    }

    // Update customer stats (use server-computed total)
    await clientWithToken
      .patch(customerId)
      .inc({ totalOrders: 1, totalSpent: serverTotal })
      .commit()

    // Send confirmation email (use server-computed totals)
    await sendOrderConfirmationEmail({
      orderNumber,
      customerEmail: email,
      customerName: name,
      items: items.map((item: any, index: number) => ({
        productName: item.title,
        quantity: item.quantity,
        price: resolvedProducts[index].price,
      })),
      total: serverTotal,
    });

    return NextResponse.json(
      { message: 'Order created successfully', orderId: order._id, orderNumber },
      { status: 201 }
    )
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

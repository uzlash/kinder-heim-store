import { NextRequest, NextResponse } from 'next/server'
import { clientWithToken } from '@/lib/sanity.client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { sendOrderConfirmationEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { items, shippingAddress, billingAddress, paymentMethod, shippingMethod, total, subtotal, shippingCost, tax, email, name, phone } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Validate stock
    for (const item of items) {
      const product = await clientWithToken.fetch(
        `*[_type == "product" && _id == $id][0] { inventory, name }`,
        { id: item.id || item._id } // Handle both id formats
      )

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
    }

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
      items: items.map((item: any) => ({
        _key: Math.random().toString(36).substring(7),
        product: {
          _type: 'reference',
          _ref: item.id || item._id,
        },
        productName: item.title,
        quantity: item.quantity,
        price: item.discountedPrice || item.price,
        color: item.color,
        size: item.size,
      })),
      shippingAddress,
      billingAddress,
      paymentMethod,
      shippingMethod,
      subtotal,
      shippingCost,
      tax,
      total,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
    })

    // Update inventory
    for (const item of items) {
      await clientWithToken
        .patch(item.id || item._id)
        .dec({ inventory: item.quantity })
        .commit()
    }

    // Update customer stats
    await clientWithToken
      .patch(customerId)
      .inc({ totalOrders: 1, totalSpent: total })
      .commit()

    // Send confirmation email
    await sendOrderConfirmationEmail({
      orderNumber,
      customerEmail: email,
      customerName: name,
      items: items.map((item: any) => ({
        productName: item.title,
        quantity: item.quantity,
        price: item.discountedPrice || item.price,
      })),
      total,
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

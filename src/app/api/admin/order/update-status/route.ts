import { NextRequest, NextResponse } from 'next/server'
import { clientWithToken } from '@/lib/sanity.client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const ALLOWED_ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { orderId, status } = body

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (typeof orderId !== 'string' || !ALLOWED_ORDER_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid orderId or status' },
        { status: 400 }
      )
    }

    // Verify the document exists and is an order before patching
    const existing = await clientWithToken.fetch<{ _id: string } | null>(
      `*[_type == "order" && _id == $orderId][0]{ _id }`,
      { orderId }
    )
    if (!existing) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    await clientWithToken
      .patch(orderId)
      .set({ status })
      .commit()

    // Here you would typically trigger an email notification
    // await sendOrderStatusEmail(orderId, status)

    return NextResponse.json({ message: 'Order status updated' })
  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    )
  }
}

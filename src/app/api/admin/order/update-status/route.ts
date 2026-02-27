import { NextRequest, NextResponse } from 'next/server'
import { clientWithToken } from '@/lib/sanity.client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/route'

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

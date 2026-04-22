import cron from 'node-cron'
import { prisma } from '../shared/prisma/client'

/**
 * Tự động hủy booking pending mà startTime đã qua so với now.
 * Tự động chuyển status thành Hoàn thành cho booking Sắp tới khi đã qua so với now.
 * Chạy mỗi 5 phút.
 */
export const startBookingExpiryJob = () => {
  runBookingCleanup()

  cron.schedule('*/5 * * * *', runBookingCleanup)

  console.log('[BookingExpiryJob] Đã khởi động (mỗi 5 phút)')
}

const runBookingCleanup = async () => {
  try {
    const now = new Date()

    const expiredBookings = await prisma.booking.findMany({
      where: { status: 'pending', startTime: { lt: now } },
      select: { id: true }
    })

    if (expiredBookings.length > 0) {
      const expiredIds = expiredBookings.map((b) => b.id)

      // Hủy booking
      await prisma.booking.updateMany({
        where: { id: { in: expiredIds } },
        data: {
          status: 'cancelled',
          rejectionReason: 'Tự động hủy - quá thời gian chờ xác nhận'
        }
      })

      // Hủy Transaction
      await prisma.transaction.updateMany({
        where: {
          bookingId: { in: expiredIds },
          type: 'payment',
          status: 'pending'
        },
        data: {
          status: 'failed',
          description: 'Tự động hủy - booking hết hạn'
        }
      })
    }

    const completed = await prisma.booking.updateMany({
      where: { status: 'confirmed', endTime: { lt: now } },
      data: { status: 'completed' }
    })

    if (completed.count > 0) {
      console.log(`[BookingExpiryJob: Tự động] Hoàn thành: ${completed.count}`)
    }
  } catch (error) {
    console.error('[BookingExpiryJob] Lỗi:', error)
  }
}

import { prisma } from '../../shared/prisma/client'

export class BookingsRepository {
  static async findFieldWithPricing(fieldId: number) {
    return prisma.field.findUnique({
      where: { id: fieldId },
      include: {
        facility: {
          select: { id: true, name: true, status: true, openTime: true, closeTime: true, ownerId: true }
        },
        fieldPricings: {
          select: { startTime: true, endTime: true, pricePerHour: true, isWeekend: true }
        }
      }
    })
  }

  static async findConflictingBookings(fieldId: number, slotRanges: { start: Date; end: Date }[]) {
    const orConditions = slotRanges.map((slot) => ({
      startTime: { lt: slot.end },
      endTime: { gt: slot.start }
    }))

    return prisma.booking.findMany({
      where: {
        fieldId,
        status: { in: ['pending', 'confirmed'] },
        OR: orConditions
      },
      select: { id: true, startTime: true, endTime: true, status: true }
    })
  }

  static async createBookingWithTransaction(data: {
    userId: number
    fieldId: number
    startTime: Date
    endTime: Date
    totalPrice: number
    depositAmount: number
    paymentOption: 'deposit' | 'full'
    note?: string
    checkInCode: string
  }) {
    return prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          userId: data.userId,
          fieldId: data.fieldId,
          startTime: data.startTime,
          endTime: data.endTime,
          totalPrice: data.totalPrice,
          depositAmount: data.depositAmount,
          status: 'pending',
          paymentStatus: 'unpaid',
          checkInCode: data.checkInCode,
          ...(data.note !== undefined ? { note: data.note } : {})
        }
      })

      const paidAmount = data.paymentOption === 'full' ? data.totalPrice : data.depositAmount
      await tx.transaction.create({
        data: {
          bookingId: booking.id,
          amount: paidAmount,
          type: 'payment',
          method: 'qr_transfer',
          status: 'pending',
          description: data.paymentOption === 'full' ? 'Thanh toán toàn bộ qua QR - chờ xác nhận' : 'Đặt cọc 30% qua QR - chờ xác nhận'
        }
      })
      return booking
    })
  }
}

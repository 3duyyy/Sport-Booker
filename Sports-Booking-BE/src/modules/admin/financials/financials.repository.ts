import { StatusCodes } from 'http-status-codes'
import { Prisma } from '../../../../generated/prisma'
import { AppError } from '../../../shared/exceptions'
import { prisma } from '../../../shared/prisma/client'
import { FindManyPayoutsParams, FindManyRefundsParams } from '../../../shared/types/admin'
import { toNumber, toPagination } from '../../../shared/utils/utils'

export class AdminFinancialsRepository {
  static async getSummary() {
    const payoutWhere: Prisma.BookingWhereInput = {
      status: 'completed',
      paymentStatus: { in: ['paid', 'partially_paid'] },
      isSettled: false,
      transactions: {
        some: {
          type: 'payment',
          status: 'success'
        }
      }
    }

    const [payoutAgg, payoutCount, refundAgg, refundCount] = await Promise.all([
      prisma.booking.aggregate({
        _sum: { totalPrice: true },
        where: payoutWhere
      }),
      prisma.booking.count({
        where: payoutWhere
      }),
      prisma.refundRequest.aggregate({
        _sum: { amount: true },
        where: { status: 'pending' }
      }),
      prisma.refundRequest.count({
        where: { status: 'pending' }
      })
    ])

    return {
      pendingPayoutAmount: toNumber(payoutAgg._sum.totalPrice),
      pendingPayoutCount: payoutCount,
      pendingRefundAmount: toNumber(refundAgg._sum.amount),
      pendingRefundCount: refundCount
    }
  }

  static async getPayouts(params: FindManyPayoutsParams) {
    const limit = params.limit
    const offset = (params.page - 1) * limit
    const keyword = params.keyword ? `%${params.keyword}%` : null
    const keywordQuery = keyword ? Prisma.sql`AND (u.full_name LIKE ${keyword} OR fac.name LIKE ${keyword})` : Prisma.empty
    const countQuery = await prisma.$queryRaw<{ total: bigint }[]>`
      SELECT COUNT(DISTINCT u.id) as total
      FROM bookings b
      JOIN fields f ON b.field_id = f.id
      JOIN facilities fac ON f.facility_id = fac.id
      JOIN users u ON fac.owner_id = u.id
      WHERE b.status = 'completed' AND b.payment_status IN ('paid', 'partially_paid') AND b.is_settled = false
      ${keywordQuery}
    `
    const total = Number(countQuery[0]?.total || 0)
    let rows: any[] = []
    if (params.sortBy === 'amount' && params.sortOrder === 'desc') {
      rows = await prisma.$queryRaw`
        SELECT u.id as ownerId, u.full_name as ownerName, u.bank_name as bankName, u.bank_account as bankAccount, u.account_holder as accountHolder, CAST(COUNT(b.id) AS UNSIGNED) as bookingCount, 
        SUM(CASE WHEN b.payment_status = 'paid' THEN b.total_price WHEN b.payment_status = 'partially_paid' THEN b.deposit_amount ELSE 0 END) as payoutAmount
        FROM bookings b JOIN fields f ON b.field_id = f.id JOIN facilities fac ON f.facility_id = fac.id JOIN users u ON fac.owner_id = u.id
        WHERE b.status = 'completed' AND b.payment_status IN ('paid', 'partially_paid') AND b.is_settled = false ${keywordQuery}
        GROUP BY u.id ORDER BY payoutAmount DESC LIMIT ${limit} OFFSET ${offset}
      `
    } else if (params.sortBy === 'amount' && params.sortOrder === 'asc') {
      rows = await prisma.$queryRaw`
        SELECT u.id as ownerId, u.full_name as ownerName, u.bank_name as bankName, u.bank_account as bankAccount, u.account_holder as accountHolder, CAST(COUNT(b.id) AS UNSIGNED) as bookingCount, 
        SUM(CASE WHEN b.payment_status = 'paid' THEN b.total_price WHEN b.payment_status = 'partially_paid' THEN b.deposit_amount ELSE 0 END) as payoutAmount
        FROM bookings b JOIN fields f ON b.field_id = f.id JOIN facilities fac ON f.facility_id = fac.id JOIN users u ON fac.owner_id = u.id
        WHERE b.status = 'completed' AND b.payment_status IN ('paid', 'partially_paid') AND b.is_settled = false ${keywordQuery}
        GROUP BY u.id ORDER BY payoutAmount ASC LIMIT ${limit} OFFSET ${offset}
      `
    } else if (params.sortOrder === 'desc') {
      rows = await prisma.$queryRaw`
        SELECT u.id as ownerId, u.full_name as ownerName, u.bank_name as bankName, u.bank_account as bankAccount, u.account_holder as accountHolder, CAST(COUNT(b.id) AS UNSIGNED) as bookingCount, 
        SUM(CASE WHEN b.payment_status = 'paid' THEN b.total_price WHEN b.payment_status = 'partially_paid' THEN b.deposit_amount ELSE 0 END) as payoutAmount
        FROM bookings b JOIN fields f ON b.field_id = f.id JOIN facilities fac ON f.facility_id = fac.id JOIN users u ON fac.owner_id = u.id
        WHERE b.status = 'completed' AND b.payment_status IN ('paid', 'partially_paid') AND b.is_settled = false ${keywordQuery}
        GROUP BY u.id ORDER BY bookingCount DESC LIMIT ${limit} OFFSET ${offset}
      `
    } else {
      rows = await prisma.$queryRaw`
        SELECT u.id as ownerId, u.full_name as ownerName, u.bank_name as bankName, u.bank_account as bankAccount, u.account_holder as accountHolder, CAST(COUNT(b.id) AS UNSIGNED) as bookingCount, 
        SUM(CASE WHEN b.payment_status = 'paid' THEN b.total_price WHEN b.payment_status = 'partially_paid' THEN b.deposit_amount ELSE 0 END) as payoutAmount
        FROM bookings b JOIN fields f ON b.field_id = f.id JOIN facilities fac ON f.facility_id = fac.id JOIN users u ON fac.owner_id = u.id
        WHERE b.status = 'completed' AND b.payment_status IN ('paid', 'partially_paid') AND b.is_settled = false ${keywordQuery}
        GROUP BY u.id ORDER BY bookingCount ASC LIMIT ${limit} OFFSET ${offset}
      `
    }
    return {
      data: rows.map((item) => ({
        id: item.ownerId,
        ownerId: item.ownerId,
        ownerName: item.ownerName || 'Chưa cập nhật',
        bankName: item.bankName || 'Chưa cập nhật',
        bankAccount: item.bankAccount || 'Chưa cập nhật',
        accountHolder: item.accountHolder || 'Chưa cập nhật',
        bookingCount: Number(item.bookingCount),
        payoutAmount: toNumber(item.payoutAmount)
      })),
      pagination: toPagination(params.page, params.limit, total)
    }
  }

  static async getRefunds(params: FindManyRefundsParams) {
    const skip = (params.page - 1) * params.limit
    const isNumericKeyword = params.keyword ? /^\d+$/.test(params.keyword) : false

    const where: Prisma.RefundRequestWhereInput = {
      ...(params.keyword
        ? {
            OR: [
              { user: { fullName: { contains: params.keyword } } },
              { user: { email: { contains: params.keyword } } },
              { bankName: { contains: params.keyword } },
              { bankAccount: { contains: params.keyword } },
              ...(isNumericKeyword ? [{ bookingId: Number(params.keyword) }] : [])
            ]
          }
        : {})
    }

    const orderBy: Prisma.RefundRequestOrderByWithRelationInput =
      params.sortBy === 'amount' ? { amount: params.sortOrder } : { createdAt: params.sortOrder }

    const [rows, total] = await Promise.all([
      prisma.refundRequest.findMany({
        where,
        skip,
        take: params.limit,
        orderBy,
        select: {
          id: true,
          bookingId: true,
          amount: true,
          status: true,
          bankName: true,
          bankAccount: true,
          createdAt: true,
          user: {
            select: {
              fullName: true,
              email: true
            }
          }
        }
      }),
      prisma.refundRequest.count({ where })
    ])

    return {
      data: rows.map((item) => ({
        id: item.id,
        refundRequestId: item.id,
        customerName: item.user.fullName || 'Khách hàng',
        customerEmail: item.user.email || '-',
        bookingCode: '#BK-' + item.bookingId,
        refundMethodLabel: item.bankName + ' - ' + item.bankAccount,
        refundAmount: toNumber(item.amount),
        status: item.status,
        createdAt: item.createdAt.toISOString()
      })),
      pagination: toPagination(params.page, params.limit, total)
    }
  }

  static async settlePayout(ownerId: number) {
    const updated = await prisma.booking.updateMany({
      where: {
        field: { facility: { ownerId: ownerId } },
        status: 'completed',
        paymentStatus: { in: ['paid', 'partially_paid'] }
      },
      data: { isSettled: true }
    })
    return { count: updated.count }
  }

  static async approveRefund(refundRequestId: number) {
    const refund = await prisma.refundRequest.findUnique({
      where: { id: refundRequestId }
    })

    if (!refund) throw new AppError('Không tìm thấy yêu cầu hoàn tiền', StatusCodes.NOT_FOUND)
    if (refund.status !== 'pending') throw new AppError('Yêu cầu này đã được xử lý', StatusCodes.CONFLICT)

    return prisma.$transaction(async (tx) => {
      const updatedRefund = await tx.refundRequest.update({
        where: { id: refundRequestId },
        data: { status: 'approved' }
      })

      await tx.booking.update({
        where: { id: refund.bookingId },
        data: { paymentStatus: 'refunded' }
      })

      return updatedRefund
    })
  }
}

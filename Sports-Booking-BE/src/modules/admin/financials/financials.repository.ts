import { Prisma } from '../../../../generated/prisma'
import { prisma } from '../../../shared/prisma/client'
import { FindManyPayoutsParams, FindManyRefundsParams } from '../../../shared/types/admin'
import { toNumber, toPagination } from '../../../shared/utils/utils'

export class AdminFinancialsRepository {
  static async getSummary() {
    const payoutWhere: Prisma.BookingWhereInput = {
      status: 'completed',
      paymentStatus: 'paid',
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
    const skip = (params.page - 1) * params.limit
    const isNumericKeyword = params.keyword ? /^\d+$/.test(params.keyword) : false

    const where: Prisma.BookingWhereInput = {
      status: 'completed',
      paymentStatus: 'paid',
      transactions: {
        some: {
          type: 'payment',
          status: 'success'
        }
      },
      ...(params.keyword
        ? {
            OR: [
              {
                field: {
                  facility: {
                    name: { contains: params.keyword }
                  }
                }
              },
              {
                field: {
                  facility: {
                    owner: {
                      fullName: { contains: params.keyword }
                    }
                  }
                }
              },
              ...(isNumericKeyword ? [{ id: Number(params.keyword) }] : [])
            ]
          }
        : {})
    }

    const orderBy: Prisma.BookingOrderByWithRelationInput =
      params.sortBy === 'amount' ? { totalPrice: params.sortOrder } : { createdAt: params.sortOrder }

    const [rows, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: params.limit,
        orderBy,
        select: {
          id: true,
          totalPrice: true,
          field: {
            select: {
              facility: {
                select: {
                  name: true,
                  owner: {
                    select: {
                      fullName: true,
                      bankName: true,
                      bankAccount: true,
                      accountHolder: true
                    }
                  }
                }
              }
            }
          }
        }
      }),
      prisma.booking.count({ where })
    ])

    return {
      data: rows.map((item) => ({
        id: item.id,
        bookingId: item.id,
        bookingCode: '#BK-' + item.id,
        ownerName: item.field.facility.owner.fullName || 'Chưa cập nhật',
        facilityName: item.field.facility.name || 'Chưa cập nhật',
        bankName: item.field.facility.owner.bankName || 'Chưa cập nhật',
        bankAccount: item.field.facility.owner.bankAccount || 'Chưa cập nhật',
        accountHolder: item.field.facility.owner.accountHolder || 'Chưa cập nhật',
        payoutAmount: toNumber(item.totalPrice)
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
}

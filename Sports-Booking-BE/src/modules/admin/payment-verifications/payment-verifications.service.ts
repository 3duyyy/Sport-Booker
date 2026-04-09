import { FindManyPaymentVerificationsParams } from '../../../shared/types/admin'
import { AdminPaymentVerificationsRepository } from './payment-verifications.repository'

const mapStatus = (status: 'pending' | 'success' | 'failed') => {
  if (status === 'success') return 'approved' as const
  if (status === 'failed') return 'rejected' as const
  return 'pending' as const
}

export class AdminPaymentVerificationsService {
  static async getList(params: FindManyPaymentVerificationsParams) {
    return AdminPaymentVerificationsRepository.findManyForAdmin(params)
  }

  static async review(transactionId: number, action: 'approve' | 'reject', reason?: string) {
    const tx = await AdminPaymentVerificationsRepository.review(transactionId, action, reason)

    return {
      transactionId: tx.id,
      bookingId: tx.bookingId,
      amount: Number(tx.amount),
      status: mapStatus(tx.status),
      transferredAt: tx.createdAt.toISOString()
    }
  }
}

import { FindManyPayoutsParams, FindManyRefundsParams } from '../../../shared/types/admin'
import { AdminFinancialsRepository } from './financials.repository'

export class AdminFinancialsService {
  static async getSummary() {
    return AdminFinancialsRepository.getSummary()
  }

  static async getPayouts(params: FindManyPayoutsParams) {
    return AdminFinancialsRepository.getPayouts(params)
  }

  static async getRefunds(params: FindManyRefundsParams) {
    return AdminFinancialsRepository.getRefunds(params)
  }
}

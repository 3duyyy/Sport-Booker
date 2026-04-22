import { StatusCodes } from 'http-status-codes'
import { UpdateAdminFacilityStatusDto } from '../../../dtos/admin.dto'
import { AppError } from '../../../shared/exceptions'
import { FindManyFacilitiesParams } from '../../../shared/types/admin'
import { AdminFacilitiesRepository } from './facilities.repository'

export class AdminFacilitiesService {
  static async getList(params: FindManyFacilitiesParams) {
    const result = await AdminFacilitiesRepository.findManyForAdmin(params)

    return {
      data: result.data.map((item) => ({
        id: item.id,
        ownerId: item.ownerId,
        ownerName: item.ownerName,
        sportId: item.sportId,
        sportName: item.sportName,
        name: item.name,
        address: item.address,
        district: item.district ?? '',
        city: item.city ?? '',
        thumbnailUrl: item.thumbnailUrl,
        status: item.status,
        performance: item.performance,
        fieldCount: item.fieldCount,
        bookingCount: item.bookingCount,
        createdAt: item.createdAt.toISOString()
      })),
      pagination: result.pagination
    }
  }

  static async updateStatus(id: number, dto: UpdateAdminFacilityStatusDto) {
    const current = await AdminFacilitiesRepository.findByIdForAdmin(id)
    if (!current) {
      throw new AppError('Không tìm thấy cơ sở', StatusCodes.NOT_FOUND)
    }

    const updated = await AdminFacilitiesRepository.updateStatusForAdmin(id, dto.status)

    return {
      id: updated.id,
      status: updated.status,
      updatedAt: updated.updatedAt.toISOString()
    }
  }

  static async approve(id: number) {
    const current = await AdminFacilitiesRepository.findByIdForAdmin(id)
    if (!current) {
      throw new AppError('Không tìm thấy cơ sở', StatusCodes.NOT_FOUND)
    }

    if (current.status !== 'pending_approve') {
      throw new AppError('Chỉ có thể phê duyệt cơ sở đang chờ duyệt', StatusCodes.BAD_REQUEST)
    }

    const updated = await AdminFacilitiesRepository.approvePendingForAdmin(id)
    if (!updated) {
      throw new AppError('Không thể phê duyệt do trạng thái đã thay đổi', StatusCodes.CONFLICT)
    }

    return {
      id: updated.id,
      status: updated.status,
      updatedAt: updated.updatedAt.toISOString()
    }
  }
}

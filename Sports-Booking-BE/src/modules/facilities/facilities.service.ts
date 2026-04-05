import { StatusCodes } from 'http-status-codes'
import { CreateFacilityDto, CreateFieldDto, FacilityQueryDto, SetFieldPricesDto } from '../../dtos/facilities.dto'
import { AppError } from '../../shared/exceptions'
import { FacilitiesRepository } from './facilities.repository'
import { UsersRepository } from '../users/users.repository'
import { ROLES } from '../../shared/constants/roles'

type AvailabilitySlot = {
  startTime: string
  endTime: string
  pricePerHour: string
  status: 'available' | 'booked'
}

export class FacilitiesService {
  private static timeToMinutes(time: string) {
    const parts = time.split(':')

    if (parts.length !== 2) {
      throw new Error('Invalid time format')
    }

    const hour = Number(parts[0])
    const minute = Number(parts[1])

    if (isNaN(hour) || isNaN(minute)) {
      throw new AppError('Invalid time value', StatusCodes.BAD_REQUEST)
    }

    return hour * 60 + minute
  }

  private static minutesToTime(totalMinutes: number) {
    const hour = Math.floor(totalMinutes / 60)
    const minute = totalMinutes % 60
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
  }

  private static buildHourlySlots(
    pricings: Array<{
      startTime: string
      endTime: string
      pricePerHour: any
    }>,
    bookings: Array<{
      startTime: Date
      endTime: Date
    }>
  ): AvailabilitySlot[] {
    const slots: AvailabilitySlot[] = []

    for (const pricing of pricings) {
      const start = this.timeToMinutes(pricing.startTime)
      const end = this.timeToMinutes(pricing.endTime)

      for (let cursor = start; cursor < end; cursor += 60) {
        const slotStart = cursor
        const slotEnd = cursor + 60

        if (slotEnd > end) break

        const isBooked = bookings.some((booking) => {
          const bookingStart = booking.startTime.getHours() * 60 + booking.endTime.getMinutes()
          const bookingEnd = booking.endTime.getHours() * 60 + booking.endTime.getMinutes()

          return bookingStart < slotEnd && bookingEnd > slotStart
        })

        slots.push({
          startTime: this.minutesToTime(slotStart),
          endTime: this.minutesToTime(slotEnd),
          pricePerHour: String(pricing.pricePerHour),
          status: isBooked ? 'booked' : 'available'
        })
      }
    }

    return slots
  }

  static async createFacility(ownerId: number, dto: CreateFacilityDto) {
    const user = await UsersRepository.findById(ownerId)
    if (!user) throw new AppError('User không tồn tại', StatusCodes.NOT_FOUND)
    if (user?.roleId === ROLES.CUSTOMER) {
      await UsersRepository.upgradeToOwner(ownerId)
    }

    return FacilitiesRepository.createFacility(ownerId, dto)
  }

  static async getMyFacilities(ownerId: number) {
    return FacilitiesRepository.findFacilitiesByOwner(ownerId)
  }

  static async createField(ownerId: number, facilityId: number, dto: CreateFieldDto) {
    const facility = await FacilitiesRepository.findFacilityById(facilityId)
    if (!facility) {
      throw new AppError('Cụm sân không tồn tại!', StatusCodes.NOT_FOUND)
    }

    if (facility.ownerId !== ownerId) {
      throw new AppError('Bạn không có quyền thêm sân vào cụm sân này!', StatusCodes.FORBIDDEN)
    }

    return await FacilitiesRepository.createField(facilityId, dto)
  }

  static async setFieldPrices(ownerId: number, fieldId: number, dto: SetFieldPricesDto) {
    const field = await FacilitiesRepository.findFieldById(fieldId)
    if (!field) {
      throw new AppError('Sân không tồn tại', StatusCodes.NOT_FOUND)
    }

    if (field.facility.ownerId !== ownerId) {
      throw new AppError('Bạn không có quyền cấu hình giá cho sân này', StatusCodes.FORBIDDEN)
    }

    await FacilitiesRepository.replaceFieldPricings(fieldId, dto.pricings)

    return await FacilitiesRepository.findPricingsByField(fieldId)
  }

  static async getFeaturedFacilities() {
    return await FacilitiesRepository.findFeaturedFacilities()
  }
  static async getPublicFacilities(query: FacilityQueryDto) {
    return await FacilitiesRepository.findPublicFacilities(query)
  }

  static async getPublicFacilityById(id: number) {
    const facility = await FacilitiesRepository.findPublicFacilityById(id)
    if (!facility) {
      throw new AppError('Cụm sân không tồn tại!', StatusCodes.NOT_FOUND)
    }

    const { reviews, ...rest } = facility
    return {
      ...rest,
      avgRating: reviews.length ? reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length : null,
      reviewCount: reviews.length
    }
  }

  static async getFacilityReviews(facilityId: number, page: number, limit: number) {
    const facility = await FacilitiesRepository.findFacilityById(facilityId)
    if (!facility) throw new AppError('Cụm sân không tồn tại!', StatusCodes.NOT_FOUND)

    return await FacilitiesRepository.findReviewsByFacility(facilityId, page, limit)
  }

  static async getFacilityAvailability(facilityId: number, dateStr: string) {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) {
      throw new AppError('Định dạng ngày không hợp lệ (YYYY-MM-DD)', StatusCodes.BAD_REQUEST)
    }

    const facility = await FacilitiesRepository.findFacilityById(facilityId)
    if (!facility) {
      throw new AppError('Cụm sân không tồn tại!', StatusCodes.NOT_FOUND)
    }

    const fields = await FacilitiesRepository.findFieldsWithBookingsByDate(facilityId, date)
    const isWeekend = [0, 6].includes(date.getDay())

    return fields.map((field) => {
      const matchedPricings = field.fieldPricings.filter((pricing) => pricing.isWeekend === isWeekend)

      const slots = this.buildHourlySlots(matchedPricings, field.bookings)

      const fromPrice = slots.length > 0 ? Math.min(...slots.map((s) => Number(s.pricePerHour))) : null

      return {
        id: field.id,
        name: field.name,
        description: field.description,
        fromPrice,
        slots
      }
    })
  }
}

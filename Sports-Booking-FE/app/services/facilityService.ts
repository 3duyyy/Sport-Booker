import type {
  FacilityAvailabilityResponse,
  FacilityDetailData,
  FacilityDetailField,
  FacilityDetailResponse,
  FacilityDetailReview,
  FacilityItem,
  FacilityReviewsResponse,
  PublicFacilityQueryParams,
  SearchFacilitiesResponse,
} from "~/types/facility"
import { axiosInstance } from "./axiosInstance"
import type { ApiResponse } from "~/types/common"

export const facilityService = {
  getPublicFacilities(query: PublicFacilityQueryParams) {
    return axiosInstance.get<SearchFacilitiesResponse>("/facilities", { params: query })
  },

  async getFeaturedFacilities(): Promise<FacilityItem[]> {
    const res = await axiosInstance.get<ApiResponse<FacilityItem[]>>("/facilities/featured")
    return res.data.data
  },

  async getFacilityDetail(id: number): Promise<FacilityDetailData> {
    const response = await axiosInstance.get<FacilityDetailResponse>(`/facilities/${id}`)
    const raw = response.data.data

    return {
      id: raw.id,
      name: raw.name,
      sportName: raw.sport?.name || "",
      address: raw.address,
      district: raw.district || "",
      city: raw.city || "",
      latitude: raw.latitude,
      longitude: raw.longitude,
      rating: raw.avgRating || 0,
      reviewCount: raw.reviewCount || 0,
      description: raw.description || "",
      images: raw.facilityImages.map((img) => ({
        id: img.id,
        imageUrl: img.imageUrl,
        isThumbnail: img.isThumbnail,
      })),
      amenities: (raw.facilityUtilities || [])
        .filter((item) => item.utility)
        .map((item) => ({
          id: item.utility!.id,
          name: item.utility!.name,
          icon: item.utility!.iconClass || undefined,
        })),
      fields: [],
      reviews: [],
    }
  },

  async getFacilityAvailability(id: number, date: string): Promise<FacilityDetailField[]> {
    const response = await axiosInstance.get<FacilityAvailabilityResponse>(`/facilities/${id}/availability`, {
      params: { date },
    })

    return response.data.data.map((field) => ({
      id: field.id,
      name: field.name,
      description: field.description || undefined,
      fromPrice: Number(field.fromPrice),
      slots: field.slots.map((slot) => ({
        id: `${field.id}-${slot.startTime}`,
        startTime: slot.startTime,
        endTime: slot.endTime,
        price: Number(slot.pricePerHour),
        isBooked: slot.status !== "available",
      })),
    }))
  },

  async getFacilityReviews(id: number, page = 1, limit = 10): Promise<FacilityDetailReview[]> {
    const response = await axiosInstance.get<FacilityReviewsResponse>(`/facilities/${id}/reviews`, {
      params: { page, limit },
    })

    return response.data.data.map((review) => ({
      id: review.id,
      userName: review.user.fullName,
      avatarUrl: review.user.avatarUrl,
      rating: review.rating,
      comment: review.comment || "",
      createdAt: review.createdAt,
    }))
  },
}

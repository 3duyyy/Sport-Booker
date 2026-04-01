import { useQuery } from "@tanstack/vue-query"
import { facilityService } from "~/services/facilityService"

export const facilityQueryKeys = {
  all: ["facility"] as const,
  detail: (id: number) => [...facilityQueryKeys.all, "detail", id] as const,
  availability: (id: number, date: string) => [...facilityQueryKeys.all, "availability", id, date] as const,
  reviews: (id: number, page: number, limit: number) => [...facilityQueryKeys.all, "reviews", id, page, limit] as const,
}

export const useFacilityDetailQuery = (id: MaybeRef<number>) => {
  return useQuery({
    queryKey: facilityQueryKeys.detail(unref(id)), // unref(value) = isRef(value) ? value.value : value
    queryFn: () => facilityService.getFacilityDetail(unref(id)),
    enabled: computed(() => Boolean(unref(id))),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useFacilityAvailabilityQuery(id: MaybeRef<number>, date: MaybeRef<string>) {
  return useQuery({
    queryKey: computed(() => facilityQueryKeys.availability(unref(id), unref(date))),
    queryFn: () => facilityService.getFacilityAvailability(unref(id), unref(date)),
    enabled: computed(() => Boolean(unref(id) && unref(date))),
    gcTime: 1 * 60 * 1000,
  })
}

export function useFacilityReviewsQuery(id: MaybeRef<number>, page: MaybeRef<number> = 1, limit: MaybeRef<number> = 10) {
  return useQuery({
    queryKey: computed(() => facilityQueryKeys.reviews(unref(id), unref(page), unref(limit))),
    queryFn: () => facilityService.getFacilityReviews(unref(id), unref(page), unref(limit)),
    enabled: computed(() => Boolean(unref(id))),
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
  })
}

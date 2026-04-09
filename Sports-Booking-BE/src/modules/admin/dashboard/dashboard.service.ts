import { AdminDashboardRepository } from './dashboard.repository'

type DashboardActivityType = 'success' | 'neutral' | 'danger' | 'primary'

interface GetOverviewParams {
  days: number
  topPage: number
  topLimit: number
  activityLimit: number
}

interface TopFacilityItem {
  id: number
  name: string
  ownerName: string
  sportName: string
  location: string
  bookingCount: number
  revenue: number
  rating: number
  thumbnail: string
}

interface TopFacilitiesPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface AdminDashboardOverviewResponse {
  summary: {
    totalRevenue: number
    revenueGrowthPercent: number | null
    activeBookings: number
    occupancyRate: number
    pendingFacilities: number
    pendingRefunds: number
  }
  revenueBySport: Array<{
    sportId: number
    sportName: string
    revenue: number
    percent: number
  }>
  activities: Array<{
    id: number
    title: string
    description: string
    type: DashboardActivityType
    createdAt: string
  }>
  topFacilities: {
    data: TopFacilityItem[]
    pagination: TopFacilitiesPagination
  }
}

export class AdminDashboardService {
  static async getOverview(params: GetOverviewParams): Promise<AdminDashboardOverviewResponse> {
    const now = new Date()

    const currentFrom = new Date(now)
    currentFrom.setDate(currentFrom.getDate() - params.days)

    const previousFrom = new Date(currentFrom)
    previousFrom.setDate(previousFrom.getDate() - params.days)

    const [summaryRaw, revenueBySport, topFacilities, activityEvents] = await Promise.all([
      AdminDashboardRepository.getSummary(currentFrom, now, previousFrom),
      AdminDashboardRepository.getRevenueBySport(currentFrom, now),
      AdminDashboardRepository.getTopFacilities({
        page: params.topPage,
        limit: params.topLimit
      }),
      AdminDashboardRepository.getActivityEvents(params.activityLimit)
    ])

    const revenueGrowthPercent =
      summaryRaw.previousRevenue > 0
        ? Number((((summaryRaw.totalRevenue - summaryRaw.previousRevenue) / summaryRaw.previousRevenue) * 100).toFixed(1))
        : null

    const activities = activityEvents
      .sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime())
      .slice(0, params.activityLimit)
      .map((event, index) => ({
        id: index + 1,
        title: event.title,
        description: event.description,
        type: event.type,
        createdAt: event.occurredAt.toISOString()
      }))

    return {
      summary: {
        totalRevenue: summaryRaw.totalRevenue,
        revenueGrowthPercent,
        activeBookings: summaryRaw.activeBookings,
        occupancyRate: summaryRaw.occupancyRate,
        pendingFacilities: summaryRaw.pendingFacilities,
        pendingRefunds: summaryRaw.pendingRefunds
      },
      revenueBySport,
      activities,
      topFacilities
    }
  }
}

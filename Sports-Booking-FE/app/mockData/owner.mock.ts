// Stats
import { mdiCalendarToday, mdiCashMultiple, mdiAccountGroup, mdiCheckCircleOutline } from "@mdi/js"
import type { OwnerOverviewData } from "~/types/owner"

// Dashboard
export const ownerOverviewMock: OwnerOverviewData = {
  stats: [
    {
      key: "todayBookings",
      title: "Lượt đặt hôm nay",
      value: 12,
      subtitle: "So với hôm qua",
      changeText: "+20%",
      icon: mdiCalendarToday,
    },
    {
      key: "monthlyRevenue",
      title: "Doanh thu tháng này",
      value: "8.450.000đ",
      subtitle: "So với tháng trước",
      changeText: "+5%",
      icon: mdiCashMultiple,
    },
    {
      key: "newCustomers",
      title: "Khách hàng mới",
      value: 8,
      subtitle: "Trong 7 ngày gần nhất",
      changeText: "+12%",
      icon: mdiAccountGroup,
    },
    {
      key: "completedBookings",
      title: "Lượt đặt hoàn thành",
      value: 24,
      subtitle: "Trong tháng này",
      changeText: "+8%",
      icon: mdiCheckCircleOutline,
    },
  ],
  recentBookings: [
    {
      id: "#BK-2023",
      customerName: "Nguyễn Văn An",
      fieldName: "Sân A",
      sportName: "Bóng đá",
      timeLabel: "10:00 - 11:00",
      status: "confirmed",
    },
    {
      id: "#BK-2024",
      customerName: "Trần Minh Huy",
      fieldName: "Sân B",
      sportName: "Tennis",
      timeLabel: "11:00 - 12:00",
      status: "pending",
    },
    {
      id: "#BK-2025",
      customerName: "Lê Khánh Vy",
      fieldName: "Sân C",
      sportName: "Cầu lông",
      timeLabel: "14:00 - 15:30",
      status: "confirmed",
    },
    {
      id: "#BK-2026",
      customerName: "Phạm Quốc Bảo",
      fieldName: "Sân A",
      sportName: "Bóng đá",
      timeLabel: "16:00 - 17:00",
      status: "cancelled",
    },
  ],
  todaySchedule: [
    {
      id: "1",
      time: "10:00",
      title: "Buổi tập đội phong trào - Sân A",
      description: "Đã thanh toán",
      status: "success",
    },
    {
      id: "2",
      time: "11:00",
      title: "Trận tennis đôi - Sân B",
      description: "Đang chờ xác nhận",
      status: "warning",
    },
    {
      id: "3",
      time: "13:00",
      title: "Bảo trì mặt sân",
      description: "Sân C",
      status: "neutral",
    },
  ],
}

// Facilities
import type { OwnerFacilityItem } from "~/types/owner"

export const ownerFacilitiesMock: OwnerFacilityItem[] = [
  {
    id: 1,
    name: "Sunshine Sports Complex",
    status: "active",
    sportName: "Bóng đá",
    address: "123 Nguyễn Văn Linh",
    district: "Quận 7",
    city: "Hồ Chí Minh",
    openTime: "06:00",
    closeTime: "22:00",
    fieldsCount: 3,
    fields: [
      {
        id: 11,
        name: "Sân A",
        status: "active",
        priceFrom: 300000,
      },
      {
        id: 12,
        name: "Sân B",
        status: "active",
        priceFrom: 350000,
      },
      {
        id: 13,
        name: "Sân C",
        status: "maintenance",
        priceFrom: 280000,
      },
    ],
  },
  {
    id: 2,
    name: "Victory Badminton Hub",
    status: "pending_approve",
    sportName: "Cầu lông",
    address: "88 Lê Văn Thọ",
    district: "Gò Vấp",
    city: "Hồ Chí Minh",
    openTime: "05:30",
    closeTime: "23:00",
    fieldsCount: 2,
    fields: [
      {
        id: 21,
        name: "Sân 1",
        status: "active",
        priceFrom: 120000,
      },
      {
        id: 22,
        name: "Sân 2",
        status: "inactive",
        priceFrom: 120000,
      },
    ],
  },
  {
    id: 3,
    name: "Central Tennis Court",
    status: "inactive",
    sportName: "Tennis",
    address: "45 Điện Biên Phủ",
    district: "Bình Thạnh",
    city: "Hồ Chí Minh",
    openTime: "07:00",
    closeTime: "21:30",
    fieldsCount: 2,
    fields: [
      {
        id: 31,
        name: "Sân Tennis 1",
        status: "inactive",
        priceFrom: 400000,
      },
      {
        id: 32,
        name: "Sân Tennis 2",
        status: "inactive",
        priceFrom: 420000,
      },
    ],
  },
]

// Check-in
import type { OwnerCheckInBookingItem, OwnerCheckInHistoryItem } from "~/types/owner"

export const ownerCheckInBookingsMock: OwnerCheckInBookingItem[] = [
  {
    id: 1,
    bookingCode: "BK-2023-892",
    customerName: "Nguyễn Văn A",
    customerPhone: "0123 456 789",
    fieldName: "Sân 7 người - Sân A",
    bookingDate: "24/10/2023",
    timeLabel: "18:00 - 19:30 (90 phút)",
    totalAmount: 500000,
    depositAmount: 300000,
    remainingAmount: 200000,
    paymentStatus: "partially_paid",
    isCheckedIn: false,
  },
  {
    id: 2,
    bookingCode: "BK-2023-893",
    customerName: "Trần Văn B",
    customerPhone: "0988 111 222",
    fieldName: "Sân 5 người - Sân B",
    bookingDate: "24/10/2023",
    timeLabel: "17:45 - 18:45 (60 phút)",
    totalAmount: 400000,
    depositAmount: 400000,
    remainingAmount: 0,
    paymentStatus: "paid",
    isCheckedIn: true,
  },
]

export const ownerCheckInHistoryMock: OwnerCheckInHistoryItem[] = [
  {
    id: 1,
    checkedInTime: "17:45",
    customerName: "Trần Văn B",
    fieldName: "Sân 5 người - Sân B",
    status: "checked_in",
  },
  {
    id: 2,
    checkedInTime: "17:30",
    customerName: "Lê Thị C",
    fieldName: "Sân 7 người - Sân C",
    status: "checked_in",
  },
]

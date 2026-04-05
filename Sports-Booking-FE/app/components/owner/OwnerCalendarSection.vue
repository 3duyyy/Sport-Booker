<template>
  <div class="space-y-5">
    <v-card rounded="xl" class="border border-slate-200 shadow-sm">
      <v-card-text class="pa-5">
        <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 class="text-xl font-bold text-slate-900">Lịch sân</h2>
            <p class="mt-1 text-sm text-slate-500">
              Theo dõi lịch đặt của các cơ sở thể thao và các sân thuộc quyền quản lý của bạn.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <v-btn
              :variant="currentView === 'timeGridDay' ? 'flat' : 'outlined'"
              :color="currentView === 'timeGridDay' ? 'success' : undefined"
              rounded="xl"
              class="text-none"
              @click="changeView('timeGridDay')"
            >
              Ngày
            </v-btn>

            <v-btn
              :variant="currentView === 'timeGridWeek' ? 'flat' : 'outlined'"
              :color="currentView === 'timeGridWeek' ? 'success' : undefined"
              rounded="xl"
              class="text-none"
              @click="changeView('timeGridWeek')"
            >
              Tuần
            </v-btn>

            <v-btn
              :variant="currentView === 'dayGridMonth' ? 'flat' : 'outlined'"
              :color="currentView === 'dayGridMonth' ? 'success' : undefined"
              rounded="xl"
              class="text-none"
              @click="changeView('dayGridMonth')"
            >
              Tháng
            </v-btn>
          </div>
        </div>

        <div class="mt-5 flex flex-wrap gap-2">
          <v-chip
            v-for="facility in facilityItems"
            :key="facility.id"
            rounded="pill"
            :variant="selectedFacilityId === facility.id ? 'flat' : 'outlined'"
            :color="selectedFacilityId === facility.id ? 'success' : undefined"
            class="cursor-pointer"
            @click="selectedFacilityId = facility.id"
          >
            {{ facility.name }}
          </v-chip>
        </div>

        <div class="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
          <div class="flex items-center gap-2">
            <span class="legend-dot bg-green-600" />
            Đã xác nhận
          </div>

          <div class="flex items-center gap-2">
            <span class="legend-dot bg-amber-400" />
            Chờ xác nhận
          </div>

          <div class="flex items-center gap-2">
            <span class="legend-dot bg-sky-500" />
            Đã hoàn thành
          </div>

          <div class="flex items-center gap-2">
            <span class="legend-dot bg-rose-400" />
            Đã hủy
          </div>

          <div class="flex items-center gap-2">
            <span class="legend-dot bg-slate-400" />
            Bảo trì
          </div>
        </div>
      </v-card-text>
    </v-card>

    <v-card rounded="xl" class="border border-slate-200 shadow-sm overflow-hidden">
      <v-card-text class="pa-0">
        <div class="calendar-x-scroll">
          <ClientOnly>
            <FullCalendar ref="calendarRef" :options="calendarOptions" />
          </ClientOnly>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed, h, ref } from "vue"
import FullCalendar from "@fullcalendar/vue3"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import viLocale from "@fullcalendar/core/locales/vi"
import type { CalendarOptions, EventContentArg } from "@fullcalendar/core"
import type { OwnerCalendarEventItem, OwnerCalendarFacilityFilterItem } from "~/types/owner"

const props = defineProps<{
  facilityItems: OwnerCalendarFacilityFilterItem[]
  eventItems: OwnerCalendarEventItem[]
}>()

const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null)
const currentView = ref<"timeGridDay" | "timeGridWeek" | "dayGridMonth">("timeGridWeek")
const selectedFacilityId = ref<number | null>(props.facilityItems[0]?.id ?? null)

const filteredEvents = computed(() => {
  if (!selectedFacilityId.value) return []

  return props.eventItems
    .filter((item) => item.facilityId === selectedFacilityId.value)
    .map((item) => ({
      id: item.id,
      title: item.title,
      start: item.start,
      end: item.end,
      extendedProps: {
        facilityName: item.facilityName,
        fieldName: item.fieldName,
        status: item.status,
        customerName: item.customerName,
      },
      backgroundColor: getEventColor(item.status),
      borderColor: getEventColor(item.status),
      textColor: "#ffffff",
    }))
})

const changeView = (view: "timeGridDay" | "timeGridWeek" | "dayGridMonth") => {
  currentView.value = view
  calendarRef.value?.getApi().changeView(view)
}

const getEventColor = (status: OwnerCalendarEventItem["status"]) => {
  switch (status) {
    case "confirmed":
      return "#15803d"
    case "pending":
      return "#f59e0b"
    case "completed":
      return "#0ea5e9"
    case "cancelled":
      return "#fb7185"
    case "maintenance":
      return "#94a3b8"
    default:
      return "#64748b"
  }
}

const getStatusLabel = (status: OwnerCalendarEventItem["status"]) => {
  switch (status) {
    case "confirmed":
      return "Đã xác nhận"
    case "pending":
      return "Chờ xác nhận"
    case "completed":
      return "Hoàn thành"
    case "cancelled":
      return "Đã hủy"
    case "maintenance":
      return "Bảo trì"
    default:
      return "Không xác định"
  }
}

const renderEventContent = (arg: EventContentArg) => {
  const fieldName = arg.event.extendedProps.fieldName as string
  const status = arg.event.extendedProps.status as OwnerCalendarEventItem["status"]

  return h("div", { class: "owner-calendar-event" }, [
    h("div", { class: "owner-calendar-event__time" }, arg.timeText),
    h("div", { class: "owner-calendar-event__title" }, arg.event.title),
    h("div", { class: "owner-calendar-event__field" }, fieldName),
    h("div", { class: "owner-calendar-event__status" }, getStatusLabel(status)),
  ])
}

const calendarOptions = computed<CalendarOptions>(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  locales: [viLocale],
  locale: "vi",
  initialView: currentView.value,
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "",
  },
  buttonText: {
    today: "Hôm nay",
  },
  events: filteredEvents.value,
  allDaySlot: false,
  slotMinTime: "06:00:00",
  slotMaxTime: "22:00:00",
  slotDuration: "00:30:00",
  nowIndicator: true,
  editable: false,
  selectable: false,
  slotEventOverlap: false,
  eventMinHeight: 64,
  eventShortHeight: 56,
  contentHeight: 640,
  expandRows: false,
  stickyHeaderDates: true,
  eventContent: renderEventContent,
}))
</script>

<style scoped>
.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  display: inline-block;
}

:deep(.fc) {
  --fc-border-color: rgb(226 232 240);
  --fc-page-bg-color: #ffffff;
  --fc-neutral-bg-color: rgb(248 250 252);
  --fc-today-bg-color: rgba(34, 197, 94, 0.06);
  --fc-event-border-color: transparent;
  --fc-button-bg-color: rgb(22 163 74);
  --fc-button-border-color: rgb(22 163 74);
  --fc-button-hover-bg-color: rgb(21 128 61);
  --fc-button-hover-border-color: rgb(21 128 61);
  --fc-button-active-bg-color: rgb(21 128 61);
  --fc-button-active-border-color: rgb(21 128 61);
}

:deep(.fc-toolbar) {
  padding: 20px 20px 0;
  flex-wrap: wrap;
  gap: 12px;
}

:deep(.fc-toolbar-title) {
  font-size: 20px;
  font-weight: 700;
  color: rgb(15 23 42);
}

:deep(.fc-button) {
  border-radius: 14px;
  text-transform: none;
  box-shadow: none;
  font-weight: 600;
}

:deep(.fc-col-header-cell) {
  background: rgb(248 250 252);
}

:deep(.fc-col-header-cell-cushion) {
  color: rgb(51 65 85);
  font-weight: 700;
  text-decoration: none;
  padding: 12px 6px;
}

:deep(.fc-timegrid-slot-label-cushion),
:deep(.fc-timegrid-axis-cushion) {
  color: rgb(100 116 139);
  font-size: 12px;
}

:deep(.fc .fc-timegrid-slot) {
  height: 64px;
}

:deep(.fc-timegrid-now-indicator-line) {
  border-color: rgb(239 68 68);
}

:deep(.fc-timegrid-col.fc-day-today) {
  background: rgba(34, 197, 94, 0.06);
}

:deep(.fc-event) {
  border: none;
  border-radius: 14px;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.08);
}

:deep(.fc-timegrid-event) {
  inset-inline: 4px !important;
}

:deep(.fc-event-main) {
  padding: 0;
  height: 100%;
}

.owner-calendar-event {
  height: 100% !important;
  padding: 10px 12px;

  display: flex;
  flex-direction: column;

  gap: 4px;
  overflow: hidden;
}

.owner-calendar-event__time {
  font-size: 11px;
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
}

.owner-calendar-event__title {
  font-size: 13px;
  font-weight: 700;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.owner-calendar-event__field,
.owner-calendar-event__status {
  font-size: 11px;
  line-height: 1.2;
  opacity: 0.95;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.fc-scroller) {
  overflow: auto !important;
}

.calendar-x-scroll {
  overflow-x: auto;
}

:deep(.fc .fc-scrollgrid) {
  min-width: 2000px;
}

:deep(.fc-col-header-cell-cushion) {
  font-size: 14px;
  font-weight: 700;
  padding: 16px 8px;
}

:deep(.fc-timegrid-col) {
  min-width: 220px;
}

@media (max-width: 1280px) {
  :deep(.fc) {
    min-width: 1000px;
  }
}

@media (max-width: 768px) {
  :deep(.fc-toolbar) {
    padding: 16px 16px 0;
  }

  :deep(.fc-toolbar-title) {
    font-size: 16px;
  }

  :deep(.fc) {
    min-width: 900px;
  }
}
</style>

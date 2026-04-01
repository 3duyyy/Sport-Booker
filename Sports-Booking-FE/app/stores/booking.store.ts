import type { BookingDraft, PaymentOption } from "~/types/booking"

export const useBookingStore = defineStore("booking", {
  state: () => ({
    draft: null as BookingDraft | null,
    paymentOption: "deposit" as PaymentOption,
  }),

  getters: {
    depositAmount(state) {
      if (!state.draft) return 0
      return Math.round(state.draft.totalPrice * 0.3)
    },

    payableAmount(state) {
      if (!state.draft) return 0

      if (state.paymentOption === "deposit") {
        return Math.round(state.draft.totalPrice * 0.3)
      }

      return state.draft.totalPrice
    },

    selectedSlotLabel(state) {
      if (!state.draft || state.draft.slots.length === 0) return null

      const sorted = [...state.draft.slots].sort((a, b) => a.startTime.localeCompare(b.startTime))

      const first = sorted.at(0)
      const last = sorted.at(-1)

      if (!first || !last) return null

      return `${first.startTime} - ${last.endTime}`
    },
  },

  actions: {
    setDraft(payload: BookingDraft) {
      this.draft = payload
    },

    setPaymentOption(option: PaymentOption) {
      this.paymentOption = option
    },

    clearDraft() {
      this.draft = null
      this.paymentOption = "deposit"
    },
  },
})

import { z } from "zod"

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/

export const createBookingSchema = z.object({
  fieldId: z.number().int().positive("fieldId phải là số nguyên dương"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày phải đúng định dạng YYYY-MM-DD"),
  slots: z
    .array(
      z.object({
        startTime: z.string().regex(timeRegex, "Giờ bắt đầu không hợp lệ"),
        endTime: z.string().regex(timeRegex, "Giờ kết thúc không hợp lệ"),
      }),
    )
    .min(1, "Phải chọn ít nhất 1 khung giờ"),
  paymentOption: z.enum(["deposit", "full"]),
  note: z.string().max(500).optional(),
})

export type CreateBookingInput = z.infer<typeof createBookingSchema>

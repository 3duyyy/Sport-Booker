import { z } from "zod"

export const ownerFacilitySchema = z
  .object({
    name: z.string().min(2, "Tên cụm sân tối thiểu 2 ký tự"),
    sportId: z.number({ invalid_type_error: "Vui lòng chọn môn thể thao" }),
    address: z.string().min(5, "Địa chỉ tối thiểu 5 ký tự"),
    district: z.string().optional(),
    city: z.string().optional(),
    openTime: z.string().regex(/^\d{2}:\d{2}$/, "Định dạng HH:mm"),
    closeTime: z.string().regex(/^\d{2}:\d{2}$/, "Định dạng HH:mm"),
    description: z.string().optional(),
    utilityIds: z.array(z.number()).optional(),
    images: z.array(z.string()).max(4, "Tối đa 4 ảnh").optional(),
  })
  .refine((v) => v.openTime < v.closeTime, {
    path: ["closeTime"],
    message: "Giờ đóng cửa phải sau giờ mở cửa",
  })

export const ownerFieldSchema = z.object({
  name: z.string().min(2, "Tên sân tối thiểu 2 ký tự"),
  description: z.string().optional(),
  status: z.enum(["active", "maintenance", "inactive"]),
})

export const ownerFieldPricingSchema = z.object({
  pricings: z
    .array(
      z
        .object({
          startTime: z.string().regex(/^\d{2}:\d{2}$/),
          endTime: z.string().regex(/^\d{2}:\d{2}$/),
          pricePerHour: z.number().min(0),
          isWeekend: z.boolean().default(false),
        })
        .refine((v) => v.startTime < v.endTime, {
          path: ["endTime"],
          message: "Khung giờ không hợp lệ",
        }),
    )
    .min(1, "Cần ít nhất 1 khung giá"),
})

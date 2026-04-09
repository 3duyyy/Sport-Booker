import { z } from "zod"

const userStatusSchema = z.enum(["active", "banned", "pending_approve"])

export const adminUserActionSchema = z
  .object({
    fullName: z.string().trim().min(2, "Họ tên phải từ 2 ký tự").max(100, "Họ tên tối đa 100 ký tự"),
    email: z.string().trim().email("Email không hợp lệ"),
    phone: z.string().trim().max(20, "Số điện thoại tối đa 20 ký tự").optional().or(z.literal("")),
    roleId: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    status: userStatusSchema,
    isVerified: z.boolean(),
    avatarUrl: z.string().trim().max(500, "Avatar URL tối đa 500 ký tự").optional().or(z.literal("")),
    password: z.string().max(100, "Mật khẩu tối đa 100 ký tự").optional().or(z.literal("")),
    requirePassword: z.boolean(),
  })
  .superRefine((data, ctx) => {
    const hasPhone = !!data.phone && data.phone.length > 0
    if (hasPhone && !/^(0|\+84)\d{9,10}$/.test(data.phone!)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phone"],
        message: "Số điện thoại không hợp lệ",
      })
    }

    if (data.avatarUrl && data.avatarUrl.length > 0) {
      try {
        new URL(data.avatarUrl)
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["avatarUrl"],
          message: "Avatar URL không hợp lệ",
        })
      }
    }

    const password = data.password ?? ""
    if (data.requirePassword) {
      if (password.length < 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message: "Mật khẩu phải có ít nhất 6 ký tự",
        })
      }
    } else {
      if (password.length > 0 && password.length < 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message: "Mật khẩu mới phải có ít nhất 6 ký tự",
        })
      }
    }
  })

export type AdminUserActionInput = z.infer<typeof adminUserActionSchema>

import { z } from "zod"

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự!"),
    email: z.string().email("Email không hợp lệ!"),
    phone: z.string().regex(/^(0|\+84)\d{9,10}$/, "Số điện thoại không hợp lệ!"),
    password: z
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .regex(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ hoa")
      .regex(/[a-z]/, "Mật khẩu phải có ít nhất 1 chữ thường"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp!",
    path: ["confirmPassword"],
  })

export type RegisterInput = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),

  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
})

export type LoginInput = z.infer<typeof loginSchema>

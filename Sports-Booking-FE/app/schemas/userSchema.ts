import { z } from "zod"
import { toTypedSchema } from "@vee-validate/zod"

export const userProfileSchema = toTypedSchema(
  z.object({
    fullName: z.string().min(1, "Họ và tên không được để trống"),
    phone: z.string().optional().or(z.literal("")),
    bankName: z.string().optional().or(z.literal("")),
    bankAccount: z.string().optional().or(z.literal("")),
    accountHolder: z.string().optional().or(z.literal("")),
  }),
)

import * as z from "zod"

export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  is2FAEnabled: z.optional(z.boolean()),
  role: z.enum(["ADMIN", "STUDENT", "TEACHER", "USER"]),
  email: z.optional(z.string().email()),
  password: z.optional(z.string().min(6)),
  newPassword: z.optional(z.string().min(6)),
})
  .refine((data) => {
    if (data.password && !data.newPassword) {
      return false;
    }

    return true;
  }, {
    message: "New password is required!",
    path: ["newPassword"]
  })
  .refine((data) => {
    if (data.newPassword && !data.password) {
      return false;
    }

    return true;
  }, {
    message: "Password is required!",
    path: ["password"]
  })


export const LoginSchema = z.object({
  email: z.string().email({
    message: "email is required"
  }),
  password: z.string().min(1,{
    message: "Password is required"
  }),
  code: z.optional(z.string()),
}) 

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "email is required"
  }),
  password: z.string().min(6,{
    message: "Minimum 6 charaers is required"
  }),
  name: z.string().min(1,{
    message: "Name is required"
  }),
}) 

export const ResetSchema = z.object({
  email: z.string().email({
    message: "email is required"
  }),
}) 

export const NewPasswordSchema = z.object({
  password: z.string().min(6,{
    message: "Minimum 6 charaers is required"
  }),
}) 
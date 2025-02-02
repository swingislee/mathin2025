"use server"

import * as z from "zod";

import { ResetSchema } from "@/schemas/auth"
import { getUserByEmail } from "@/data/auth/user";
import { sendPasswordResetEmail } from "@/lib/auth/mail";
import { generatePasswordResetToken } from "@/lib/auth/tokens";

export const reset = async (values: z.infer<typeof ResetSchema>, lng:string) => {
  const validatedFields = ResetSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid email" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email); 

  if (!existingUser) {
    return { error: "Email not found!" }
  }

  const passwordResetToken = await generatePasswordResetToken(email);

  if (!passwordResetToken || !passwordResetToken.email) return { error: "Something went wrong" };

  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token,
  )

  return { success: "Reset email sent!" }
}
"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { unstable_update } from "@/auth";
import { createClient } from "@/utils/supabase/server";
import { SettingsSchema } from "@/schemas/auth";
import { getUserByEmail, getUserById } from "@/data/auth/user";
import { currentUser } from "@/lib/auth/user";
import { generateVerificationToken } from "@/lib/auth/tokens";
import { sendVerificationEmail } from "@/lib/auth/mail";

export const settings = async (
  values: z.infer<typeof SettingsSchema>
) => {
  const user = await currentUser();
  const supabase = await createClient();

  if (!user || !user.id) {
    return { error: "Unauthorized" }
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorized" }
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.is2FAEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use!" }
    }

    const verificationToken = await generateVerificationToken(
      values.email,
      user.id,
    );

    if (!verificationToken || !verificationToken.email) return { error: "Something went wrong" };
    if (!verificationToken.token) return { error: "Something went wrong" };

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return { success: "Verification email sent!" };
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password,
    );

    if (!passwordsMatch) {
      return { error: "Incorrect password!" };
    }

    const hashedPassword = await bcrypt.hash(
      values.newPassword,
      10,
    );
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  const { data:updatedUser } = await supabase
    .schema('next_auth')
    .from('users') // Adjust with your actual table name
    .update({
      ...values,
    })
    .match({ id: dbUser.id })// Specify the record to update
    .select()
    .single();

  if (!updatedUser) return { error: "Something went wrong" };
  
  unstable_update({
    user: {
      name: updatedUser.name,
      email: updatedUser.email,
      is2FAEnabled: updatedUser.is2FAEnabled!,
      role: updatedUser.role,
    }
  });

  return { success: "Settings Updated!" }
}
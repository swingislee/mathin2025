"use server"

import * as z from "zod";
import bcrypt from "bcryptjs"

import { createClient } from "@/utils/supabase/server";

import { NewPasswordSchema } from "@/schemas/auth";
import { getPasswordResetTokenByToken } from "@/data/auth/password-reset-token";
import { getUserByEmail } from "@/data/auth/user";


export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>, 
  token?: string | null,
  lng?: string,
) => {
  const supabase = await createClient();

  if (!token) {
    return {error: "Missing token!" }
  }

  const validatedFields = NewPasswordSchema.safeParse(values);  

  if(!validatedFields.success){
    return{ error: "invalid fields"}
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "invalid token" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date() ;
  
  if (hasExpired) {
    return { error: "Token has expired" }
  }

  const existingUser = await getUserByEmail(existingToken.email)

  if (!existingUser) {
    return { error: "Email does not exist" };   
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await supabase
    .schema("next_auth")
    .from('users') // Use your actual table name
    .update({ password: hashedPassword }) // Column to be updated
    .match({ id: existingUser.id }); // Matching condition

  await supabase
    .schema("next_auth")
    .from('password_reset_token') // Use your actual table name
    .delete() // Deletion operation
    .match({ id: existingToken.id }); // Matching condition for deletion

  return { success: "Password update"}
}
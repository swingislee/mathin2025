/* trunk-ignore-all(prettier) */
"use server"

import * as z from "zod";
import bcrypt from "bcryptjs"
import { createClient } from "@/utils/supabase/server";

import { RegisterSchema } from "@/schemas/auth";
import { getUserByEmail } from "@/data/auth/user";
import { generateVerificationToken } from "@/lib/auth/tokens";
import { sendVerificationEmail } from "@/lib/auth/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const supabase = await createClient();

  const validatedFields = RegisterSchema.safeParse(values)

  if(!validatedFields.success){
    return{ error: "invalid fields"}
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10)

  const existingUser = await getUserByEmail(email);
  if  (existingUser) {
    return { error: "Email already in use!" }
  }

  const { error } = await supabase
  .schema("next_auth")
  .from('users') 
  .insert([
    { 
      email: email,
      name:name,
      password:hashedPassword 
    },
  ])
  .select()  
  

  const verificationToken = await generateVerificationToken(email);

  if (!verificationToken || !verificationToken.email || !verificationToken.token) return { error: "Something went wrong" };

  await sendVerificationEmail(
    verificationToken.email,
    verificationToken.token,
  )

  return { success: "Confirmation email sent!" }
};  
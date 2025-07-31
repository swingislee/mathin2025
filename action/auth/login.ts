"use server"
import * as z from "zod";
import bcrypt from "bcryptjs"

import { LoginSchema } from "@/schemas/auth";
import { getUserByEmail } from "@/data/auth/user";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { 
  generateVerificationToken,
  generateTwoFactorToken 
} from "@/lib/auth/tokens";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/auth/mail";
import { getTwoFactorConfirmationByUserId } from "@/data/auth/two-factor-confirmation";
import { getTwoFactorTokenByEmail } from "@/data/auth/two-factor-token";
import { createClient } from "@/utils/supabase/server";


export const login = async (
  values: z.infer<typeof LoginSchema>, 
  lng:string,
  callbackUrl?:string | null,
) => {
  const supabase = await createClient();
  const validatedFields = LoginSchema.safeParse(values);  

  if(!validatedFields.success){
    return{ error: "invalid fields"}
  }

  const { email, password, code } = validatedFields.data;
  
  const existingUser = await getUserByEmail(email);
  
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist"}
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email,
      existingUser.id
    );

    if (!verificationToken || !verificationToken.email) return { error: "Something went wrong" };

    if (!verificationToken.token) return { error: "Something went wrong" };

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    )

    return { success: " Confirmation email sent!" };
  }

  if (existingUser.is2FAEnabled && existingUser.email) {
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return { error: "Invalid credentials!" };
    }


    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)
    
      if (!twoFactorToken) {
        return { error: "Invalid code!"}
      }

      if (twoFactorToken.token !== code) {
        return { error: "Invalid code!"}
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: "Code expired!" }
      }

      await supabase
        .schema("next_auth")
        .from('two_factor_token') // Use the actual table name
        .delete()
        .match({ id: twoFactorToken.id });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

      if (existingConfirmation) {
        await supabase
          .schema("next_auth")
          .from('2fa_confirmation') // Use the actual table name
          .delete()
          .match({ id: existingConfirmation.id });
      }
      
      await supabase
        .schema("next_auth")
        .from('2fa_confirmation') // Use the actual table name
        .insert([
          { userId: existingUser.id }
        ]);

    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email)

      if (!twoFactorToken) return { error:"something went wrong" } 

      await sendTwoFactorTokenEmail(
        twoFactorToken.email,
        twoFactorToken.token
      )
      return { twoFactor: true}
    }
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError) {
    return { error: signInError.message }
  }

  return { success: "Logged in", redirectTo: callbackUrl || `/${lng}${DEFAULT_LOGIN_REDIRECT}` }
}
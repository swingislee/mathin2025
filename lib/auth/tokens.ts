import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/utils/supabase/server";
import crypto from "crypto";

import { getVerificationTokenByEmail } from "@/data/auth/verification-token";
import { getPasswordResetTokenByEmail } from "@/data/auth/password-reset-token";
import { getTwoFactorTokenByEmail } from "@/data/auth/two-factor-token";

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100000, 999999).toString();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000).toISOString();
  const supabase = await createClient();

  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    await supabase
    	.schema('next_auth')
      .from('two_factor_token')
      .delete()
      .match({ id: existingToken.id });
  }

  const { data: twoFactorToken } = await supabase
    .schema('next_auth')
    .from('two_factor_token')
    .insert([
      { email, token, expires }
    ])
    .select()
    .single();

  return twoFactorToken;
};


export const generateVerificationToken = async (email:string, userId?:string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000).toISOString();
  const supabase = await createClient();

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await supabase
      .schema('next_auth')
      .from('verification_tokens')
      .delete()
      .match({ id: existingToken.id });
  }

  const { data: verificationToken,error } = await supabase
    .schema('next_auth')
    .from('verification_tokens')
    .insert([
      { userId, email, token, expires }
    ])    
    .select(`email,userId,token,expires`)
    .single();
    console.log(error);
  return verificationToken; 
};



export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000).toISOString();
  const supabase = await createClient();

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await supabase
      .schema('next_auth')
      .from('password_reset_token')
      .delete()
      .match({ id: existingToken.id });
  }

  const { data: passwordResetToken } = await supabase
    .schema('next_auth')
    .from('password_reset_token')
    .insert([
      { email, token, expires }
    ])
    .select()
    .single();

  console.log("passwordResetToken",passwordResetToken)
  return passwordResetToken;
};
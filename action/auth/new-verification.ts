"use server"

import { createClient } from "@/utils/supabase/server";
import { getUserByEmail } from "@/data/auth/user";
import { getVerificationTokenByToken } from "@/data/auth/verification-token";
import { getUserById } from "@/data/auth/user";

export const newVerification = async (token: string) => {
  const supabase = await createClient();
  
  const existingToken = await getVerificationTokenByToken(token)

  if (!existingToken || (!existingToken.userId && !existingToken.email)) {
    return { error: "Token does not exist!" };
  }
  const hasExpired = new Date(existingToken.expires) < new Date() ;
  
  if (hasExpired) {
    return { error: "Token has expired" }
  }

  let existingUser;

  // If userId exists, fetch user by userId
  if (existingToken.userId) {
    existingUser = await getUserById(existingToken.userId);
  } 
  // Otherwise, if email exists (and userId does not), fetch user by email
  else if (existingToken.email) {
    existingUser = await getUserByEmail(existingToken.email);
  }

  if (!existingUser) {
    return { error: "User does not exist" };   
  }

  await supabase
    .schema("next_auth")
    .from("users")
    .update({email:existingToken.email,emailVerified:new Date().toISOString()})
    .eq('id', existingUser.id)

  await supabase
    .schema("next_auth")
    .from("verification_tokens")
    .delete()
    .eq('id',existingToken.id);

  return { success:"Email verified" }
  }


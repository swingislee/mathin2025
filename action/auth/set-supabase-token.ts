'use server'

import jwt from "jsonwebtoken"
import { cookies } from 'next/headers'

export const setSupabaseToken = async (session:any) => {
  const cookieStore = await cookies()
  const signingSecret = process.env.SUPABASE_JWT_SECRET

  if (signingSecret && session) {
    const payload = {
      aud: "authenticated",
      exp: Math.floor(new Date().getTime() / 1000),
      sub: session.user.id,
      email: session.user.email,
      role: "authenticated",
    }

    const supabaseAccessToken = jwt.sign(payload, signingSecret)    
    
    cookieStore.set('supabaseAccessToken', supabaseAccessToken)

  } 
};





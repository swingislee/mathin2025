'use client';
import { useState, useEffect } from 'react'
import { Session } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'

export const useSupabaseSession = () => {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess)
    })
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return session
}

// useStarsCounts.ts
'use client'
import useSWR from 'swr'
import { useEffect, useMemo, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'

type BroadcastPayload = {
  student_id: string
  change: number
}

type Counts = Record<string, number>
type StarsRow = { student_id: string; stars: number }

type Options = {
  pageIndex?: number | null
  refreshInterval?: number      // 兜底轮询，默认 30000 ms
  dedupingInterval?: number     // 合并短时间重复刷新，默认 800 ms
  revalidateOnFocus?: boolean   // 课堂建议 false
  revalidateOnReconnect?: boolean
}

export function useStarsCounts(sessionId: string, opts: Options = {}) {
  const {
    pageIndex = null,
    refreshInterval = 30000,
    dedupingInterval = 800,
    revalidateOnFocus = false,
    revalidateOnReconnect = true,
  } = opts

  const supabase = useMemo(() => createClient(), [])
  const key = useMemo(() => ['stars', sessionId, pageIndex] as const, [sessionId, pageIndex])

  const fetcher = async (): Promise<Counts> => {
    const { data, error } = await supabase
      .schema('edu_core')
      .rpc('stars_by_session', { p_session_id: sessionId})
    if (error) throw error
    return Object.fromEntries((data ?? []).map((r: StarsRow) => [r.student_id, r.stars]))
  }

  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    revalidateOnFocus,
    revalidateOnReconnect,
    dedupingInterval,
    refreshInterval,
  })

  // broadcast 订阅：收到通知就 revalidate
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)
  useEffect(() => {
    const channel = supabase.channel(`stars_channel_${sessionId}`, {
      config: { broadcast: { self: false } }
    })
    channel.on('broadcast', { event: 'star_updated' }, () => mutate())
    channel.subscribe()
    channelRef.current = channel
    return () => {
      channel.unsubscribe()
    }
  }, [supabase, sessionId, mutate])

  // 暴露一个发送广播的方法
  const broadcast = (payload: BroadcastPayload) =>
    channelRef.current?.send({ type: 'broadcast', event: 'star_updated', payload })

  return {
    counts: data ?? {},
    isLoading,
    error,
    mutate,
    broadcast,
    supabase, // 也暴露，减少组件里重复 createClient
  }
}

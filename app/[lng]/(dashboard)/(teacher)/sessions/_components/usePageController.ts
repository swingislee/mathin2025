'use client'

import { useEffect, useRef, useMemo } from 'react'
import { createClient } from '@/utils/supabase/client'

/**
 * 不再拉取 current_page，只负责订阅 & 翻页处理
 * @param sessionId
 * @param selectedIndex 当前页，由页面自己维护并初始化
 * @param setSelectedIndex 用于更新页面组件的选中页
 */
export function usePageController(
  sessionId: string,
  selectedIndex: number,
  setSelectedIndex: (page: number) => void
) {
  const supabase = useMemo(() => createClient(), [])
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  // 1) 订阅广播，同步多端
  useEffect(() => {
    const channel = supabase.channel(`page_channel_${sessionId}`, {
      config: { broadcast: { self: false } }
    })
    channel.on('broadcast', { event: 'page_changed' }, ({ payload }) => {
      if (typeof payload.page === 'number') {
        setSelectedIndex(payload.page)
      }
    })
    channel.subscribe()
    channelRef.current = channel

    return () => {
      channel.unsubscribe()
    }
  }, [supabase, sessionId, setSelectedIndex])

  // 2) 翻页处理：乐观更新 + 写库 + 广播 + 回滚
  const handlePageChange = async (newPage: number) => {
    const oldPage = selectedIndex

    // 乐观更新 UI
    setSelectedIndex(newPage)

    // 持久化到数据库
    const { error } = await supabase
      .schema('edu_core')
      .from('sessions')
      .update({ current_page: newPage, updated_at: new Date().toISOString() })
      .eq('id', sessionId)

    if (error) {
      console.error('更新 current_page 失败', error)
      // 回滚
      setSelectedIndex(oldPage)
      return
    }

    // 广播给其他客户端
    channelRef.current?.send({
      type: 'broadcast',
      event: 'page_changed',
      payload: { page: newPage }
    })
  }

  return { handlePageChange }
}

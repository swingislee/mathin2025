'use client'

import { useState, useRef, useLayoutEffect, useMemo, useEffect } from 'react'
import { StarIcon, MoreVertical } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { StudentsRow } from '@/action/teacher/fetch-students'

interface StudentRankingProps {
  students: StudentsRow[]
  sessionId: string
  pageIndex: number
}

export function StudentRanking({
  students,
  sessionId,
  pageIndex,
}: StudentRankingProps) {
  /* ──────────────── Supabase client ──────────────── */
  const supabase = useMemo(
    () => createClient(),
    []
  )

  /* ──────────────── 本地状态 ──────────────── */
  const [starsMap, setStarsMap] = useState<Record<string, number>>({})

  /* ──────────────── 拉历史 + 订阅实时变动 ──────────────── */
  useEffect(() => {
    if (!supabase) return

    let channel: ReturnType<typeof supabase.channel> | undefined

    async function init() {
      /* 1. 先拉一次历史数据 */
      const { data, error } = await supabase
        .schema('edu_core')
        .from('student_stars')
        .select('student_id')
        .eq('session_id', sessionId)

      if (error) {
        console.error('fetch student_stars error →', error)
        return
      }

      const map: Record<string, number> = {}
      data?.forEach(r => {
        map[r.student_id] = (map[r.student_id] || 0) + 1
      })
      setStarsMap(map)

      console.log("init start")
      /* 2. 创建 Realtime 通道 */
      channel = supabase
        .channel('student_stars_changes')
        // INSERT
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'edu_core',
            table: 'student_stars',
            filter: `session_id=eq.${sessionId}`,
          },
          payload => {
            console.log("payload",payload)
            setStarsMap(prev => ({
              ...prev,
              [payload.new.student_id]:
                (prev[payload.new.student_id] || 0) + 1,
            }))
          },
        )
        // DELETE
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'edu_core',
            table: 'student_stars',
            filter: `session_id=eq.${sessionId}`,
          },
          payload => {
            setStarsMap(prev => {
              const sid = payload.old.student_id
              const cnt = Math.max((prev[sid] || 1) - 1, 0)
              return { ...prev, [sid]: cnt }
            })
          },
        )
        .subscribe(status => console.log('channel status →', status))
    }

    init()

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [supabase, sessionId])

  /* ──────────────── 点名加 / 减星 ──────────────── */
  const handleAddStar = async (studentId: string) => {
    await supabase
      .schema('edu_core')
      .from('student_stars')
      .insert({
        session_id: sessionId,
        student_id: studentId,
        page_index: pageIndex,
      })
  }

  const handleRemoveStar = async (studentId: string) => {
    const { data } = await supabase
      .schema('edu_core')
      .from('student_stars')
      .select('id')
      .eq('session_id', sessionId)
      .eq('student_id', studentId)
      .limit(1)

    if (data?.[0]?.id) {
      await supabase
        .schema('edu_core')
        .from('student_stars')
        .delete()
        .eq('id', data[0].id)
    }
  }

  /* ──────────────── 20 个槽位 ──────────────── */
  const slots = [
    ...students,
    ...Array(Math.max(0, 20 - students.length)).fill(null),
  ].slice(0, 20)

  /* ──────────────── 计算单行可展示星星数 ──────────────── */
  const starAreaRef = useRef<HTMLDivElement>(null)
  const [maxIcons, setMaxIcons] = useState(0)

  useLayoutEffect(() => {
    function calcMax() {
      const area = starAreaRef.current
      if (!area) return

      const icon = area.querySelector('svg') as SVGElement | null
      const iconW = icon ? icon.getBoundingClientRect().width : 16
      const gap = parseFloat(getComputedStyle(area).columnGap) || 4

      const available = area.clientWidth
      const max = Math.floor((available + gap) / (iconW + gap))
      setMaxIcons(max)
    }

    calcMax()
    window.addEventListener('resize', calcMax)
    return () => window.removeEventListener('resize', calcMax)
  }, [students])

  /* ──────────────── JSX ──────────────── */
  return (
    <div className="h-full flex flex-col p-2">
      <div className="grid grid-rows-20 gap-1 flex-1">
        {slots.map((stu, idx) => (
          <div
            key={idx}
            className="flex items-center px-2 bg-white rounded shadow-lg"
          >
            {stu ? (
              <>
                {/* 姓名：点击加星 */}
                <span
                  className="shrink-0 text-sm font-medium truncate cursor-pointer transition-transform hover:scale-105"
                  onClick={() => handleAddStar(stu.student_id)}
                >
                  {stu.student_name}
                </span>

                {/* Star 区域 */}
                <div
                  ref={idx === 0 ? starAreaRef : undefined}
                  className="ml-2 flex gap-x-1"
                >
                  {(() => {
                    const count = starsMap[stu.student_id] || 0
                    if (count === 0) return null
                    if (count > maxIcons) {
                      return (
                        <span
                          className="text-sm text-yellow-500 font-semibold cursor-pointer"
                          onClick={() => handleRemoveStar(stu.student_id)}
                        >
                          ⭐ × {count}
                        </span>
                      )
                    }
                    return Array(count)
                      .fill(0)
                      .map((_, i) => (
                        <StarIcon
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-current shrink-0 cursor-pointer transition-transform hover:scale-125"
                          onClick={() => handleRemoveStar(stu.student_id)}
                        />
                      ))
                  })()}
                </div>

                {/* 预留扩展按钮 */}
                <div className="shrink-0 ml-auto">
                  <MoreVertical className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-white rounded" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

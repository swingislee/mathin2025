'use client'

import { useState, useRef, useLayoutEffect, useMemo } from 'react'
import { StarIcon, EllipsisVertical } from 'lucide-react'
import { StudentsRow } from '@/actions/teacher/fetch-students'
import { Database } from '@/utils/types/supabase'
import { useStarsCounts } from './useStarsCounts'

type StudentStarsRow = Database['edu_core']['Tables']['student_stars']['Row']
type UIStudent = StudentsRow & { starsThisSession: number }


export function StudentRanking({
  students,
  sessionId,
  pageIndex
}: {
  students: StudentsRow[];
  sessionId: string;
  pageIndex: number;
}) {
   const { counts, mutate, broadcast, supabase } = useStarsCounts(sessionId, {
    refreshInterval: 30000,       // 30s 兜底
    revalidateOnFocus: false,     // 课堂场景
    revalidateOnReconnect: true,
    dedupingInterval: 800,
  })

  // 渲染合成
  const localStudents: UIStudent[] = useMemo(
    () => students.map(s => ({ ...s, starsThisSession: counts[s.student_id] ?? 0 })),
    [students, counts]
  )

    // 添加星星—— 交互：乐观 + 写库 + 广播 + 失败回滚（mutate()）——
  const handleAddStar = async (studentId: string) => {
    // 乐观
    mutate(prev => ({ ...prev, [studentId]: (prev?.[studentId] ?? 0) + 1 }), false)

    const { error } = await supabase
      .schema('edu_core')
      .from('student_stars')
      .insert({
        session_id: sessionId,
        student_id: studentId,
        page_index: pageIndex,
      } satisfies Omit<StudentStarsRow, 'id' | 'created_at'>)

    if (error) {
      console.error('insert star error:', error)
      await mutate() // 回滚/校准
      return
    }
    broadcast({ student_id: studentId, change: 1 })
  }

// 减少星星（RPC 原子删除 + 乐观更新 + 失败回滚）
  const handleRemoveStar = async (studentId: string) => {
    mutate(prev => ({ ...prev, [studentId]: Math.max((prev?.[studentId] ?? 0) - 1, 0) }), false)

    const { data, error } = await supabase
      .schema('edu_core')
      .rpc('remove_latest_star', {
        p_session_id: sessionId,
        p_student_id: studentId,
        p_page_index: pageIndex ?? null,
      })

    if (error || !data?.length) {
      console.error('[remove_latest_star] failed:', error)
      await mutate() // 回滚/校准
      return
    }
    broadcast({ student_id: studentId, change: -1 })
  }


  // 填满 20 个槽位
  const slots = [
    ...localStudents,
    ...Array(Math.max(0, 20 - students.length)).fill(null),
  ].slice(0, 20)

  // 用于测量第一行星星可用宽度
  const starAreaRef = useRef<HTMLDivElement>(null)
  const [maxIcons, setMaxIcons] = useState(0)

  // 在布局后测量，并在窗口尺寸变化或 students 改变时重新计算
  useLayoutEffect(() => {
    function calcMax() {
      const area = starAreaRef.current
      if (!area) return

      const icon      = area.querySelector('svg') as SVGElement | null
      const iconW     = icon ? icon.getBoundingClientRect().width : 16
      const gap       = parseFloat(getComputedStyle(area).columnGap) || 4

      const available = area.clientWidth
      const max = Math.floor((available + gap) / (iconW + gap))

      setMaxIcons(max)
    }

    calcMax()
    window.addEventListener('resize', calcMax)
    return () => window.removeEventListener('resize', calcMax)
  }, [localStudents])

  return (
    <div className="h-full flex flex-col p-2">
      <div className="grid grid-rows-20 gap-1 flex-1">
        {slots.map((stu, idx) => (
          <div
            key={idx}
            className="flex items-center px-2 bg-white dark:bg-slate-800 rounded shadow-lg"
          >
            {stu ? (
              <>
               {/* 姓名，点击加星 */}
                <span
                  className="shrink-0 text-sm font-medium truncate cursor-pointer"
                  onClick={() => handleAddStar(stu.student_id)}
                >
                  {stu.student_name}
                </span>

                {/* 星星区域，点击可减星 */}
                <div
                  ref={idx === 0 ? starAreaRef : undefined}
                  className="ml-4 flex-1 flex items-center gap-1 overflow-hidden min-w-0 cursor-pointer"
                  onClick={() => handleRemoveStar(stu.student_id)}
                >
                  {/* 超出 maxIcons 则显示数字 */}
                  {(stu.starsThisSession ?? 0) > maxIcons ? (
                    <span className="flex flex-row text-sm text-yellow-500 font-semibold items-center">
                      <StarIcon className="w-4 h-4 text-yellow-400 fill-current shrink-0 mr-1"/> × {stu.starsThisSession}
                    </span>
                  ) : (
                    [...Array(stu.starsThisSession ?? 0)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current shrink-0"
                      />
                    ))
                  )}
                </div>

                {/* 加星按钮，固定在最右 */}
                <button
                  className="shrink-0 ml-4 text-gray-300 hover:text-gray-800"
                >
                  <EllipsisVertical className="w-5 h-5" />
                </button>
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

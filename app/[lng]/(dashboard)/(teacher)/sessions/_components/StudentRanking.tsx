'use client'

import { useState, useRef, useLayoutEffect } from 'react'
import { StarIcon, PlusCircle } from 'lucide-react'

export type Student = {
  student_id: string
  student_name: string
  starsThisSession?: number
}

export function StudentRanking({
  students,
  onAddStar,
}: {
  students: Student[]
  onAddStar: (studentId: string) => void
}) {
  // 填满 20 个槽位
  const slots = [
    ...students,
    ...Array(Math.max(0, 20 - students.length)).fill(null),
  ].slice(0, 20)

  // 用于测量第一行星星可用宽度
  const starAreaRef = useRef<HTMLDivElement>(null)
  const [maxIcons, setMaxIcons] = useState(0)

  // 在布局后测量，并在窗口尺寸变化或 students 改变时重新计算
  useLayoutEffect(() => {
      function calcMax() {
        const el = starAreaRef.current
        if (!el) return

        const ICON_W = 16      // .w-4
        const GAP     = 4      // .gap-1
        const available = el.clientWidth        // 直接用星星区域真实宽度

        // 最后一个 icon 右侧没有 gap，要补回一个 GAP
        const max = Math.floor((available + GAP) / (ICON_W + GAP))
        setMaxIcons(max > 0 ? max : 0)
      }

    calcMax()
    window.addEventListener('resize', calcMax)
    return () => window.removeEventListener('resize', calcMax)
  }, [students])

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
                {/* 姓名，固定不收缩 */}
                <span className="flex-shrink-0 text-sm font-medium truncate">
                  {stu.student_name}
                </span>

                {/* 星星 区域，第一行绑定 ref，左右留空隙 */}
                <div
                  ref={idx === 0 ? starAreaRef : undefined}
                  className="ml-4 flex-1 flex items-center gap-1 overflow-hidden min-w-0"
                >
                  {/* 超出 maxIcons 则显示数字 */}
                  {(stu.starsThisSession ?? 0) > maxIcons ? (
                    <span className="text-sm text-yellow-500 font-semibold">
                      ⭐ × {stu.starsThisSession}
                    </span>
                  ) : (
                    [...Array(stu.starsThisSession ?? 0)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current flex-shrink-0"
                      />
                    ))
                  )}
                </div>

                {/* 加星按钮，固定在最右 */}
                <button
                  className="flex-shrink-0 ml-4 text-green-500 hover:text-green-600"
                  onClick={() => onAddStar(stu.student_id)}
                >
                  <PlusCircle className="w-5 h-5" />
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

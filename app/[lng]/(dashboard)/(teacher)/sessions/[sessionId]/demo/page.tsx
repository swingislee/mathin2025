'use client'

import { fetchLectureResources, SessionWithResources } from '@/action/teacher/fetch-lecture-resources'
import { useParams } from 'next/navigation'
 import { useEffect, useState, useMemo, useRef, useLayoutEffect } from 'react'
import Image from 'next/image'
import WhiteToolbar from '@/components/handwriting/WhiteToolbar'
import { CanvasBoard } from '@/components/handwriting/CanvasBoard'
import { useCanvasControl } from '@/components/handwriting/canvasStore'
import { ResourcePager } from '../../_components/ResourcePager'
import { fetchStudents,StudentsRow } from '@/action/teacher/fetch-students'
import { StudentRanking } from '../../_components/StudentRanking'

type StudentWithStars = StudentsRow & { starsThisSession?: number }


export default function Page() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const [sessions, setSessions] = useState<SessionWithResources[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [students, setStudents] = useState<StudentWithStars[]>([])
  const { tool } = useCanvasControl()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  // Fetch and initialize
  useEffect(() => {
    fetchLectureResources(sessionId)
      .then(data => {
        setSessions(data)
        setSelectedIndex(0)
      })
      .catch(err => console.error('fetchLectureResources error:', err))

    fetchStudents(sessionId)
      .then(data => {
        setStudents(data.map(s => ({ ...s, starsThisSession: 0 })))
      })
      .catch(console.error)
  }, [sessionId])

  // Flatten, filter for “main” slot, sort by display_order
  const mainResources = useMemo(() => {
    return sessions
      .flatMap(s => s.lectures?.lecture_resources ?? [])
      .filter(r => r.slot === 'main' && r.resources.metadata != null)
      .sort((a, b) => a.display_order - b.display_order)
  }, [sessions])

  // Current resource (may be undefined if no resources yet)
  const current = mainResources[selectedIndex]

  useLayoutEffect(() => {
    const wrap = wrapperRef.current
    const board = boardRef.current
    if (!wrap || !board) return

    const calc = () => {
      const { width: W, height: H } = wrap.getBoundingClientRect()

      let w = W, h = (W * 9) / 16    // 先假设用宽度算高度
      if (h > H) {                  // 竖屏时高度超了
        h = H
        w = (H * 16) / 9             // 用高度反算宽度
      }

      // 直接写行内样式，彻底跳过 Safari 的 flex 逻辑
      board.style.width = w + 'px'
      board.style.height = h + 'px'
    }

    calc()                          // 首次
    const ro = new ResizeObserver(calc)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [])


  // 简单的加星函数
  const handleAddStar = (studentId: string) => {
    setStudents(prev =>
      prev.map(s =>
        s.student_id === studentId
          ? { ...s, starsThisSession: (s.starsThisSession ?? 0) + 1 }
          : s
      )
    )
  }

  return (
    <div className="flex h-full overflow-hidden">

       {/* main  */}
      <main 
        ref={wrapperRef} 
        className="flex flex-grow bg-amber-200 justify-center items-center max-h-full min-h-0 min-w-0"  
        onDragStart={e => e.preventDefault()}
        onContextMenu={e => e.preventDefault()}
        style={{
          WebkitUserSelect: 'none',
          userSelect: 'none',
          WebkitTouchCallout: 'none',
          touchAction: 'none'
        }}
      >
        {/* Toolbar */}
        <div className="absolute bottom-0 z-50 flex w-full h-12 justify-center">
          <WhiteToolbar>
            <ResourcePager
              selectedIndex={selectedIndex}
              pages={mainResources.map((r, i) => ({
                index: i,
                label: (r.resources.metadata as { title: string }).title,
              }))}
              onSelect={i => setSelectedIndex(i)}
              onPrev={() => setSelectedIndex(i => Math.max(i - 1, 0))}
              onNext={() => setSelectedIndex(i => Math.min(i + 1, mainResources.length - 1))}
            />
          </WhiteToolbar>
        </div>

        <div
          ref={boardRef}
          className="relative flex overflow-hidden"
        >

          <div className='relative aspect-[4/3]  overflow-hidden rounded-2xl'>


      
            {/* Background media */}
            <div className="absolute inset-0 z-10 shadow-2xl ">
              {current?.resources.type === 'image' && (
                <Image
                  src={current.resources.signedURL!}
                  alt={(current.resources.metadata as { title: string }).title}
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              )}
              {current?.resources.type === 'video' && (
                <video
                  src={current.resources.signedURL!}
                  className="w-full h-full"
                  controls
                />
              )}
            </div>
            {/* 主板书 */}
            <div
              className="absolute inset-0 z-20"
              style={{ pointerEvents: tool === 'pointer' ? 'none' : 'auto' }}
            >
              <CanvasBoard lessonId={sessionId} name="主画板" />
            </div>
          </div>

          <div className="relative flex-1 m-2 overflow-hidden bg-white rounded-2xl shadow-lg">
            <CanvasBoard
              lessonId={`${sessionId}-side`}
              name="副画板"            
            />
            <div className="absolute w-full mt-2 bottom-0">

            </div> 
          </div>
        </div>
      </main>


      <div className="py-2 pr-2 pl-0 w-1/6 shrink-0">
        <StudentRanking
          students={students}
          sessionId={sessionId}
          pageIndex={selectedIndex}
        />   
      </div>
    </div>
  )
}

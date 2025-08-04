'use client'


import { useParams } from 'next/navigation'
 import { useEffect, useState, useMemo, useRef, useLayoutEffect } from 'react'
import Image from 'next/image'
import WhiteToolbar from '@/components/handwriting/WhiteToolbar'
import { CanvasBoard } from '@/components/handwriting/CanvasBoard'
import { useCanvasControl } from '@/components/handwriting/canvasStore'
import { ResourcePager } from '../../_components/ResourcePager'

import { fetchLectureResources, SessionWithResources } from '@/action/teacher/fetch-lecture-resources'
import { fetchStudents,StudentsRow } from '@/action/teacher/fetch-students'
import { StudentRanking } from '../../_components/StudentRanking'
import { usePageController } from '../../_components/usePageController'


export default function Page() {
  const { sessionId } = useParams<{ sessionId: string }>()

   //  课件资源 + 学生
  const [session, setSession] = useState<SessionWithResources>()
  const [students, setStudents] = useState<StudentsRow[]>([])

   //  翻页状态
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { handlePageChange } = usePageController(sessionId, selectedIndex, setSelectedIndex)
  const { tool } = useCanvasControl()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  // Fetch and initialize
  useEffect(() => {
    fetchLectureResources(sessionId)
      .then(data => {
        setSession(data)
        setSelectedIndex(data?.current_page ?? 0);
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
  // Grab the array (or empty if null/missing)
    const resources = session?.lectures?.lecture_resources ?? [];

    return resources
      .filter(r => r.slot === 'main' && r.resources.metadata != null)
      .sort((a, b) => a.display_order - b.display_order);
  }, [session])

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



  return (
    <div className="flex h-full overflow-hidden">

       {/* main  */}
      <main 
        ref={wrapperRef} 
        className="flex flex-grow bg-amber-200 dark:bg-inherit justify-center items-center max-h-full min-h-0 min-w-0"  
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
              onSelect={i => handlePageChange(i)}
              onPrev={() => handlePageChange(Math.max(selectedIndex - 1, 0))}
              onNext={() => handlePageChange(Math.min(selectedIndex + 1, mainResources.length - 1))}
            />
          </WhiteToolbar>
        </div>

        <div
          ref={boardRef}
          className="relative flex"
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
              <CanvasBoard
                lessonId={sessionId}
                name="主画板"
                boardType="main"
                pageIndex={selectedIndex}
              />
            </div>
          </div>

          <div className="relative flex-1 m-2 overflow-hidden bg-white rounded-2xl shadow-lg">
            <CanvasBoard
              lessonId={sessionId}
              name="副画板"
              boardType="side"
            />
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

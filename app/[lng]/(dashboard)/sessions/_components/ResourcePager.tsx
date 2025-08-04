'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

interface PageItem {
  index: number
  label: string
}

interface ResourcePagerProps {
  selectedIndex: number
  pages: PageItem[]
  onSelect: (index: number) => void
  onPrev: () => void
  onNext: () => void
}

export function ResourcePager({ selectedIndex, pages, onSelect, onPrev, onNext }: ResourcePagerProps) {

   const [open, setOpen] = useState(false)
  // 用来滚动到选中项
  const selectedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      // 等菜单渲染完再滚
      setTimeout(() => {
        selectedRef.current?.scrollIntoView({ block: 'center' })
      }, 0)
    }
  }, [open])

  return (
    <div className="flex items-center justify-center  ">
      <Button
        variant="ghost"
        size="icon"
        className="bg-white text-gray-800 shadow-md rounded-lg disabled:opacity-50"
        disabled={selectedIndex <= 0}
        onClick={onPrev}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>

      {/* 中间弹出菜单 */}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button size="default" variant="ghost">
            {pages.length > 0 ? `${selectedIndex + 1}/${pages.length}` : '–/–'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40 max-h-[50vh] overflow-auto">
         {pages.map(p => (
            <div
              key={p.index}
              // 给选中项加 ref 用于 scrollIntoView
              ref={p.index === selectedIndex ? selectedRef : undefined}
           >
              <DropdownMenuItem
                onClick={() => {
                  onSelect(p.index)
                  setOpen(false)
                }}
                className={p.index === selectedIndex ? 'font-semibold' : ''}
              >
                {p.index + 1}. {p.label}
              </DropdownMenuItem>
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="icon"
        className="bg-white text-gray-800 shadow-md rounded-lg disabled:opacity-50"
        disabled={selectedIndex >= pages.length - 1}
        onClick={onNext}
      >
        <ChevronRight className="h-8 w-8" />
      </Button>
    </div>
  )
}

import React from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ResourcePagerProps {
  selectedIndex: number
  total: number
  onPrev: () => void
  onNext: () => void
}

export function ResourcePager({ selectedIndex, total, onPrev, onNext }: ResourcePagerProps) {
  return (
    <div className="flex items-center gap-4 justify-center">
      <Button
        variant="secondary"
        size="default"
        className="bg-white text-gray-800 shadow-md rounded-lg px-4 py-2 disabled:opacity-50"
        disabled={selectedIndex <= 0}
        onClick={onPrev}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>

      <span className="flex text-base justify-center font-medium text-gray-900 min-w-14">
        {total > 0 ? `${selectedIndex + 1} / ${total}` : '0 / 0'}
      </span>

      <Button
        variant="secondary"
        size="default"
        className="bg-white text-gray-800 shadow-md rounded-lg px-4 py-2 disabled:opacity-50"
        disabled={selectedIndex >= total - 1}
        onClick={onNext}
      >
        <ChevronRight className="h-8 w-8" />
      </Button>
    </div>
  )
}

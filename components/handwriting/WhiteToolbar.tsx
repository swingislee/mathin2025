'use client';

import { useCanvas } from './CanvasProvider';
import { Slider } from '@/components/ui/slider';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

const preset = ['#1e1e1e', '#d91c1c', '#ff9800', '#2196f3', '#4caf50'];

export default function WhiteToolbar() {
  /* 从 Context 里拿归一化后保留的“像素粗细” */
  const { color, sizePx, setColor, setSizePx } = useCanvas();

  return (
    <div className="fixed bottom-0 z-50 left-1/2 -translate-x-1/2 flex w-1/2 flex-wrap gap-3 bg-white/80 p-2 backdrop-blur shadow-md">
      {/* 颜色选择 */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-8 w-8"
            style={{ background: color }}
          />
        </PopoverTrigger>
        <PopoverContent className="w-44">
          <ToggleGroup
            type="single"
            value={color}
            onValueChange={(v) => v && setColor(v)}
          >
            {preset.map((c) => (
              <ToggleGroupItem
                key={c}
                value={c}
                className="h-6 w-6"
                style={{ background: c }}
              />
            ))}
          </ToggleGroup>
        </PopoverContent>
      </Popover>

      {/* 粗细滑块（像素） */}
      <div className="flex w-40 items-center gap-2">
        <span className="text-xs">粗细</span>
        <Slider
          min={2}
          max={32}
          step={1}
          value={[sizePx]}                 /* 受控组件 */
          onValueChange={([v]) => setSizePx(v)}
        />
      </div>
    </div>
  );
}

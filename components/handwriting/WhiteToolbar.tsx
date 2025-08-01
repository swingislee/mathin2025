import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Slider as ShadcnSlider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Pencil,
  Eraser,
  Slash,
  MousePointer2,
  Palette,
  Sliders,
  ChevronDown,
  Trash2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { HueSlider } from './colorslider';
import { useCanvasControl, Tool } from './canvasStore';


export default function WhiteToolbar({ children }: { children?: React.ReactNode }) {
  const { tool, color, setTool, setColor, sizePx, setSizePx,clearBoards, boards,selectedBoardIds, toggleSelectedBoard  } = useCanvasControl();
  const [showCustomColor, setShowCustomColor] = useState(false);
  const [lastEraser, setLastEraser] = useState<Tool>('strokeEraser');
  const [sliderValue, setSliderValue] = useState(0);
  const presets = [2, 8, 16];
  const colors = ['#000000', '#d91c1c', '#2196f3'];
  const [hue, setHue] = useState(0);

  const isEraserActive = tool.startsWith('eraser') || tool === 'strokeEraser';

  useEffect(() => {
    if (tool.startsWith('eraser') || tool === 'strokeEraser') {
      setLastEraser(tool);
    }
  }, [tool]);

  useEffect(() => {
    setColor(`hsl(${hue},100%,50%)`);
  }, [hue,setColor]);


  return (
    <div className=" flex items-center bg-white/80 dark:bg-slate-800/80 backdrop-blur p-2 shadow-md rounded-xl select-none">

      {/* 指针 */}
      <Button
        size="icon"
        variant={tool === 'pointer' ? 'default' : 'ghost'}
        className='mx-1'
        onClick={() => setTool('pointer')}
      >
        <MousePointer2 />
      </Button>

      {/* 画笔 */}
      <Button
        size="icon"
        variant={tool === 'pen' ? 'default' : 'ghost'}
        className='mx-1'
        onClick={() => setTool('pen')}
      >
        <Pencil />
      </Button>

      {/* 橡皮主按钮 + 子菜单 */}
      <Popover>
        <div className="flex items-center gap-0.5 mx-1">
          <Button
            size="icon"
            variant={isEraserActive ? 'default' : 'ghost'}
            onClick={() => setTool(lastEraser)}
          >
            <Eraser />
          </Button>
          <PopoverTrigger asChild>
              <ChevronDown className='h-4 -mx-2'/>
          </PopoverTrigger>
        </div>
        <PopoverContent className="flex items-center gap-2 p-2  min-w-0 w-auto">
          {(['eraserS', 'eraserM', 'eraserL'] as Tool[]).map((mode, idx) => (
            <Button
              key={mode}
              size="icon"
              variant={tool === mode ? 'default' : 'ghost'}
              onClick={() => setTool(mode)}
            >
              {['S', 'M', 'L'][idx]}
            </Button>
          ))}
          <Button
            size="icon"
            variant={tool === 'strokeEraser' ? 'default' : 'ghost'}
            onClick={() => setTool('strokeEraser')}
          >
            <Slash />
          </Button>
        </PopoverContent>
      </Popover>

      <div className="h-6 w-px bg-gray-300 mx-2" />

      {/* 颜色选择 */}
      <div className="flex items-center gap-1">
        {colors.map(c => (
          <Button
            key={c}
            size="icon"
            variant={color === c ? 'default' : 'ghost'}
            onClick={() => setColor(c)}
          >
            <span className="h-4 w-4 rounded" style={{ background: c }} />
          </Button>
        ))}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              size="icon"
              variant={showCustomColor ? 'default' : 'ghost'}
              onClick={() => setShowCustomColor(v => !v)}
            >
              <Palette />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="px-2">
              <HueSlider hue={hue} onChange={setHue} />
          </PopoverContent>
        </Popover>
      </div>

      <div className="h-6 w-px bg-gray-300 mx-2" />

      {/* 粗细选择 */}
      <Popover>
        <PopoverTrigger asChild>
          <Button size="icon" variant="ghost" className='mx-1'>
            <Sliders />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-2 px-2">
          <div className="flex mx-1 gap-2 items-center">
            粗细 :
            {presets.map(n => (
              <Button
                key={n}
                size="sm"
                variant={sizePx === n ? 'default' : 'ghost'}
                onClick={() => setSizePx(n)}
              >
                {n}px
              </Button>
            ))}
          </div>
          <ShadcnSlider
            min={2} max={32} step={1}
            value={[sizePx]}
            onValueChange={([v]) => setSizePx(v)}
          />
        </PopoverContent>
      </Popover>

      {/* 清屏按钮（滑动确认） */}
      <Popover>
        <PopoverTrigger asChild>
          <Button size="icon" variant="destructive" className='mx-1'>
            <Trash2 />

          </Button>
        </PopoverTrigger>
        <PopoverContent className="min-w-0 w-32 p-4 space-y-4">
        {/* 标题与复选列表 */}
        <div>
          <div className="text-sm font-semibold mb-2">选择要清除的画板</div>
          <div className="space-y-1 max-h-32 overflow-y-auto pl-1">
            {boards.map(b => (
              <label key={b.id} className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  className="accent-red-500"
                  checked={selectedBoardIds.includes(b.id)}
                  onChange={() => toggleSelectedBoard(b.id)}
                />
                <span>{b.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 分隔线 */}
        <div className="h-px bg-gray-300" />

        {/* 滑动确认 */}
        <div className="space-y-2">
          <div className="text-sm text-gray-700 text-center">
            滑动确认
          </div>
          <div className="w-24 mx-auto">
            <ShadcnSlider
              min={0}
              max={100}
              step={1}
              value={[sliderValue]}
              onValueChange={([v]) => setSliderValue(v)}
              onValueCommit={([v]) => {
                if (v === 100) {
                  clearBoards(selectedBoardIds);
                }
                setSliderValue(0);
              }}
              className="cursor-pointer touch-none"
            />
          </div>
          <div className="text-xs text-red-500 text-center mt-1">
            此操作不可撤销
          </div>
        </div>
      </PopoverContent>

      </Popover>
      {children && <div className="h-6 w-px bg-gray-300 mx-2" />}
      {children}
    </div>
  );
}

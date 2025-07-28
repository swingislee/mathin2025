import {
  Root   as Slider,
  Track  as SliderTrack,
  Range  as SliderRange,
  Thumb  as SliderThumb,
} from '@radix-ui/react-slider'


export function HueSlider({ hue, onChange }: { 
  hue: number,
  onChange: (newHue: number) => void
}) {
  return (
    <Slider
      min={0}
      max={360}
      step={1}
      value={[hue]}
      onValueChange={([v]) => onChange(v)}
      className="relative flex w-full select-none items-center h-6"
    >
      {/* 整条轨道底色，用一个浅一点的 HSL 作背景 */}
      <SliderTrack
        className="relative h-1 w-full grow overflow-hidden rounded-full"
        style={{ backgroundColor: `hsl(${hue},100%,85%)` }}
      >
        {/* 填充色，用你选的 HSL 直接作为背景 */}
        <SliderRange
          className="absolute h-full rounded-full"
          style={{ backgroundColor: `hsl(${hue},100%,50%)` }}
        />
      </SliderTrack>

      {/* 拖动圆点也染成同样的 HSL */}
      <SliderThumb
        className="block h-4 w-4 rounded-full ring-2 ring-white"
        style={{ backgroundColor: `hsl(${hue},100%,50%)` }}
      />
    </Slider>
  )
}

/* ───── CanvasProvider.tsx ───────────────────────────────────────── */
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
  ReactNode,
} from 'react';
import { createClient } from '@/utils/supabase/client';
import { useSession } from 'next-auth/react';
import { getStroke } from 'perfect-freehand';
import { v4 as uuid } from 'uuid';

/* ---------- 类型 ---------- */
type StrokeNorm = {
  id: string;
  points: number[][]; // [xn, yn] ∈ 0‑1
  color: string;
  wNorm: number;      // 线宽 / canvas.width  (0‑1)
};

type CanvasCtxValue = {
  color: string;
  sizePx: number;
  setColor: (c: string) => void;
  setSizePx: (n: number) => void;
};

/* ---------- React Context ---------- */
const CanvasCtx = createContext<CanvasCtxValue | null>(null);
export const useCanvas = () => {
  const ctx = useContext(CanvasCtx);
  if (!ctx) throw new Error('useCanvas must be inside <CanvasProvider>');
  return ctx;
};

/* ---------- 主组件 ---------- */
export function CanvasProvider({
  lessonId,
  children,
}: {
  lessonId: string;
  children: ReactNode;
}) {
  /* —— Supabase（带 RLS JWT） —— */
  const { data: session } = useSession();
  const supabase = useMemo(
    () => createClient(session?.supabaseAccessToken),
    [session?.supabaseAccessToken]
  );

  /* —— 画笔颜色 & 粗细（像素） —— */
  const [color, setColor]   = useState('#000000');
  const [sizePx, setSizePx] = useState(8); // UI 滑块仍用像素

  /* —— 双层 canvas 引用 —— */
  const baseRef  = useRef<HTMLCanvasElement | null>(null); // 已定稿
  const draftRef = useRef<HTMLCanvasElement | null>(null); // 预览
  const stroke   = useRef<StrokeNorm | null>(null);        // 正在书写

  /* ===== 统一缩放函数 ===== */
  const drawStroke = (
    ctx: CanvasRenderingContext2D,
    s: StrokeNorm,
    cw: number,
    ch: number
  ) => {
    const pxPts = s.points.map(([xn, yn]) => [xn * cw, yn * ch]);
    const outline = getStroke(pxPts, {
      size: s.wNorm * cw, // 线宽还原
      thinning: 0.7,
      smoothing: 0.6,
      streamline: 0.5,
    });
    const path = new Path2D(
      outline.reduce(
        (acc, [x, y], i) => acc + `${i ? 'L' : 'M'}${x} ${y} `,
        ''
      ) + 'Z'
    );
    ctx.fillStyle = s.color;
    ctx.fill(path);
  };

  /* ===== 初始化 & resize ===== */
  useEffect(() => {
    const resize = () => {
      [baseRef.current, draftRef.current].forEach(cv => {
        if (!cv) return;
        cv.width  = cv.offsetWidth  * devicePixelRatio;
        cv.height = cv.offsetHeight * devicePixelRatio;
        cv.getContext('2d')?.scale(devicePixelRatio, devicePixelRatio);
      });
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  /* ===== Pointer 事件 (写入归一化) ===== */
  useEffect(() => {
    const draft = draftRef.current;
    const base  = baseRef.current;
    if (!draft || !base) return;

    const draftCtx = draft.getContext('2d')!;
    const baseCtx  = base.getContext('2d')!;

    const toPoint = (e: PointerEvent) => {
      const rect = draft.getBoundingClientRect();
      return [e.clientX - rect.left, e.clientY - rect.top] as [number, number];
    };

    /* pointerdown */
    const onDown = (e: PointerEvent) => {
      const [x, y] = toPoint(e);
      stroke.current = {
        id: uuid(),
        points: [[x / draft.width, y / draft.height]],
        color,
        wNorm: sizePx / draft.width,
      };
      draft.setPointerCapture(e.pointerId);
    };

    /* pointermove */
    const onMove = (e: PointerEvent) => {
      if (!stroke.current) return;
      const [x, y] = toPoint(e);
      stroke.current.points.push([x / draft.width, y / draft.height]);

      draftCtx.clearRect(0, 0, draft.width, draft.height);
      drawStroke(draftCtx, stroke.current, draft.width, draft.height);
    };

    /* pointerup / cancel */
    const finishStroke = () => {
      if (!stroke.current) return;
      draftCtx.clearRect(0, 0, draft.width, draft.height);
      drawStroke(baseCtx, stroke.current, base.width, base.height);

      /* 广播归一化笔迹 */
      supabase
        .channel(`lesson:${lessonId}`)
        .send({
          type: 'broadcast',
          event: 'DRAW',
          payload: stroke.current,
        });

      stroke.current = null;
    };

    draft.addEventListener('pointerdown', onDown);
    draft.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', finishStroke);
    window.addEventListener('pointercancel', finishStroke);

    return () => {
      draft.removeEventListener('pointerdown', onDown);
      draft.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', finishStroke);
      window.removeEventListener('pointercancel', finishStroke);
    };
  }, [color, sizePx, lessonId]);

  /* ===== Realtime 回放：按接收端尺寸还原 ===== */
  useEffect(() => {
    const base = baseRef.current;
    if (!base) return;
    const baseCtx = base.getContext('2d')!;

    const ch = supabase
      .channel(`lesson:${lessonId}`, { config: { broadcast: { self: false } } })
      .on(
        'broadcast',
        { event: 'DRAW' },
        ({ payload }: { payload: StrokeNorm }) => {
          drawStroke(baseCtx, payload, base.width, base.height);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ch);
    };
  }, [lessonId]);

  /* ===== JSX ===== */
  return (
    <CanvasCtx.Provider
      value={{ color, sizePx, setColor, setSizePx }}
    >
      {children}
      {/* 落笔层 */}
      <canvas
        ref={baseRef}
        className="absolute inset-0 w-full h-full touch-none"
      />
      {/* 预览层 */}
      <canvas
        ref={draftRef}
        className="absolute inset-0 w-full h-full touch-none"
      />
    </CanvasCtx.Provider>
  );
}
/* ──────────────────────────────────────────────────────────────── */

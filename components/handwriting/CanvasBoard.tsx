/* ───── CanvasProvider.tsx ───────────────────────────── */
'use client';

import {
  useEffect, useRef, useState,useMemo,
  useCallback
} from 'react';
import { createClient } from '@/utils/supabase/client';
import { getStroke } from 'perfect-freehand';
import { v4 as uuid } from 'uuid';
import { useCanvasControl } from './canvasStore';

/* ---------- 数据类型 ---------- */
type StrokeNorm = {
  id: string;
  points: number[][];      // 0‑1 比例点
  color: string;
  wNorm: number;           // 线宽 / canvas.width
};

type WhiteboardOp =
  | { t: 'draw';        stroke: StrokeNorm }
  | { t: 'eraseFrag';   stroke: StrokeNorm }
  | { t: 'eraseLine';   id: string }
  | { t: 'clear' };

export type Tool =
  | 'pen'
  | 'eraserS' | 'eraserM' | 'eraserL'
  | 'strokeEraser'
  | 'pointer';

/* ========== Provider ========== */
export function CanvasBoard({
  lessonId,
  name
}: { lessonId: string; name: string }) {

  /* Supabase (带 RLS) */
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const { color, sizePx, tool, registerBoard, unregisterBoard  } = useCanvasControl();

  /* ---------- state ---------- */
  const [cursor,  setCursor]  = useState<[number,number]|null>(null); // 光标方块

  /* ---------- refs ---------- */
  const baseRef  = useRef<HTMLCanvasElement|null>(null);
  const draftRef = useRef<HTMLCanvasElement|null>(null);
  const containerRef = useRef<HTMLDivElement|null>(null);

  const strokeRef = useRef<StrokeNorm|null>(null);
  const strokes   = useRef<Map<string,StrokeNorm>>(new Map());

  /* ---------- helpers ---------- */
  const sendOp = useCallback((op: WhiteboardOp) => {
    supabase
      .channel(`lesson:${lessonId}`)
      .send({ type: 'broadcast', event: 'OP', payload: op })
  }, [lessonId,supabase])

  const drawStroke = useCallback(
    (ctx: CanvasRenderingContext2D, s: StrokeNorm, cw: number, ch: number) => {
      const pts = s.points.map(([xn, yn]) => [xn * cw, yn * ch])
      const outline = getStroke(pts, {
        size: s.wNorm * cw,
        thinning: .7,
        smoothing: .6,
        streamline: .5,
      })
      const path = new Path2D(
        outline.reduce((acc, [x, y], i) => acc + `${i ? 'L' : 'M'}${x} ${y} `, '') + 'Z'
      )
      ctx.fillStyle = s.color
      ctx.fill(path)
    },
    []
  )

  const drawFragErase = useCallback(
    (ctx: CanvasRenderingContext2D, s: StrokeNorm, cw: number, ch: number) => {
      ctx.save()
      ctx.globalCompositeOperation = 'destination-out'
      // 把 color 强制改成黑色擦除
      drawStroke(ctx, { ...s, color: '#000' }, cw, ch)
      ctx.restore()
    },
    [drawStroke]
  )

  const redrawAll = useCallback(() => {
    const canvas = baseRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (const stroke of strokes.current.values()) {
      drawStroke(ctx, stroke, canvas.width, canvas.height)
    }
  }, [drawStroke])

  /* ========== 自适应尺寸 ========== */
  useEffect(()=>{
    const resize=()=>{
      const box=containerRef.current; if(!box) return;
      const w=box.offsetWidth*devicePixelRatio;
      const h=box.offsetHeight*devicePixelRatio;
      [baseRef.current,draftRef.current].forEach(cv=>{
        if(!cv) return;
        cv.width=w; cv.height=h;
        cv.getContext('2d')?.setTransform(
          devicePixelRatio,0,0,devicePixelRatio,0,0);
      });
      redrawAll();
    };
    resize();
    const ro=new ResizeObserver(resize);
    if (containerRef.current) {
      ro.observe(containerRef.current);
    }
    window.addEventListener('resize',resize);
    return ()=>{ro.disconnect();window.removeEventListener('resize',resize);};
  },[redrawAll]);

  /* ---------- 命中测试 (整线擦) ---------- */
  const hitStrokeId = (x:number,y:number,threshold=10)=>{
    const w=baseRef.current!.width, h=baseRef.current!.height;
    for(const s of strokes.current.values()){
      const pts=s.points.map(([xn,yn])=>[xn*w,yn*h]);
      if(pts.some(([px,py])=>Math.hypot(px-x,py-y)<threshold)) return s.id;
    }
    return null;
  };

  /* ========== Pointer 逻辑 ========== */
  useEffect(()=>{
    const draft=draftRef.current, base=baseRef.current;
    if(!draft||!base) return;
    const dctx=draft.getContext('2d')!, bctx=base.getContext('2d')!;
    const toPoint=(e:PointerEvent)=>{
      const r=draft.getBoundingClientRect();
      return [e.clientX-r.left,e.clientY-r.top] as [number,number];
    };

    const erRel = tool==='eraserS'? .01 :
                  tool==='eraserM'? .02 :
                  tool==='eraserL'? .04 : 0;

    /* ----- pointerdown ----- */
    const down=(e:PointerEvent)=>{
      if(tool==='pointer') return;
      if(tool==='strokeEraser'){
        const [mx,my]=toPoint(e);
        const id=hitStrokeId(mx,my,12);
        if(id){
          strokes.current.delete(id);
          redrawAll();
          sendOp({t:'eraseLine',id});
        }
        return;
      }
      const [x,y]=toPoint(e);
      strokeRef.current={
        id:uuid(),
        points:[[x/draft.width,y/draft.height]],
        color,
        wNorm: erRel || sizePx/draft.width
      };
      draft.setPointerCapture(e.pointerId);
    };

    /* ----- pointermove ----- */
    const move=(e:PointerEvent)=>{
      const [mx,my]=toPoint(e);
      if(tool.startsWith('eraser')) setCursorPos(mx,my);

           /* ==== 整线橡皮：仅在“左键按压拖动”时擦除 ==== */
      if (tool === 'strokeEraser') {
        /* e.buttons 按位：1 = 左键；0 = 没按键（悬停） */
        if (e.buttons & 1) {
          const id = hitStrokeId(mx, my, 12);
          if (id && strokes.current.has(id)) {
            strokes.current.delete(id);
            redrawAll();
            sendOp({ t: 'eraseLine', id });
          }
        }
        return;               // 无论是否按压，都阻止后续逻辑
      }

      if(!strokeRef.current) return;
      strokeRef.current.points.push([mx/draft.width,my/draft.height]);

      /* 实时预览层 */
      dctx.clearRect(0,0,draft.width,draft.height);
      if(tool==='pen'){
        drawStroke(dctx,strokeRef.current,draft.width,draft.height);
      }else{ // S/M/L 橡皮
        drawFragErase(dctx,strokeRef.current,draft.width,draft.height);
      }

      /* 实时擦到 base (仅 S/M/L) */
      if(tool.startsWith('eraser')){
        drawFragErase(bctx,{
          ...strokeRef.current,
          points:[[mx/draft.width,my/draft.height]]
        },base.width,base.height);
      }
    };

    /* ----- pointerup / cancel ----- */
    const finish=()=>{
      if(!strokeRef.current) return;
      dctx.clearRect(0,0,draft.width,draft.height);

      if(tool==='pen'){
        drawStroke(bctx,strokeRef.current,base.width,base.height);
        strokes.current.set(strokeRef.current.id,strokeRef.current);
        sendOp({t:'draw',stroke:strokeRef.current});
      }else if(tool.startsWith('eraser')){
        // 已在实时阶段擦了，只需广播
        sendOp({t:'eraseFrag',stroke:strokeRef.current});
      }
      strokeRef.current=null;
    };

    const setCursorPos=(x:number,y:number)=>setCursor([x,y]);

    draft.addEventListener('pointerdown',down);
    draft.addEventListener('pointermove',move);
    window.addEventListener ('pointerup',finish);
    window.addEventListener ('pointercancel',finish);
    return ()=>{draft.removeEventListener('pointerdown',down);
      draft.removeEventListener('pointermove',move);
      window.removeEventListener('pointerup',finish);
      window.removeEventListener('pointercancel',finish);};
  },[tool,color,sizePx,lessonId,drawFragErase,drawStroke,redrawAll,sendOp]);

  /* ---------- Realtime 回放 ---------- */
  useEffect(()=>{
    const base=baseRef.current; if(!base) return;
    const ctx=base.getContext('2d')!;
    const ch=supabase.channel(`lesson:${lessonId}`,
      {config:{broadcast:{self:false}}})
      .on('broadcast',{event:'OP'},
        ({payload}:{payload:WhiteboardOp})=>{
          switch(payload.t){
            case 'draw':
              strokes.current.set(payload.stroke.id,payload.stroke);
              drawStroke(ctx,payload.stroke,base.width,base.height);break;
            case 'eraseFrag':
              drawFragErase(ctx,payload.stroke,base.width,base.height);break;
            case 'eraseLine':
              strokes.current.delete(payload.id);
              redrawAll();break;
            case 'clear':
              strokes.current.clear();
              ctx.clearRect(0,0,base.width,base.height);break;
          }
        })
      .subscribe();
    return ()=>{supabase.removeChannel(ch);};
  },[lessonId,drawFragErase,drawStroke,redrawAll,supabase]);

  /* ---------- 清屏 ---------- */
  const clearBoard = useCallback(() => {
    strokes.current.clear()
    const canvas = baseRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')!
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    sendOp({ t: 'clear' })
  }, [sendOp])

 useEffect(() => {
  registerBoard(lessonId, name, clearBoard);
  return () => unregisterBoard(lessonId);
  }, [lessonId, name,clearBoard,registerBoard,unregisterBoard]);

  /* ---------- pointer-events ---------- */
  const canvasPE = tool==='pointer'?'none':'auto';
  const cursorStyle =
    tool.startsWith('eraser') ? 'none' :
    tool==='pointer'          ? 'default' : 'crosshair';

  /* ---------- JSX ---------- */
  return (
    <>
      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{ pointerEvents: tool === 'pointer' ? 'none' : 'auto' }}
      >
        {/* 落笔层 */}
        <canvas ref={baseRef}
                style={{pointerEvents:canvasPE}}
                className="absolute inset-0 w-full h-full touch-none"/>
        {/* 预览 + 光标层 */}
        <canvas ref={draftRef}
                style={{pointerEvents:canvasPE,cursor:cursorStyle}}
                className="absolute inset-0 w-full h-full touch-none"/>
      </div>

      {/* 方块光标绘制在独立 canvas 上方（用 draft 自己） */}
      {tool.startsWith('eraser') && cursor && (
        <div style={{
          pointerEvents:'none',
            position: 'absolute',
              ...(() => {
                const sRel = tool === 'eraserS' ? 0.01 :
                              tool === 'eraserM' ? 0.02 : 0.04;
                const s = (draftRef.current?.width ?? 0) * sRel;
                return {
                  left: cursor[0] - s / 2,
                  top : cursor[1] - s / 2,
                  width : s,
                  height: s,
                  border: '1px solid #666',
                  boxSizing: 'border-box',
                };
              })(),
          }}
        />
      )}
    </>
  );
}
/* ───────────────────────────────────────────────────── */

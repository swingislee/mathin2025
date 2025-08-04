/* ───── CanvasProvider.tsx ───────────────────────────── */
'use client';

import {
  useEffect, useRef, useState,useMemo,
  useCallback
} from 'react';
import { createClient } from '@/utils/supabase/client';
import { getStroke } from 'perfect-freehand';
import { v4 as uuid } from 'uuid';
import { useCanvasControl } from './CanvasStore';

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
  name,
  boardType,    // 'main' 或 'side'
  pageIndex,    // 当 boardType==='main' 时，才有效
  autoSaveMs = 180000, // 3 分钟
}: { 
  lessonId: string;
  name: string;
  boardType: 'main' | 'side';
  pageIndex?: number;
  autoSaveMs?: number, // 3 分钟
}) {
  // 仅用于快照表（board_pages）的索引键：
  // main => 实际页码；side => -1
  const pageKey = useMemo(
    () => (boardType === 'main' ? (pageIndex ?? 0) : -1),
    [boardType, pageIndex]
  );
  /* Supabase (带 RLS) */
  const supabase = useMemo(() => createClient(),[]);

  const { color, sizePx, tool, registerBoard, unregisterBoard, setManualSave, saveAll } = useCanvasControl();

  /* ---------- state ---------- */
  const [cursor,  setCursor]  = useState<[number,number]|null>(null); // 光标方块

  /* ---------- refs ---------- */
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const baseRef  = useRef<HTMLCanvasElement|null>(null);
  const draftRef = useRef<HTMLCanvasElement|null>(null);
  const containerRef = useRef<HTMLDivElement|null>(null);

  const strokeRef = useRef<StrokeNorm|null>(null);
  const strokes   = useRef<Map<string,StrokeNorm>>(new Map());



  /* ---------- helpers ---------- */
  const sendOp = useCallback(async (op: WhiteboardOp) => {
    // 1) 持久化
    await supabase.schema('edu_core')
      .from('board_ops')
      .insert({
        session_id: lessonId,
        board_type: boardType,
        page_index: boardType === 'main' ? pageIndex : null,
        op,
      });

    // 2) 广播到所有客户端
    channelRef.current?.send({
      type: 'broadcast',
      event: 'OP',
      payload: { boardType, pageIndex, op }
    });
  }, [lessonId, boardType, pageIndex, supabase]);


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

  // ---- 快照序列化：把当前内存中的笔迹转为数组存入 JSONB ----
  const makeSnapshot = useCallback((): StrokeNorm[] => {
    return Array.from(strokes.current.values());
  }, []);

  // ---- 应用快照到画布与内存 ----
  const applySnapshot = useCallback((
    arr: StrokeNorm[],
    ctx: CanvasRenderingContext2D
  ) => {
    strokes.current.clear();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (const s of arr) {
      strokes.current.set(s.id, s);
      drawStroke(ctx, s, ctx.canvas.width, ctx.canvas.height);
    }
  }, [drawStroke]);

  // 简化版：只做常规 RPC 保存（由服务器清空该页操作流）
  const flushSnapshot = useCallback(async () => {
    const content = makeSnapshot();
    const payload = {
      p_session_id: lessonId,
      p_board_type: boardType,
      p_page_index: pageKey,
      p_content: content,
    };
    const { error } = await supabase
      .schema('edu_core')
      .rpc('save_board_snapshot', payload);
    if (error) console.error('save_board_snapshot error:', error);
  }, [lessonId, boardType, pageKey, makeSnapshot, supabase]);

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

    const ch = supabase
    .channel(`board_ops_${lessonId}`, {config: { broadcast: { self: false } }})
     .on('broadcast', { event: 'OP' }, ({ payload }) => {
       const { boardType: bt, pageIndex: pi, op } = payload;
       if (bt !== boardType) return;
       if (boardType === 'main' && pi !== pageIndex) return;
       // 这里用解构出来的 op
       switch (op.t) {
         case 'draw':
           strokes.current.set(op.stroke.id, op.stroke);
           drawStroke(ctx, op.stroke, base.width, base.height);
           break;
         case 'eraseFrag':
           drawFragErase(ctx, op.stroke, base.width, base.height);
           break;
         case 'eraseLine':
           strokes.current.delete(op.id);
           redrawAll();
           break;
         case 'clear':
           strokes.current.clear();
           ctx.clearRect(0, 0, base.width, base.height);
           break;
       }
     })
    
      .subscribe();

      channelRef.current = ch;
    return ()=>{supabase.removeChannel(ch);};
  }, [
    lessonId,
    boardType,       // <-- 新增
    pageIndex,       // <-- 新增
    drawFragErase,
    drawStroke,
    redrawAll,
    supabase
  ]);

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
    const boardId = `${lessonId}-${boardType}`;
    registerBoard(boardId, name, clearBoard);
    return () => unregisterBoard(boardId);
  }, [lessonId,boardType,name,clearBoard,registerBoard,unregisterBoard]);

  /* ---------- pointer-events ---------- */
  const canvasPE = tool==='pointer'?'none':'auto';
  const cursorStyle =
    tool.startsWith('eraser') ? 'none' :
    tool==='pointer'          ? 'default' : 'crosshair';


  useEffect(() => {
  // 初次加载：先加载页面快照，再回放操作流（若有）

  let cancelled = false;
  (async () => {
    // 1) 清空内存 & 画布
    strokes.current.clear();
    const canvas = baseRef.current;
    if (canvas) canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height);

    // 2) 先读页面快照（board_pages）
    const ctx = baseRef.current?.getContext('2d')!;
    if (!ctx) return;
    const { data: pageRow, error: pageErr } = await supabase
      .schema('edu_core')
      .from('board_pages')
      .select('content')
      .eq('session_id', lessonId)
      .eq('board_type', boardType)
      .eq('page_index', pageKey)      // 注意：side 使用 -1
      .maybeSingle();
    if (!cancelled && !pageErr && pageRow?.content) {
      applySnapshot(pageRow.content as StrokeNorm[], ctx);
    }

    // 3) 再回放操作流（board_ops）读取历史：slot = main 时 page_index = 页面；slot = side 时 page_index IS NULL
    const q = supabase
      .schema('edu_core')
      .from('board_ops')
      .select('op')
      .eq('session_id', lessonId)
      .eq('board_type', boardType);

    if (boardType === 'main') {
      q.eq('page_index', pageIndex ?? 0);
    } else {
      q.is('page_index', null);
    }


    const { data, error } = await q
      .order('created_at', { ascending: true })
      .returns<{ op: WhiteboardOp }[]>()

    if (error) {
      console.error('加载板书历史失败', error);
      return;
    }
    if (cancelled || !data) return;

    // 4) 回放增量操作
    for (const row of data) {
      const op: WhiteboardOp = row.op;
      switch (op.t) {
        case 'draw':
          strokes.current.set(op.stroke.id, op.stroke);
          drawStroke(ctx, op.stroke, ctx.canvas.width, ctx.canvas.height);
          break;
        case 'eraseFrag':
          drawFragErase(ctx, op.stroke, ctx.canvas.width, ctx.canvas.height);
          break;
        case 'eraseLine':
          strokes.current.delete(op.id);
          redrawAll();
          break;
        case 'clear':
          strokes.current.clear();
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          break;
      }
    }
  })();

  return () => { cancelled = true; };
}, [lessonId, boardType, pageIndex, supabase, drawStroke, drawFragErase, redrawAll]);

 // 在当前页“离开”之前：保存快照并清空该页操作流
  useEffect(() => {
    return () => {
      void (async () => {
        try {
          await saveAll();
        } catch (e) {
          console.error('saveAll failed:', e);
        }
      })();
    };
  }, [pageKey, saveAll]);

   // 将手动保存回调注册到全局（组件卸载时清空）
  useEffect(() => {
    setManualSave(boardType, () => flushSnapshot());
    return () => setManualSave(boardType, null);
  }, [flushSnapshot, setManualSave]);

  // 定时自动保存
  useEffect(() => {
    const id = setInterval(() => { void flushSnapshot(); }, autoSaveMs);
    return () => clearInterval(id);
  }, [flushSnapshot, autoSaveMs]);



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

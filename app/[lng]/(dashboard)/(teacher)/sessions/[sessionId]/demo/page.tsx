'use client'

import { fetchLectureResources ,SessionWithResources} from '@/action/teacher/fetch-lecture-resources';
import { useParams } from 'next/navigation'
import { useEffect, useState,useMemo } from 'react';
import Image from 'next/image';
import WhiteToolbar from '@/components/handwriting/WhiteToolbar';
import { CanvasBoard } from '@/components/handwriting/CanvasBoard';
import { useCanvasControl } from '@/components/handwriting/canvasStore';

export default function Page() {
  const params = useParams<{ sessionId: string }>();
  const [sessions, setSessions] = useState<SessionWithResources[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { tool } = useCanvasControl();

  // 拉取数据
  useEffect(() => {
    fetchLectureResources(params.sessionId)
      .then(data => {
        setSessions(data);
        setSelectedIndex(0);
      })
      .catch(err => console.error('fetchLectureResources error:', err));
  }, [params.sessionId]);

  const mainResources = useMemo(() => {
    return sessions
      .filter(s => s.lectures != null)
      .flatMap(s => s.lectures!.lecture_resources)
      .filter(r => r.slot === 'main' && r.resources.metadata != null)
      .sort((a, b) => a.display_order - b.display_order);
  }, [sessions]);

  const current = mainResources[selectedIndex];

  return (
    <>
      {/* <pre>{JSON.stringify(lectureResource, null, 2)}</pre> */}
        
        <div className="flex h-full overflow-hidden">
          {/* 左侧绿色区域 */}
          <div className="bg-green-400 w-1/5 shrink-0 p-4">
            {/* 这里可以添加左侧内容 */}
          </div>

          {/* 中间 */}
          <main className="flex-col relative flex max-h-full flex-grow justify-center bg-red-300 items-start">
            {/* 主板书区域 */}
            <div className="w-full h-auto max-h-full aspect-[4/3] relative overflow-hidden bg-yellow-400 shadow-lg">
              <div className="absolute z-10 top-0 left-0 w-full h-full">              
                {current?.resources.type === 'image' && (
                  <Image
                    src={current.resources.signedURL!}
                    alt={(current.resources.metadata as { title: string }).title}
                    fill={true}  // 图片会填充父容器
                    style={{
                      objectFit: 'contain',  // 保持宽高比，避免裁剪
                    }}
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
    
              <div className="absolute z-20 top-0 left-0 w-full h-full " style={{ pointerEvents: tool==='pointer' ? 'none' : 'auto' }}>   
                <CanvasBoard lessonId={params.sessionId} name="主画板"/>
              </div>             
            </div>

            <div className="flex justify-center absolute z-50 w-full bg-green-300 bottom-0 h-12">
              <WhiteToolbar/>
            </div>

          </main>

          {/* 右侧蓝色区域 */}
          <div className="bg-blue-400 relative w-1/5 p-4">
            <CanvasBoard lessonId={`${params.sessionId}-side`} name="副画板"/>
            <div className="mt-4 flex justify-between items-center">
            <button
              disabled={selectedIndex <= 0}
              className="px-2 py-1 bg-white rounded disabled:opacity-50"
              onClick={() => setSelectedIndex(i => Math.max(i - 1, 0))}
            >
              上一页
            </button>
            <span className="text-sm">
              {selectedIndex + 1} / {mainResources.length}
            </span>
            <button
              disabled={selectedIndex >= mainResources.length - 1}
              className="px-2 py-1 bg-white rounded disabled:opacity-50"
              onClick={() => setSelectedIndex(i => Math.min(i + 1, mainResources.length - 1))}
            >
              下一页
            </button>
        </div>

          </div>
          
      
        </div>
    </>
  );
}

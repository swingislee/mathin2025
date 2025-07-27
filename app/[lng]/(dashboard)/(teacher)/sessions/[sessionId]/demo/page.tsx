'use client'

import { fetchLectureResources ,SessionWithResources} from '@/action/teacher/fetch-lecture-resources';
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { CanvasProvider } from '@/components/handwriting/CanvasProvider';
import WhiteToolbar from '@/components/handwriting/WhiteToolbar';

export default function Page() {
  const params = useParams<{ sessionId: string }>();
  const [lectureResource, setLectureResource] = useState<SessionWithResources[]>([]);
  const [signedURL, setSignedURL] = useState<string | null>(null);

  useEffect(() => {
    fetchLectureResources(params.sessionId)
      .then((data) => {
        setLectureResource(data);

        const url = data?.[0]?.lectures?.lecture_resources?.[0]?.resources?.signedURL;
        setSignedURL(url || null);

      });

  }, [params.sessionId]); // params.sessionId 是依赖项

  return (
    <>
      {/* <pre>{JSON.stringify(lectureResource, null, 2)}</pre> */}
      
      <div className="flex h-full overflow-hidden">
        {/* 左侧绿色区域 */}
        <div className="bg-green-400 w-1/5 shrink-0 p-4">
          {/* 这里可以添加左侧内容 */}
        </div>

        {/* 中间主板书区域 */}
        <main className="flex-col flex max-h-full flex-grow justify-center bg-red-300 items-start">
          <div
            /* 关键：宽度跟随剩余容器，但高度不超出视口 */
            className="
              w-full                 /* 尽可能占满父水平空间 */
              h-auto                 /* 高度由 aspect-ratio 自动推 */
              max-h-full             /* 关键！ */
              aspect-[4/3]
              relative            
              overflow-hidden
              bg-yellow-400
              shadow-lg
            "
          >
            <div className="absolute z-10 top-0 left-0 w-full h-full">              
              {signedURL && (
                <Image
                  src={signedURL}
                  alt="Description of the image"
                  fill={true}  // 图片会填充父容器
                  style={{
                    objectFit: 'contain',  // 保持宽高比，避免裁剪
                  }}
                />
              )}
            </div>
  
            <div className="absolute z-20 top-0 left-0 w-full h-full">
              <CanvasProvider lessonId={params.sessionId}>
                <WhiteToolbar />
              </CanvasProvider>
            </div>             
          </div>
        </main>

        {/* 右侧蓝色区域 */}
        <div className="bg-blue-400 w-1/5 p-4">
          {/* 这里可以添加右侧内容 */}
        </div>
       
      </div>

    
    </>
  );
}

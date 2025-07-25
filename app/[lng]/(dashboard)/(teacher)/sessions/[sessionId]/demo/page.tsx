'use client'

import { fetchLectureResources } from '@/action/teacher/fetch-lecture-resources';
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react';

export default function Page() {
  const params = useParams<{ sessionId: string }>()
  const [lectureResource, setLectureResource] = useState<any>([]);
 

  useEffect(() => {
    fetchLectureResources(params.sessionId)
      .then(
        (data)=>{setLectureResource(data)}
      )
  }, []); // 空依赖数组，确保只在组件挂载时运行一次


  return (
    <>
    <pre>{JSON.stringify(lectureResource,null,2)}</pre>
    </>
  );
}

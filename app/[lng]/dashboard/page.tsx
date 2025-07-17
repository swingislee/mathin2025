"use client";
import React from 'react';
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from 'react';
import { Database } from "@/utils/types/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { FaStar, FaBolt } from 'react-icons/fa'; // 引入react-icons中的星星和雷电图标

export default function Page() {
  const supabase = createClient();
  const [students, setStudents] = useState<Database["edu_core"]["Tables"]["students"]["Row"][]>([]);
  const [loading, setLoading] = useState(true);
  const [studentStats, setStudentStats] = useState<{ [key: string]: { stars: number, thunders: number } }>({});
  const [courseStages] = useState<string[]>(["新知1", "1", "2", "3", "新知2", "4", "5", "6", "7","挑战1", "挑战2"]);
  const [activeStage, setActiveStage] = useState<number>(0);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data, error } = await supabase
          .schema('edu_core')
          .from('students')
          .select('*');

        if (error) {
          console.log(error)
          throw error;
        }

        setStudents(data); // 存储查询结果

        
        // 初始化每个学生的星星和雷
        const initialStats = data.reduce((acc, student) => {
          acc[student.student_id] = { stars: 0, thunders: 0 }; // 初始化星星和雷的数量
          return acc;
        }, {} as { [key: string]: { stars: number, thunders: number } });

        setStudentStats(initialStats); // 设置初始状态
      } catch (error) {
        console.log(error)
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false); // 请求完成，关闭加载状态
      }
    };

    fetchStudents();
  }, [supabase]); // 空依赖数组，确保只在组件挂载时运行一次

  // 增加星星
const handleIncreaseStar = async (studentId: string) => {
  setStudentStats((prevStats) => ({
    ...prevStats,
    [studentId]: {
      ...prevStats[studentId],
      stars: (prevStats[studentId]?.stars || 0) + 1,
    },
  }));

  // 插入记录到学情统计表
  await supabase.from('学情统计').insert([
    {
      学生id: studentId,
      课程环节: courseStages[activeStage],
      学情记录: '增加星星',
      星: 1,
      雷: 0,
      当堂课总星数: studentStats[studentId]?.stars + 1,
    }
  ]);
};

// 减少星星
const handleDecreaseStar = async (studentId: string) => {
  setStudentStats((prevStats) => ({
    ...prevStats,
    [studentId]: {
      ...prevStats[studentId],
      stars: Math.max((prevStats[studentId]?.stars || 0) - 1, 0),
    },
  }));

  // 插入记录到学情统计表
  await supabase.from('学情统计').insert([
    {
      学生id: studentId,
      课程环节: courseStages[activeStage],
      学情记录: '减少星星',
      星: -1,
      雷: 0,
      当堂课总星数: studentStats[studentId]?.stars - 1,
    }
  ]);
};

// 增加雷
const handleIncreaseThunder = async (studentId: string) => {
  setStudentStats((prevStats) => ({
    ...prevStats,
    [studentId]: {
      ...prevStats[studentId],
      thunders: (prevStats[studentId]?.thunders || 0) + 1,
    },
  }));

  // 插入记录到学情统计表
  await supabase.from('学情统计').insert([
    {
      学生id: studentId,
      课程环节: courseStages[activeStage],
      学情记录: '增加雷',
      星: 0,
      雷: 1,
      当堂课总星数: studentStats[studentId]?.stars,
    }
  ]);
};

// 减少雷
const handleDecreaseThunder = async (studentId: string) => {
  setStudentStats((prevStats) => ({
    ...prevStats,
    [studentId]: {
      ...prevStats[studentId],
      thunders: Math.max((prevStats[studentId]?.thunders || 0) - 1, 0),
    },
  }));

  // 插入记录到学情统计表
  await supabase.from('学情统计').insert([
    {
      学生id: studentId,
      课程环节: courseStages[activeStage],
      学情记录: '减少雷',
      星: 0,
      雷: -1,
      当堂课总星数: studentStats[studentId]?.stars,
    }
  ]);
};

  // 渲染雷和星星图标
  const renderIcons = (count: number, icon: React.JSX.Element) => {
    return Array.from({ length: count }, (_, index) => (
      <span key={index}>{icon}</span>
    ));
  };

  // 处理课程环节切换
  const handleCourseStageChange = (index: number) => {
    setActiveStage(index);
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <div className="space-y-4">
      {/* 课程环节切换按钮 */}
      <div className="flex flex-wrap">
        {courseStages.map((stage, index) => (
          <Button
            key={index}
            variant={'ghost'}          
            onClick={() => handleCourseStageChange(index)}
            className={`${
              index === activeStage
                ? "bg-amber-300 text-white"
                : "bg-transparent text-gray-800"
            } hover:bg-amber-300 hover:text-white transition-colors`}
          >
            {stage}
          </Button>
        ))}
      </div>

      {/* 学生卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {students.map((student) => (
          <Card key={student.student_id} className="border border-gray-300 shadow-md relative">
            <CardHeader>
              <CardTitle>{student.student_name}</CardTitle>
              <div className="absolute top-0 right-0 p-2 space-x-1">
                <Button onClick={() => handleIncreaseStar(student.student_id)} variant="outline" size={"icon"}>
                  <FaStar className='text-yellow-500'/>
                </Button>
                <Button onClick={() => handleDecreaseStar(student.student_id)} variant="outline" size={"icon"}>
                  <FaStar className='text-slate-400'/>
                </Button>
                <Button onClick={() => handleIncreaseThunder(student.student_id)} variant="outline" size={"icon"}>
                  <FaBolt className='text-blue-500'/>
                </Button>
                <Button onClick={() => handleDecreaseThunder(student.student_id)} variant="outline" size={"icon"}>
                <FaBolt className='text-slate-400'/>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col justify-between">
                <div className="flex items-center">
                  <span className="flex flex-wrap text-yellow-500 mr-2">
                    {renderIcons(studentStats[student.student_id]?.stars || 0, <FaStar />)}
                  </span>
                </div>
                <div className="flex pt-2 flex-wrap items-center">
                  <span className="flex text-blue-500 mr-2">
                    {renderIcons(studentStats[student.student_id]?.thunders || 0, <FaBolt />)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

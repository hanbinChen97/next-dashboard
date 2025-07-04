import ProjectGrid from '@/app/components/dashboard/ProjectGrid';

interface Project {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'planning' | 'completed' | 'on-hold';
  progress: number;
  team: string[];
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
}

export default function AllProjectsPage() {
  const projects: Project[] = [
    {
      id: 1,
      name: "核心项目 A",
      description: "这是最重要的核心项目，需要重点关注",
      status: "active",
      progress: 75,
      team: ["张三", "李四"],
      dueDate: "2024-01-15",
      priority: "high"
    },
    {
      id: 2,
      name: "次要项目 B",
      description: "次要项目，可以稍后处理",
      status: "planning",
      progress: 0,
      team: ["王五"],
      dueDate: "2024-02-01",
      priority: "medium"
    },
    {
      id: 3,
      name: "实验项目 C",
      description: "实验性项目，探索新想法",
      status: "on-hold",
      progress: 25,
      team: ["赵六"],
      dueDate: "2024-03-01",
      priority: "low"
    },
    {
      id: 4,
      name: "维护项目 D",
      description: "需要定期维护的项目",
      status: "active",
      progress: 90,
      team: ["孙七"],
      dueDate: "",
      priority: "medium"
    },
    {
      id: 5,
      name: "学习项目 E",
      description: "用于学习和技能提升的项目",
      status: "active",
      progress: 60,
      team: ["周八"],
      dueDate: "",
      priority: "low"
    },
    {
      id: 6,
      name: "归档项目 F",
      description: "已完成的项目，已归档",
      status: "completed",
      progress: 100,
      team: ["吴九"],
      dueDate: "2023-12-01",
      priority: "low"
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">项目管理</h1>
        <p className="text-gray-600 mt-2">查看和管理所有项目</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">所有项目</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            新建项目
          </button>
        </div>
        
        <ProjectGrid projects={projects} />
      </div>
    </div>
  );
} 
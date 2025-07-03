import ProjectSummary from '@/app/components/ProjectSummary';
import ActivityFeed from '../../../components/ActivityFeed';

export default function FollowingPage() {
  // 模拟关注的项目数据
  const followedProjects = [
    {
      id: 1,
      name: "AI助手项目",
      description: "基于机器学习的智能客服系统",
      status: "active" as const,
      progress: 45,
      lastUpdate: "2小时前",
      updates: 3
    },
    {
      id: 2,
      name: "区块链钱包",
      description: "多链支持的加密货币钱包应用",
      status: "planning" as const,
      progress: 15,
      lastUpdate: "1天前",
      updates: 1
    },
    {
      id: 3,
      name: "物联网平台",
      description: "设备管理和数据采集平台",
      status: "active" as const,
      progress: 80,
      lastUpdate: "30分钟前",
      updates: 5
    }
  ];

  // 模拟活动数据
  const activities = [
    {
      id: 1,
      type: "update" as const,
      project: "AI助手项目",
      message: "完成了用户意图识别模块的开发",
      time: "2小时前",
      user: "李四"
    },
    {
      id: 2,
      type: "comment" as const,
      project: "区块链钱包",
      message: "在代码审查中提出了改进建议",
      time: "4小时前",
      user: "王五"
    },
    {
      id: 3,
      type: "milestone" as const,
      project: "物联网平台",
      message: "达到了第一个里程碑：设备连接功能",
      time: "1天前",
      user: "系统"
    }
  ];

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">雷达扫描区</h1>
        <p className="text-gray-600">保持对次要项目的感知</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 关注的项目 - 占据2/3宽度 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">关注的项目</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">共 {followedProjects.length} 个项目</span>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    发现更多
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {followedProjects.map((project) => (
                  <ProjectSummary key={project.id} project={project} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 活动时间线 - 占据1/3宽度 */}
        <div className="lg:col-span-1">
          <ActivityFeed activities={activities} />
        </div>
      </div>
    </div>
  );
} 
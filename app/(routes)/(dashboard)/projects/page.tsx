import ProjectGrid from '../../../components/ProjectGrid';

export default function ProjectsPage() {
  // 模拟项目数据
  const projects = [
    {
      id: 1,
      name: "电商平台重构",
      description: "将现有电商系统迁移到微服务架构",
      status: "active" as const,
      progress: 75,
      team: ["张三", "李四", "王五"],
      dueDate: "2024-03-15",
      priority: "high" as const
    },
    {
      id: 2,
      name: "移动端APP开发",
      description: "开发iOS和Android双平台应用",
      status: "planning" as const,
      progress: 25,
      team: ["张三", "赵六"],
      dueDate: "2024-04-20",
      priority: "medium" as const
    },
    {
      id: 3,
      name: "数据分析系统",
      description: "构建实时数据分析平台",
      status: "active" as const,
      progress: 60,
      team: ["张三", "李四", "钱七"],
      dueDate: "2024-02-28",
      priority: "high" as const
    }
  ];

  // 模拟常规邮件数据
  const regularEmails = [
    {
      id: 1,
      from: "开发团队",
      subject: "每日站会纪要",
      preview: "今日开发进度和明日计划...",
      time: "16:00",
      unread: false
    },
    {
      id: 2,
      from: "测试团队",
      subject: "测试报告更新",
      preview: "最新一轮测试结果已更新...",
      time: "15:30",
      unread: true
    }
  ];

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">核心工作区</h1>
        <p className="text-gray-600">管理深度参与的项目</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 项目网格 - 占据2/3宽度 */}
        <div className="lg:col-span-2">
          <ProjectGrid projects={projects} />
        </div>

        {/* 常规邮件 - 占据1/3宽度 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">常规邮件</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">共 {regularEmails.length} 封</span>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200">
                    查看全部
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="space-y-3">
                {regularEmails.map((email) => (
                  <div key={email.id} className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                    email.unread 
                      ? 'bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`text-sm font-medium ${
                            email.unread ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {email.from}
                          </span>
                          {email.unread && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <h3 className={`text-sm font-medium truncate ${
                          email.unread ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {email.subject}
                        </h3>
                      </div>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {email.time}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {email.preview}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
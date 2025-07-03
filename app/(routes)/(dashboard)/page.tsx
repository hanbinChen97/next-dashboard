import TaskCard from '../../components/TaskCard';
import EmailSection from '../../components/EmailSection';

// 定义任务类型
interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  tags: string[];
}

export default function HomePage() {
  // 模拟任务数据
  const tasks: Task[] = [
    {
      id: 1,
      title: "完成项目A的API设计文档",
      description: "需要设计用户认证和权限管理的API接口",
      priority: "high",
      dueDate: "2024-01-15",
      status: "pending",
      tags: ["文档", "API"]
    },
    {
      id: 2,
      title: "代码审查：用户管理模块",
      description: "审查新同事提交的用户管理功能代码",
      priority: "medium",
      dueDate: "2024-01-16",
      status: "in-progress",
      tags: ["代码审查", "用户管理"]
    },
    {
      id: 3,
      title: "准备周会演示材料",
      description: "准备本周工作进展的演示PPT",
      priority: "high",
      dueDate: "2024-01-14",
      status: "pending",
      tags: ["演示", "周会"]
    },
    {
      id: 4,
      title: "修复生产环境bug",
      description: "用户反馈的登录页面显示异常问题",
      priority: "urgent",
      dueDate: "2024-01-13",
      status: "pending",
      tags: ["bug修复", "生产环境"]
    }
  ];

  // 模拟重要邮件数据
  const importantEmails = [
    {
      id: 1,
      from: "项目经理",
      subject: "紧急：项目进度调整通知",
      preview: "由于客户需求变更，需要调整本周的开发计划...",
      time: "10:30",
      unread: true
    },
    {
      id: 2,
      from: "技术总监",
      subject: "代码质量检查结果",
      preview: "本周的代码质量检查已完成，整体质量良好...",
      time: "09:15",
      unread: false
    },
    {
      id: 3,
      from: "产品经理",
      subject: "新功能需求确认",
      preview: "关于用户反馈的新功能需求，请确认技术可行性...",
      time: "昨天",
      unread: true
    }
  ];

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">作战指挥室</h1>
        <p className="text-gray-600">今天我必须做什么</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 任务列表 - 占据2/3宽度 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">待办任务</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">共 {tasks.length} 项</span>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    添加任务
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 重要邮件 - 占据1/3宽度 */}
        <div className="lg:col-span-1">
          <EmailSection emails={importantEmails} />
        </div>
      </div>
    </div>
  );
}

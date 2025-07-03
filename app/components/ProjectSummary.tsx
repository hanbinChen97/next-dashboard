interface ProjectSummary {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'planning' | 'completed' | 'on-hold';
  progress: number;
  lastUpdate: string;
  updates: number;
}

interface ProjectSummaryProps {
  project: ProjectSummary;
}

export default function ProjectSummary({ project }: ProjectSummaryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'planning':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '进行中';
      case 'planning':
        return '规划中';
      case 'completed':
        return '已完成';
      case 'on-hold':
        return '暂停';
      default:
        return '未知';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 mb-1">{project.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{project.description}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
          {getStatusText(project.status)}
        </span>
      </div>

      {/* 进度条 */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">进度</span>
          <span className="text-xs text-gray-500">{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>

      {/* 更新信息 */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>最后更新: {project.lastUpdate}</span>
        <span>{project.updates} 个更新</span>
      </div>

      <div className="flex items-center justify-end space-x-2 mt-3 pt-3 border-t border-gray-100">
        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
          查看详情
        </button>
        <button className="text-xs text-gray-600 hover:text-gray-700">
          取消关注
        </button>
      </div>
    </div>
  );
} 
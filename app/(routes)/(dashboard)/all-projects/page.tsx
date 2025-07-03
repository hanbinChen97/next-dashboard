export default function AllProjectsPage() {
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 项目卡片占位符 */}
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">核心项目 A</h3>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">进行中</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">这是最重要的核心项目，需要重点关注</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>进度: 75%</span>
              <span>截止: 2024-01-15</span>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">次要项目 B</h3>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">待开始</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">次要项目，可以稍后处理</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>进度: 0%</span>
              <span>截止: 2024-02-01</span>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">实验项目 C</h3>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">规划中</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">实验性项目，探索新想法</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>进度: 25%</span>
              <span>截止: 2024-03-01</span>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">维护项目 D</h3>
              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">维护中</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">需要定期维护的项目</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>进度: 90%</span>
              <span>持续维护</span>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">学习项目 E</h3>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">学习中</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">用于学习和技能提升的项目</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>进度: 60%</span>
              <span>无截止日期</span>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">归档项目 F</h3>
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">已完成</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">已完成的项目，已归档</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>进度: 100%</span>
              <span>2023-12-01</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
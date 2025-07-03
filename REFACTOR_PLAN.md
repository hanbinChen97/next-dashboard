# App 目录重构计划

## 当前问题

### 1. 路由和逻辑混合
- 页面组件包含大量业务逻辑
- 数据获取逻辑分散在各页面
- 组件职责不清

### 2. 文件组织混乱
- hooks 目录不完整
- lib 目录结构单一
- 组件没有按功能分类

### 3. 数据管理问题
- 硬编码模拟数据
- 数据重复定义
- 缺少统一数据层

## 建议的新目录结构

```
app/
├── (routes)/                    # 路由分组
│   ├── (dashboard)/            # 仪表板相关路由
│   │   ├── page.tsx            # 首页
│   │   ├── projects/
│   │   │   └── page.tsx
│   │   ├── all-projects/
│   │   │   └── page.tsx
│   │   └── following/
│   │       └── page.tsx
│   ├── mails/                  # 邮件模块路由
│   │   └── page.tsx
│   └── settings/               # 设置页面路由
│       └── page.tsx
├── components/                  # 可复用组件
│   ├── ui/                     # 基础 UI 组件
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   ├── layout/                 # 布局组件
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Navigation.tsx
│   │   └── ...
│   ├── dashboard/              # 仪表板相关组件
│   │   ├── TaskCard.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectGrid.tsx
│   │   ├── ProjectSummary.tsx
│   │   ├── ActivityFeed.tsx
│   │   └── ...
│   ├── email/                  # 邮件相关组件
│   │   ├── EmailCard.tsx
│   │   ├── EmailList.tsx
│   │   ├── EmailSection.tsx
│   │   └── ...
│   └── common/                 # 通用组件
│       ├── UserAvatar.tsx
│       ├── LoginButton.tsx
│       └── ...
├── hooks/                      # 自定义 Hooks
│   ├── useEmails.ts
│   ├── useProjects.ts
│   ├── useTasks.ts
│   ├── useSettings.ts
│   └── ...
├── lib/                        # 工具库和类型定义
│   ├── types/                  # 全局类型定义
│   │   ├── index.ts
│   │   ├── project.ts
│   │   ├── task.ts
│   │   ├── email.ts
│   │   └── ...
│   ├── services/               # 业务服务层
│   │   ├── project-service.ts
│   │   ├── task-service.ts
│   │   ├── email-service.ts
│   │   ├── settings-service.ts
│   │   └── ...
│   ├── utils/                  # 工具函数
│   │   ├── date.ts
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   └── ...
│   ├── constants/              # 常量定义
│   │   ├── index.ts
│   │   ├── routes.ts
│   │   └── ...
│   └── email/                  # 邮件模块（保持现有结构）
│       ├── types.ts
│       ├── _action_server.ts
│       ├── email-service.ts
│       ├── exchange-imap.ts
│       └── email-parser.ts
├── data/                       # 模拟数据
│   ├── projects.ts
│   ├── tasks.ts
│   ├── emails.ts
│   └── ...
├── layout.tsx
├── page.tsx
├── globals.css
└── favicon.ico
```

## 重构步骤

### 第一阶段：创建新的目录结构

1. **创建路由分组**
   ```bash
   mkdir -p app/(routes)/(dashboard)
   mkdir -p app/(routes)/mails
   mkdir -p app/(routes)/settings
   ```

2. **重组组件目录**
   ```bash
   mkdir -p app/components/{ui,layout,dashboard,email,common}
   ```

3. **扩展 lib 目录**
   ```bash
   mkdir -p app/lib/{types,services,utils,constants}
   ```

4. **创建数据目录**
   ```bash
   mkdir -p app/data
   ```

### 第二阶段：移动和重构文件

1. **移动页面文件**
   - 将现有页面移动到对应的路由目录
   - 清理页面组件中的业务逻辑

2. **重组组件**
   - 按功能将组件移动到对应目录
   - 更新组件导入路径

3. **创建服务层**
   - 将业务逻辑从页面组件提取到服务层
   - 创建统一的数据获取接口

4. **创建 Hooks**
   - 为每个业务模块创建对应的 Hook
   - 统一数据获取和状态管理

### 第三阶段：优化和测试

1. **类型定义**
   - 创建统一的类型定义
   - 确保类型安全

2. **性能优化**
   - 实现数据缓存
   - 优化组件渲染

3. **测试**
   - 确保所有功能正常工作
   - 验证重构后的结构

## 具体实施建议

### 1. 页面组件重构

**重构前** (app/page.tsx):
```tsx
export default function HomePage() {
  // 硬编码数据
  const tasks = [...];
  const importantEmails = [...];
  
  return (
    <div>
      {/* 大量 JSX */}
    </div>
  );
}
```

**重构后** (app/(routes)/(dashboard)/page.tsx):
```tsx
import { useTasks } from '@/hooks/useTasks';
import { useEmails } from '@/hooks/useEmails';
import { TaskCard } from '@/components/dashboard/TaskCard';
import { EmailSection } from '@/components/email/EmailSection';

export default function HomePage() {
  const { tasks, loading: tasksLoading } = useTasks();
  const { emails, loading: emailsLoading } = useEmails({ important: true });
  
  return (
    <div>
      {/* 简洁的 JSX */}
    </div>
  );
}
```

### 2. 服务层创建

**app/lib/services/task-service.ts**:
```tsx
import { Task } from '@/lib/types/task';
import { mockTasks } from '@/data/tasks';

export class TaskService {
  static async getTasks(): Promise<Task[]> {
    // 模拟 API 调用
    return mockTasks;
  }
  
  static async getTaskById(id: string): Promise<Task | null> {
    const tasks = await this.getTasks();
    return tasks.find(task => task.id === id) || null;
  }
}
```

### 3. Hook 创建

**app/hooks/useTasks.ts**:
```tsx
import { useState, useEffect } from 'react';
import { Task } from '@/lib/types/task';
import { TaskService } from '@/lib/services/task-service';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await TaskService.getTasks();
        setTasks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return { tasks, loading, error };
}
```

## 预期收益

### 1. 代码组织更清晰
- 路由和业务逻辑分离
- 组件按功能分类
- 统一的文件命名规范

### 2. 可维护性提升
- 业务逻辑集中在服务层
- 数据获取逻辑统一管理
- 类型安全保证

### 3. 可扩展性增强
- 模块化的架构设计
- 易于添加新功能
- 支持团队协作开发

### 4. 性能优化
- 数据缓存机制
- 组件懒加载
- 按需加载

## 迁移注意事项

1. **渐进式迁移**: 不要一次性重构所有文件，分阶段进行
2. **保持功能**: 确保重构过程中功能不受影响
3. **测试验证**: 每个阶段完成后进行充分测试
4. **文档更新**: 及时更新相关文档和注释 
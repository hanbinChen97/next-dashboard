# 邮件中心模块技术文档

## 概述

邮件中心模块是一个基于 Next.js 15 的邮件管理系统，支持通过 IMAP 协议连接邮件服务器，提供邮件的查看、管理和操作功能。

## 架构设计

### 核心组件

```
app/mails/
├── page.tsx              # 邮件中心主页面
└── README               # 技术文档

app/lib/email/
├── types.ts             # 类型定义
├── _action_server.ts    # 服务端 Actions
├── email-service.ts     # 邮件服务抽象层
├── exchange-imap.ts     # Exchange/IMAP 实现
└── email-parser.ts      # 邮件解析器

app/components/
├── EmailList.tsx        # 邮件列表组件
├── EmailCard.tsx        # 邮件卡片组件
└── EmailSection.tsx     # 邮件区域组件

app/hooks/
└── useEmails.ts         # 邮件数据 Hook
```

### 数据流

1. **用户交互** → `page.tsx` 组件
2. **状态管理** → `useEmails` Hook
3. **服务端调用** → `_action_server.ts` Actions
4. **邮件服务** → `email-service.ts` 抽象层
5. **协议实现** → `exchange-imap.ts` IMAP 连接
6. **数据解析** → `email-parser.ts` 邮件解析
7. **UI 渲染** → React 组件

## 核心功能

### 1. 邮件连接管理
- 支持 Exchange/IMAP 服务器连接
- 实时连接状态监控
- 自动重连机制
- 连接配置管理

### 2. 邮件操作
- 邮件列表获取
- 文件夹切换
- 未读邮件过滤
- 邮件标记（已读/未读）
- 邮件删除
- 邮件搜索

### 3. 邮件解析
- 多部分邮件解析
- 附件处理
- HTML/纯文本内容提取
- 邮件头信息解析

## API 接口

### 类型定义

```typescript
// 邮件消息
interface EmailMessage {
  id: string;
  uid: number;
  subject: string;
  from: EmailAddress;
  to: EmailAddress[];
  date: Date;
  text?: string;
  html?: string;
  attachments: EmailAttachment[];
  flags: string[];
  isRead: boolean;
}

// 邮件获取选项
interface EmailFetchOptions {
  folder?: string;
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
  search?: string;
}
```

### 服务端 Actions

```typescript
// 获取邮件列表
getEmails(options: EmailFetchOptions): Promise<{
  success: boolean;
  data?: { emails: EmailMessage[]; total: number };
  error?: string;
}>

// 获取邮件文件夹
getEmailFolders(): Promise<{
  success: boolean;
  data?: { folders: EmailFolder[] };
  error?: string;
}>

// 获取连接状态
getEmailConnectionStatus(): Promise<{
  success: boolean;
  data?: { connected: boolean; serverInfo: ServerInfo };
  error?: string;
}>
```

### React Hook

```typescript
// useEmails Hook
function useEmails(options: EmailFetchOptions): {
  emails: EmailMessage[];
  loading: boolean;
  error: string | null;
  total: number;
  refetch: () => Promise<void>;
  connectionStatus: ConnectionStatus | null;
}
```

## 配置说明

### 环境变量

```bash
# 邮件服务器配置
EMAIL_HOST=outlook.office365.com
EMAIL_PORT=993
EMAIL_USERNAME=your-email@domain.com
EMAIL_PASSWORD=your-password
EMAIL_TLS=true
```

### 连接配置

```typescript
interface EmailConnectionConfig {
  host: string;           // 邮件服务器地址
  port: number;           // 端口号
  username: string;       // 用户名
  password: string;       // 密码
  tls: boolean;           // 是否使用 TLS
  authTimeout?: number;   // 认证超时时间
  connTimeout?: number;   // 连接超时时间
}
```

## 使用指南

### 基本使用

1. **配置邮件服务器**
   - 在环境变量中设置邮件服务器信息
   - 确保服务器支持 IMAP 协议

2. **访问邮件中心**
   - 导航到 `/mails` 页面
   - 系统会自动连接邮件服务器

3. **邮件操作**
   - 选择邮件文件夹
   - 切换未读邮件过滤
   - 刷新邮件列表
   - 查看邮件详情

### 高级功能

1. **邮件搜索**
   ```typescript
   const searchOptions = {
     folder: 'INBOX',
     search: '关键词',
     limit: 50
   };
   ```

2. **批量操作**
   - 支持批量标记已读/未读
   - 支持批量删除邮件

3. **附件处理**
   - 自动下载附件
   - 支持多种文件格式

## 错误处理

### 常见错误

1. **连接失败**
   - 检查网络连接
   - 验证服务器配置
   - 确认认证信息

2. **权限错误**
   - 检查邮箱权限设置
   - 确认 IMAP 访问已启用

3. **超时错误**
   - 调整超时配置
   - 检查网络稳定性

### 错误恢复

- 自动重连机制
- 用户手动重试
- 错误状态显示

## 性能优化

### 缓存策略

邮件模块采用了**客户端缓存**策略，结合**“先显示缓存，后更新数据”**的模式，以优化加载速度和用户体验。

-   **缓存存储位置**：所有缓存数据都存储在浏览器的 `localStorage` 中。
-   **缓存内容**：
    *   邮件列表 (`email_cache_INBOX` 或 `email_cache_{folder_name}`)
    *   文件夹列表 (`email_cache_folders`)
    *   连接状态 (`email_cache_connection_status`)
-   **缓存有效期**：
    *   邮件列表：5 分钟
    *   文件夹列表：60 分钟
    *   连接状态：1 分钟
-   **加载逻辑**：
    1.  页面加载时，首先尝试从 `localStorage` 读取缓存数据并立即显示，提供即时反馈。
    2.  同时，在后台异步发起新的服务器请求，获取最新数据。
    3.  当最新数据返回后，与当前显示的缓存数据进行比对。如果数据有更新，则更新 UI 并刷新 `localStorage` 中的缓存。
-   **缓存失效**：
    *   **时间失效**：缓存数据在达到有效期后会自动失效，下次请求时将从服务器获取最新数据。
    *   **操作失效**：当用户执行标记已读/未读、删除邮件等操作时，相关的邮件列表缓存会立即失效，确保下次刷新时获取到最新的邮件状态。

### 分页加载
- 支持分页获取邮件
- 虚拟滚动优化
- 懒加载附件

### 内存管理
- 及时释放连接
- 清理临时文件
- 优化大附件处理

## 安全考虑

### 数据安全
- 密码加密存储
- 传输加密 (TLS)
- 敏感信息脱敏

### 访问控制
- 用户权限验证
- 操作日志记录
- 异常行为监控

## 扩展性

### 插件架构
- 支持多种邮件协议
- 可扩展的解析器
- 自定义操作钩子

### 配置化
- 动态配置加载
- 多账户支持
- 自定义主题

## 开发指南

### 本地开发

1. **安装依赖**
   ```bash
   pnpm install
   ```

2. **配置环境**
   ```bash
   cp .env.example .env.local
   # 编辑 .env.local 文件
   ```

3. **启动开发服务器**
   ```bash
   pnpm dev
   ```

## 更新日志

### v1.0.0 (2024-01-01)
- 初始版本发布
- 支持基本的邮件查看功能
- IMAP 协议支持

### v1.1.0 (2024-01-15)
- 添加邮件搜索功能
- 优化性能表现
- 修复已知问题

### v1.2.0 (2024-07-04)
- **缓存机制优化**：引入客户端 `localStorage` 缓存，实现“先显示缓存，后更新数据”的策略。
- **邮件自动刷新**：每 5 分钟自动扫描新邮件并更新。
- **依赖更新**：`node-imap` 和 `mailparser` 替换 `imap-simple`，并引入 `react-email` 进行邮件渲染。
- **错误修复**：解决了 `Uint8Array` 传递问题和 `prettier` 警告。

# Next.js Dashboard

这是一个使用 Next.js 15 和 pnpm 构建的现代化仪表板项目。

## 环境要求

- Node.js >= 18.18.0 (推荐使用 Node.js 20+)
- pnpm >= 8.0.0

## 安装依赖 开发

```bash
pnpm install
pnpm dev
```

启动开发服务器，默认运行在 [http://localhost:3000](http://localhost:3000)

## 构建

```bash
pnpm build
```

## 启动生产服务器

```bash
pnpm start
```


## 其他有用的命令

```bash
# 清理 pnpm 存储
pnpm clean

# 更新依赖
pnpm update

```

## 项目结构

```
next-dashboard/
├── app/                 # Next.js App Router
│   ├── mails/          # 邮件中心模块
│   ├── components/     # 可复用组件
│   ├── hooks/          # 自定义 Hooks
│   └── lib/            # 工具库和类型定义
├── public/             # 静态资源
├── tasks/              # 项目任务文档
├── package.json        # 项目配置
├── pnpm-lock.yaml     # pnpm 锁定文件
└── .npmrc             # pnpm 配置
```

## 功能模块

### 📧 邮件中心 (`/mails`)
- **功能**: 基于 IMAP 协议的邮件管理系统
- **特性**: 
  - 支持 Exchange/IMAP 服务器连接
  - 邮件列表查看和搜索
  - 文件夹管理和切换
  - 未读邮件过滤
  - 实时连接状态监控
- **技术**: Next.js 15, TypeScript, Tailwind CSS
- **文档**: 详细技术文档请查看 [app/mails/README](app/(routes)/mails/README)

## 技术栈

- **框架**: Next.js 15
- **语言**: TypeScript
- **样式**: Tailwind CSS 4
- **包管理器**: pnpm
- **代码检查**: ESLint


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# GitHub Actions 工作流说明

本项目包含以下 GitHub Actions 工作流：

## 1. CI (ci.yml)
**触发条件**: 推送到 `main`/`master` 分支或创建 Pull Request

**功能**:
- 支持 Node.js 18.x 和 20.x 版本测试
- 安装依赖 (`pnpm install --frozen-lockfile`)
- TypeScript 类型检查 (`npx tsc --noEmit`)
- ESLint 检查 (`pnpm run lint`)
- 构建项目 (`pnpm run build`)
- 上传构建产物作为 artifacts

## 2. Build and Dev Check (build-and-dev-check.yml)
**触发条件**: 推送到 `main`/`master` 分支或创建 Pull Request

**功能**:
- 基于你提供的参考模板
- 检查 TypeScript 编译
- 执行构建命令
- 执行 lint 检查（允许失败）

## 3. Deploy (deploy.yml)
**触发条件**: 推送到 `main`/`master` 分支

**功能**:
- 自动部署到 Vercel
- 需要配置以下 Secrets:
  - `VERCEL_TOKEN`: Vercel API Token
  - `VERCEL_ORG_ID`: Vercel 组织 ID
  - `VERCEL_PROJECT_ID`: Vercel 项目 ID

## 配置说明

### 必需的 Secrets (如果使用部署功能)
在 GitHub 仓库的 Settings > Secrets and variables > Actions 中添加：

1. `VERCEL_TOKEN`: 从 Vercel 账户设置中获取
2. `VERCEL_ORG_ID`: 从 Vercel 项目设置中获取
3. `VERCEL_PROJECT_ID`: 从 Vercel 项目设置中获取

### 注意事项
- ESLint 检查设置为 `continue-on-error: true`，因为项目暂时禁用了 ESLint
- 构建产物会保留 1 天
- 支持 pnpm 缓存优化

## 本地测试
在推送代码前，可以在本地运行以下命令测试：

```bash
# 类型检查
npx tsc --noEmit

# 构建
pnpm run build

# Lint 检查
pnpm run lint
``` 
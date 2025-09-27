# Zeabur 部署指南

## 问题分析

你的项目在 Zeabur 平台部署时出现 `ECONNREFUSED` 错误，主要是因为环境变量配置不正确。

### 错误原因

在 `.env` 文件中，`NEXT_PUBLIC_PROJECT_API` 被配置为：
```env
NEXT_PUBLIC_PROJECT_API=http://localhost:9003/api
```

这个配置在本地开发时是正确的，但在 Zeabur 容器化环境中是错误的，因为：
1. `localhost:9003` 在容器中可能不存在
2. 后端服务可能运行在不同的端口或主机上

## 解决方案

### 方法一：使用相对路径（推荐）

修改 `.env` 文件：
```env
NEXT_PUBLIC_PROJECT_API=/api
```

这种方式让前端直接调用同域名的 API，避免了硬编码问题。

### 方法二：使用 Zeabur 环境变量

在 Zeabur 控制台中设置环境变量：
- 变量名：`NEXT_PUBLIC_PROJECT_API`
- 变量值：如果后端在同一服务中，使用 `/api`
- 变量值：如果后端在不同服务中，使用 `${API_SERVICE_URL}/api`

## 部署步骤

1. **修改环境配置**
   ```bash
   # 使用相对路径（推荐）
   NEXT_PUBLIC_PROJECT_API=/api
   ```

2. **设置生产环境缓存时间**
   ```bash
   NEXT_PUBLIC_CACHING_TIME=300
   ```

3. **在 Zeabur 中部署**
   - 连接 GitHub 仓库
   - 自动检测 Next.js 项目
   - 部署完成

## 环境变量说明

| 变量名 | 本地开发 | 生产环境 | 说明 |
|--------|---------|---------|------|
| `NEXT_PUBLIC_PROJECT_API` | `http://localhost:9003/api` | `/api` | 后端 API 地址 |
| `NEXT_PUBLIC_CACHING_TIME` | `1` | `300` | 页面缓存时间（秒） |

## 故障排除

如果部署后仍有问题：

1. **检查网络连接**
   - 确认后端服务是否正常运行
   - 检查防火墙和端口设置

2. **查看 Zeabur 日志**
   - 在 Zeabur 控制台查看详细日志
   - 寻找其他可能的连接错误

3. **测试 API 连接**
   - 在浏览器中直接访问 API 端点
   - 确认返回正确的响应

## 最佳实践

1. **使用相对路径**：避免硬编码 API 地址
2. **合理设置缓存时间**：生产环境使用较长的缓存时间
3. **环境变量分离**：为不同环境创建独立的配置文件
4. **日志监控**：定期检查应用日志，及时发现问题

## 相关文件

- `.env` - 本地开发环境配置
- `.env.production` - 生产环境配置示例
- `src/utils/request.ts` - API 请求工具
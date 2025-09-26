# 🚀 环境搭建指南

本文档详细介绍如何在本地搭建音乐播放器 Web 应用的开发环境。

## 📋 系统要求

### 基础环境
- **操作系统**: Windows 10+, macOS 10.15+, Ubuntu 18.04+
- **Node.js**: 16.x 或更高版本
- **Java**: JDK 8 或更高版本 (推荐 JDK 11)
- **MySQL**: 8.0 或更高版本
- **Maven**: 3.6 或更高版本
- **Git**: 最新版本

### 推荐工具
- **IDE**: VS Code, IntelliJ IDEA, WebStorm
- **数据库工具**: MySQL Workbench, Navicat, DBeaver
- **API 测试**: Postman, Insomnia

## 🛠️ 详细安装步骤

### 1. 克隆项目
```bash
# 克隆仓库
git clone https://github.com/ZZ-zz123/music-web.git
cd music-web2

# 查看项目结构
ls -la
```

### 2. 数据库配置

#### 2.1 安装 MySQL
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server

# macOS (使用 Homebrew)
brew install mysql

# Windows
# 下载并安装 MySQL Community Server
```

#### 2.2 创建数据库
```sql
-- 登录 MySQL
mysql -u root -p

-- 创建数据库
CREATE DATABASE music_web DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建用户 (可选，推荐)
CREATE USER 'musicweb'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON music_web.* TO 'musicweb'@'localhost';
FLUSH PRIVILEGES;

-- 退出
EXIT;
```

#### 2.3 导入初始数据
```bash
# 导入数据库结构和初始数据
mysql -u root -p music_web < music-web-backend/sql/init.sql

# 验证导入是否成功
mysql -u root -p -e "USE music_web; SHOW TABLES;"
```

### 3. 后端配置

#### 3.1 配置文件设置
编辑 `music-web-backend/src/main/resources/application.yml`:

```yaml
# 数据库配置
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/music_web?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai
    username: root  # 或你创建的用户名
    password: your_password  # 你的数据库密码
    driver-class-name: com.mysql.cj.jdbc.Driver

# DeepSeek AI 配置 (可选)
deepseek:
  api:
    url: ${DEEPSEEK_API_URL:https://api.deepseek.com/v1/chat/completions}
    key: ${DEEPSEEK_API_KEY:your_api_key_here}  # 替换为你的 API Key
  model: ${DEEPSEEK_MODEL:deepseek-chat}

# 文件路径配置
file:
  upload-path: ./data/
  
# 服务器配置
server:
  port: 8080
```

#### 3.2 获取 DeepSeek API Key (可选)
1. 访问 [DeepSeek 官网](https://www.deepseek.com/)
2. 注册账号并登录
3. 创建 API Key
4. 将 API Key 配置到 `application.yml` 中

#### 3.3 启动后端服务
```bash
cd music-web-backend

# 安装依赖并启动
mvn clean install
mvn spring-boot:run

# 或者使用 IDE 运行 MusicApplication.java
```

#### 3.4 验证后端启动
- 访问：http://localhost:8080
- API 文档：http://localhost:8080/swagger-ui.html
- 健康检查：http://localhost:8080/actuator/health

### 4. 前端配置

#### 4.1 安装 Node.js 依赖
```bash
cd music-web-frontend

# 安装依赖
npm install

# 或使用 yarn
yarn install
```

#### 4.2 环境配置
创建 `music-web-frontend/.env.local` 文件：

```bash
# API 基础地址
VITE_API_BASE_URL=http://localhost:8080

# 开发环境标识
VITE_NODE_ENV=development

# 是否启用 Mock 数据
VITE_USE_MOCK=false
```

#### 4.3 启动前端服务
```bash
# 开发模式启动
npm run dev

# 或使用 yarn
yarn dev
```

#### 4.4 验证前端启动
- 访问：http://localhost:5173
- 检查浏览器控制台是否有错误
- 测试登录注册功能

### 5. 全栈测试

#### 5.1 功能测试清单
- [ ] 用户注册和登录
- [ ] 音乐播放功能
- [ ] 搜索功能
- [ ] 评论系统
- [ ] AI 聊天助手 (如果配置了 API Key)
- [ ] 文件上传功能

#### 5.2 常见问题排查
```bash
# 检查端口占用
netstat -tulpn | grep :8080
netstat -tulpn | grep :5173

# 检查数据库连接
mysql -u root -p -e "SHOW DATABASES;"

# 检查后端日志
tail -f music-web-backend/logs/application.log

# 检查前端构建
cd music-web-frontend
npm run build
```

## 🔧 开发工具配置

### VS Code 配置
推荐安装以下扩展：
- **前端开发**:
  - ES7+ React/Redux/React-Native snippets
  - TypeScript Importer
  - Styled Components
  - Auto Rename Tag

- **后端开发**:
  - Extension Pack for Java
  - Spring Boot Extension Pack
  - MySQL

- **通用工具**:
  - GitLens
  - Prettier - Code formatter
  - ESLint

### IntelliJ IDEA 配置
1. 导入项目时选择 Maven 项目
2. 配置 JDK 版本
3. 启用 Spring Boot 支持
4. 配置数据库连接

## 🐛 常见问题解决

### 后端问题

#### 数据库连接失败
```
Error: Communications link failure
```
**解决方案**:
1. 检查 MySQL 服务是否启动
2. 验证用户名密码是否正确
3. 确认数据库名称是否存在
4. 检查防火墙设置

#### 端口占用
```
Port 8080 was already in use
```
**解决方案**:
```bash
# 查找占用进程
lsof -i :8080

# 结束进程
kill -9 <PID>

# 或修改端口
server.port=8081
```

### 前端问题

#### 依赖安装失败
```
npm ERR! peer dep missing
```
**解决方案**:
```bash
# 清理缓存
npm cache clean --force

# 删除 node_modules 重新安装
rm -rf node_modules package-lock.json
npm install
```

#### API 请求跨域
```
CORS policy error
```
**解决方案**:
1. 检查后端 CORS 配置
2. 确认前端代理配置
3. 验证 API 地址是否正确

### 通用问题

#### Git 克隆失败
**解决方案**:
```bash
# 使用 HTTPS 克隆
git clone https://github.com/ZZ-zz123/music-web.git

# 或配置 SSH Key
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

## 📞 获取帮助

如果遇到问题：

1. **查看日志**: 检查控制台和日志文件输出
2. **搜索 Issues**: 在项目 Issues 中搜索类似问题
3. **创建 Issue**: 提供详细的错误信息和环境配置
4. **社区讨论**: 参与 GitHub Discussions

## 🎉 完成配置

配置完成后，你应该能够：

- ✅ 访问前端应用 (http://localhost:5173)
- ✅ 后端 API 正常响应 (http://localhost:8080)
- ✅ 数据库连接成功
- ✅ 用户注册登录功能正常
- ✅ 音乐播放功能正常

恭喜！你已经成功搭建了开发环境。现在可以开始开发新功能了！🚀

---

*如果你发现文档中有任何错误或需要补充的内容，欢迎提交 PR 改进文档。*

# 智求职 (SmartJob)

AI驱动的智能求职系统，融合GPT-4大语言模型，为求职者提供一站式AI辅助服务。

## 功能特性

### 1. 简历智能分析
- AI深度分析简历内容
- 评估简历完整度与专业性
- 技能标签自动提取
- 与目标职位的匹配度分析
- 个性化优化建议

### 2. 模拟面试
- 基于简历和目标职位生成个性化面试问题
- 涵盖自我介绍、技术能力、行为面试等多个维度
- 实时评估回答质量
- 详细的反馈与改进建议

### 3. 职位智能匹配
- 基于用户简历和求职偏好精准推荐
- 匹配度评分与排名
- 展示匹配原因与个人优势
- 指出需要提升的方向

### 4. AI求职助手
- 7x24小时在线的智能求职顾问
- 支持简历修改建议
- 面试技巧指导
- 职业规划建议
- 多轮对话上下文理解

## 技术栈

### 后端
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **AI**: OpenAI API (GPT-4)
- **Authentication**: JWT

### 前端
- **Framework**: React 18
- **Language**: TypeScript
- **UI Library**: Ant Design 5
- **State Management**: Redux Toolkit
- **Router**: React Router 6

## 项目结构

```
qiuzhi/
├── client/                 # 前端应用
│   ├── src/
│   │   ├── components/    # 公共组件
│   │   ├── pages/        # 页面组件
│   │   ├── store/        # Redux状态管理
│   │   ├── App.js        # 路由配置
│   │   └── index.js      # 入口文件
│   └── package.json
├── server/                 # 后端应用
│   ├── models/            # 数据模型
│   ├── routes/           # API路由
│   ├── services/        # 业务逻辑服务
│   ├── middleware/      # 中间件
│   ├── app.js           # 应用入口
│   └── package.json
├── SPEC.md               # 项目规划文档
└── README.md
```

## 快速开始

### 环境要求
- Node.js >= 16
- MongoDB >= 6
- OpenAI API Key

### 1. 克隆项目
```bash
git clone https://github.com/YZYY95K/qiuzhi.git
cd qiuzhi
```

### 2. 配置后端
```bash
cd server
npm install

# 创建 .env 文件
PORT=3000
MONGODB_URI=mongodb://localhost:27017/qiuzhi
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-api-key
```

### 3. 配置前端
```bash
cd client
npm install
```

### 4. 启动服务

启动后端（终端1）：
```bash
cd server
npm run dev
```

启动前端（终端2）：
```bash
cd client
npm start
```

### 5. 访问应用
- 前端地址: http://localhost:3000
- 后端API: http://localhost:3000/api

## API 文档

### 认证接口
| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/auth/register | 用户注册 |
| POST | /api/auth/login | 用户登录 |
| GET | /api/auth/profile | 获取用户信息 |

### 简历管理
| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/resume/upload | 上传简历文件 |
| GET | /api/resume | 获取简历信息 |
| PUT | /api/resume | 更新简历 |
| DELETE | /api/resume | 删除简历 |

### AI 功能
| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/ai/analyze-resume | AI简历分析 |
| POST | /api/ai/generate-questions | 生成面试问题 |
| POST | /api/ai/evaluate-answer | 评估回答 |
| POST | /api/ai/chat | AI求职助手对话 |

### 职位管理
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/positions | 获取职位列表 |
| GET | /api/positions/:id | 获取职位详情 |
| POST | /api/positions/recommend | 获取推荐职位 |

## 数据库模型

### User (用户)
- 基础信息（邮箱、密码、姓名、手机）
- 简历信息（文件、技能、工作经历、教育背景）
- 求职偏好（目标职位、目标城市、薪资范围）

### Position (职位)
- 职位信息（标题、公司、地点、薪资）
- 职位要求（技能要求、描述）

### ResumeAnalysis (简历分析)
- 分析结果（完整度、匹配度、优势、劣势、建议）

### InterviewSession (面试记录)
- 面试问题与回答
- 评估结果与分数

### ChatMessage (聊天记录)
- 对话内容与上下文

## 开发说明

### AI提示词设计
系统使用精心设计的提示词模板，确保AI在不同场景下给出专业、一致的回答。提示词包括：
- 简历分析专家角色
- 面试官角色
- 求职顾问角色

### 安全考虑
- 用户密码使用bcrypt加密存储
- 使用JWT进行身份认证
- 敏感配置通过环境变量管理
- .env文件已加入.gitignore

## License

MIT License

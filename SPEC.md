# 求职系统 AI 集成规划

## 1. 项目概述

**项目名称**: 智求职 (SmartJob)
**项目类型**: 全新Web应用
**核心功能**: 将AI能力深度融合到求职系统中，提供简历智能分析、模拟面试、职位智能匹配、AI求职助手等功能
**目标用户**: 求职者、应届毕业生、转职人士

## 2. 技术架构

### 后端
- **框架**: Node.js + Express
- **数据库**: MongoDB
- **AI接口**: OpenAI API (GPT-4)
- **认证**: JWT

### 前端
- **框架**: React + TypeScript
- **UI库**: Ant Design
- **状态管理**: Redux Toolkit

## 3. AI 功能详细设计

### 3.1 简历智能分析
- **功能描述**: 上传简历（PDF/Word），AI分析简历内容，评估与目标职位的匹配度
- **AI能力**:
  - 简历内容解析与结构化
  - 技能标签提取
  - 简历完整度评分
  - 与职位描述的匹配度分析
  - 个性化优化建议
- **数据流**:
  1. 用户上传简历文件
  2. 系统解析文件内容
  3. 发送给AI进行深度分析
  4. 返回结构化分析结果

### 3.2 模拟面试
- **功能描述**: 基于用户简历和目标职位，生成个性化面试问题
- **AI能力**:
  - 根据职位生成高频面试题
  - 根据简历生成个性化问题
  - 实时语音/文字对话模拟
  - 面试表现评估与反馈
- **数据流**:
  1. 用户选择目标职位
  2. AI生成面试问题列表
  3. 用户回答问题
  4. AI实时评价与追问
  5. 面试结束生成评估报告

### 3.3 职位智能匹配
- **功能描述**: 基于用户简历、求职偏好和历史行为，智能推荐合适职位
- **AI能力**:
  - 用户画像构建
  - 职位与候选人匹配度计算
  - 推荐理由生成
  - 竞争分析
- **数据流**:
  1. 收集用户简历和偏好
  2. 构建用户技能画像
  3. 与职位库匹配
  4. 生成个性化推荐列表

### 3.4 AI求职助手
- **功能描述**: 7x24小时在线的智能求职顾问
- **AI能力**:
  - 求职流程咨询
  - 简历修改建议
  - 面试技巧指导
  - 职业规划建议
  - 行业信息查询
- **数据流**:
  1. 用户输入问题
  2. AI理解上下文（简历、求职阶段等）
  3. 生成专业回复
  4. 支持多轮对话

## 4. 数据库模型

### User (用户)
```
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  name: String,
  phone: String,
  resume: {
    fileUrl: String,
    parsedContent: String,
    skills: [String],
    experience: [{
      company: String,
      position: String,
      duration: String,
      description: String
    }],
    education: [{
      school: String,
      degree: String,
      major: String,
      graduationYear: Number
    }]
  },
  preferences: {
    targetPositions: [String],
    targetCities: [String],
    salaryRange: { min: Number, max: Number }
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Position (职位)
```
{
  _id: ObjectId,
  title: String,
  company: String,
  location: String,
  salary: { min: Number, max: Number },
  requirements: [String],
  description: String,
  skills: [String],
  createdAt: Date
}
```

### ResumeAnalysis (简历分析记录)
```
{
  _id: ObjectId,
  userId: ObjectId,
  resumeContent: String,
  targetPosition: String,
  analysis: {
    completeness: Number,
    matchScore: Number,
    strengths: [String],
    weaknesses: [String],
    suggestions: [String]
  },
  createdAt: Date
}
```

### InterviewSession (面试记录)
```
{
  _id: ObjectId,
  userId: ObjectId,
  positionId: ObjectId,
  questions: [{
    question: String,
    answer: String,
    evaluation: String,
    score: Number
  }],
  overallEvaluation: String,
  totalScore: Number,
  createdAt: Date
}
```

### ChatMessage (聊天记录)
```
{
  _id: ObjectId,
  userId: ObjectId,
  role: String, // 'user' | 'assistant'
  content: String,
  context: Object,
  createdAt: Date
}
```

## 5. API 端点设计

### 认证
- POST /api/auth/register - 用户注册
- POST /api/auth/login - 用户登录
- GET /api/auth/profile - 获取用户信息

### 简历管理
- POST /api/resume/upload - 上传简历
- GET /api/resume - 获取简历信息
- PUT /api/resume - 更新简历
- DELETE /api/resume - 删除简历

### AI 功能
- POST /api/ai/analyze-resume - AI简历分析
- POST /api/ai/generate-questions - 生成面试问题
- POST /api/ai/evaluate-answer - 评估回答
- POST /api/ai/match-positions - 智能匹配职位
- POST /api/ai/chat - AI求职助手对话

### 职位管理
- GET /api/positions - 获取职位列表
- GET /api/positions/:id - 获取职位详情
- POST /api/positions/recommend - 获取推荐职位

## 6. 项目目录结构

```
qiuzhi/
├── server/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Position.js
│   │   ├── ResumeAnalysis.js
│   │   ├── InterviewSession.js
│   │   └── ChatMessage.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── resume.js
│   │   ├── positions.js
│   │   └── ai.js
│   ├── services/
│   │   ├── openai.js
│   │   ├── resumeAnalyzer.js
│   │   ├── interviewService.js
│   │   └── matcherService.js
│   ├── middleware/
│   │   └── auth.js
│   └── app.js
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   └── App.js
│   └── package.json
├── SPEC.md
└── README.md
```

## 7. AI 提示词设计

### 简历分析提示词
```
你是一位专业的简历优化顾问。请分析以下简历内容：
1. 评估简历的完整度和专业性
2. 识别简历中的优势和亮点
3. 指出需要改进的地方
4. 提供具体的优化建议
5. 评估与目标职位的匹配度

简历内容：{resumeContent}
目标职位：{targetPosition}
```

### 模拟面试提示词
```
你是一位经验丰富的面试官。请基于以下信息进行面试：
1. 根据候选人的简历和目标职位，提出合适的面试问题
2. 对候选人的回答进行评价和反馈
3. 根据需要追问深入的问题
4. 最后给出整体评估和建议

候选人简历：{resumeContent}
目标职位：{targetPosition}
```

### 求职助手提示词
```
你是一位专业的求职顾问。请回答用户的问题，提供有帮助的建议。
当前用户信息：{userContext}
用户问题：{userQuestion}
```

## 8. 实现优先级

1. **第一阶段**: 基础架构搭建（用户认证、简历上传）
2. **第二阶段**: 简历智能分析
3. **第三阶段**: 职位智能匹配
4. **第四阶段**: 模拟面试
5. **第五阶段**: AI求职助手

## 9. 环境变量

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/qiuzhi
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-api-key
```

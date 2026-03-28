const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function analyzeResume(resumeContent, targetPosition) {
  const prompt = `你是一位专业的简历优化顾问。请分析以下简历内容：
1. 评估简历的完整度和专业性（0-100分）
2. 识别简历中的优势和亮点
3. 指出需要改进的地方
4. 提供具体的优化建议
5. 评估与目标职位的匹配度（0-100分）

简历内容：${resumeContent}
目标职位：${targetPosition}

请以JSON格式返回，格式如下：
{
  "completeness": 分数0-100,
  "matchScore": 分数0-100,
  "strengths": ["优势1", "优势2"],
  "weaknesses": ["问题1", "问题2"],
  "suggestions": ["建议1", "建议2"]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7
  });

  const result = response.choices[0].message.content;
  return JSON.parse(result);
}

async function generateInterviewQuestions(resumeContent, targetPosition, targetCompany) {
  const prompt = `你是一位经验丰富的面试官。请根据以下信息生成8-10个面试问题：

候选人简历：
${resumeContent}

目标职位：${targetPosition}
目标公司：${targetCompany || '未指定'}

要求：
1. 问题应该涵盖：自我介绍、岗位匹配度、技术能力、解决问题的能力、团队协作、职业规划等方面
2. 每个问题要结合候选人的具体背景
3. 前1-3个问题应该是基础的自我介绍类问题
4. 后面的问题应该逐步深入

请以JSON数组格式返回，每个问题包含：
{
  "question": "问题内容",
  "type": "intro|behavior|technical|cultural",
  "difficulty": "easy|medium|hard",
  "keyPoint": "考察重点"
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7
  });

  return JSON.parse(response.choices[0].message.content);
}

async function evaluateAnswer(question, answer, resumeContent) {
  const prompt = `你是一位资深的技术面试官。请评估候选人对以下面试问题的回答：

问题：${question}
回答：${answer}

候选人背景：
${resumeContent}

请从以下几个方面评估：
1. 回答的完整度（0-100）
2. 回答的专业性（0-100）
3. 表达清晰度（0-100）
4. 与岗位的匹配度（0-100）

并给出：
- 具体的评价反馈（2-3句话）
- 如果回答不够好，给出优化建议
- 是否需要追问（boolean）

请以JSON格式返回：
{
  "scores": {
    "completeness": 数字,
    "professionalism": 数字,
    "clarity": 数字,
    "relevance": 数字
  },
  "totalScore": 数字,
  "feedback": "评价反馈",
  "suggestions": ["优化建议"],
  "needsFollowUp": boolean
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7
  });

  return JSON.parse(response.choices[0].message.content);
}

async function matchPositions(userProfile, positions) {
  const prompt = `你是一位职位匹配专家。请根据候选人的背景，从以下职位列表中找出最匹配的职位，并给出匹配理由。

候选人背景：
${JSON.stringify(userProfile, null, 2)}

职位列表：
${JSON.stringify(positions, null, 2)}

请为每个职位计算匹配度（0-100），并给出：
1. 匹配度分数
2. 匹配原因
3. 候选人的优势
4. 需要改进的地方

请以JSON数组格式返回：
[{
  "positionId": "职位ID",
  "matchScore": 数字,
  "matchReasons": ["原因1", "原因2"],
  "candidateStrengths": ["优势1"],
  "areasForImprovement": ["改进点1"]
}]`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5
  });

  return JSON.parse(response.choices[0].message.content);
}

async function chatWithAssistant(userMessage, userContext) {
  const contextPrompt = userContext
    ? `用户信息：
- 姓名：${userContext.name || '未知'}
- 目标职位：${userContext.targetPositions?.join(', ') || '未指定'}
- 技能：${userContext.skills?.join(', ') || '未提供'}
- 求职阶段：${userContext.jobStage || '未知'}

`
    : '';

  const prompt = `你是一位专业、友好的求职顾问。请回答用户的问题，提供有帮助的建议。
${contextPrompt}
用户问题：${userMessage}

请以友好、专业的方式回答。如果涉及到具体的简历修改或面试建议，可以请用户提供更多详细信息。`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "你是一位专业的求职顾问，名为小智。你可以帮助用户解答求职相关的问题，提供简历优化建议，面试技巧指导，职业规划建议等。请始终保持专业、友好、有帮助的态度。" },
      { role: "user", content: prompt }
    ],
    temperature: 0.8
  });

  return response.choices[0].message.content;
}

module.exports = {
  analyzeResume,
  generateInterviewQuestions,
  evaluateAnswer,
  matchPositions,
  chatWithAssistant
};

const express = require('express');
const User = require('../models/User');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const InterviewSession = require('../models/InterviewSession');
const ChatMessage = require('../models/ChatMessage');
const authMiddleware = require('../middleware/auth');
const {
  analyzeResume,
  generateInterviewQuestions,
  evaluateAnswer,
  chatWithAssistant
} = require('../services/openai');

const router = express.Router();

router.post('/analyze-resume', authMiddleware, async (req, res) => {
  try {
    const { resumeContent, targetPosition } = req.body;

    if (!resumeContent) {
      return res.status(400).json({ error: 'Resume content is required' });
    }

    const analysis = await analyzeResume(resumeContent, targetPosition || '通用职位');

    const resumeAnalysis = new ResumeAnalysis({
      userId: req.userId,
      resumeContent,
      targetPosition: targetPosition || '通用职位',
      analysis
    });

    await resumeAnalysis.save();

    res.json({
      success: true,
      analysis,
      analysisId: resumeAnalysis._id
    });
  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

router.post('/generate-questions', authMiddleware, async (req, res) => {
  try {
    const { positionId, targetCompany } = req.body;

    const user = await User.findById(req.userId);
    if (!user || !user.resume) {
      return res.status(400).json({ error: 'Please upload your resume first' });
    }

    const resumeContent = user.resume.parsedContent ||
      `姓名: ${user.name}, 技能: ${user.resume.skills?.join(', ')}, 经验: ${user.resume.experience?.map(e => `${e.position}@${e.company}`).join(', ')}`;

    const positionTitle = positionId || targetCompany || '目标职位';

    const questions = await generateInterviewQuestions(
      resumeContent,
      positionTitle,
      targetCompany
    );

    const interviewSession = new InterviewSession({
      userId: req.userId,
      positionId: positionId,
      questions: questions.map(q => ({
        question: q.question,
        answer: '',
        evaluation: '',
        score: 0
      })),
      totalScore: 0
    });

    await interviewSession.save();

    res.json({
      success: true,
      sessionId: interviewSession._id,
      questions
    });
  } catch (error) {
    console.error('Generate questions error:', error);
    res.status(500).json({ error: 'Failed to generate interview questions' });
  }
});

router.post('/evaluate-answer', authMiddleware, async (req, res) => {
  try {
    const { sessionId, questionIndex, answer } = req.body;

    const interviewSession = await InterviewSession.findOne({
      _id: sessionId,
      userId: req.userId
    });

    if (!interviewSession) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    const user = await User.findById(req.userId);
    const resumeContent = user.resume?.parsedContent || '';

    const question = interviewSession.questions[questionIndex];
    const evaluation = await evaluateAnswer(question.question, answer, resumeContent);

    interviewSession.questions[questionIndex].answer = answer;
    interviewSession.questions[questionIndex].evaluation = evaluation.feedback;
    interviewSession.questions[questionIndex].score = evaluation.totalScore;

    await interviewSession.save();

    res.json({
      success: true,
      evaluation: evaluation
    });
  } catch (error) {
    console.error('Evaluate answer error:', error);
    res.status(500).json({ error: 'Failed to evaluate answer' });
  }
});

router.post('/complete-interview', authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.body;

    const interviewSession = await InterviewSession.findOne({
      _id: sessionId,
      userId: req.userId
    });

    if (!interviewSession) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    const totalScore = interviewSession.questions.reduce(
      (sum, q) => sum + (q.score || 0),
      0
    ) / interviewSession.questions.length;

    interviewSession.totalScore = totalScore;
    interviewSession.overallEvaluation = generateOverallEvaluation(totalScore);

    await interviewSession.save();

    res.json({
      success: true,
      totalScore,
      overallEvaluation: interviewSession.overallEvaluation,
      questions: interviewSession.questions
    });
  } catch (error) {
    console.error('Complete interview error:', error);
    res.status(500).json({ error: 'Failed to complete interview' });
  }
});

function generateOverallEvaluation(score) {
  if (score >= 80) {
    return '表现优秀！你在面试中展现出了很强的专业能力和沟通技巧。建议继续保持自信，注意细节描写。';
  } else if (score >= 60) {
    return '表现良好，有一定的专业能力。可以进一步完善回答的逻辑性和具体细节。';
  } else {
    return '需要继续练习。建议多了解岗位需求，完善简历，准备更多具体案例来支撑你的回答。';
  }
}

router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { message, clearContext } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (clearContext) {
      await ChatMessage.deleteMany({ userId: req.userId });
    }

    const user = await User.findById(req.userId);

    const userContext = {
      name: user.name,
      targetPositions: user.preferences?.targetPositions || [],
      skills: user.resume?.skills || [],
      jobStage: determineJobStage(user)
    };

    const assistantResponse = await chatWithAssistant(message, userContext);

    const userMessage = new ChatMessage({
      userId: req.userId,
      role: 'user',
      content: message
    });

    const assistantMessage = new ChatMessage({
      userId: req.userId,
      role: 'assistant',
      content: assistantResponse
    });

    await userMessage.save();
    await assistantMessage.save();

    res.json({
      success: true,
      response: assistantResponse,
      messageId: assistantMessage._id
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to get response' });
  }
});

function determineJobStage(user) {
  if (!user.resume || !user.resume.experience || user.resume.experience.length === 0) {
    return '刚开始求职';
  }
  if (user.resume.experience.length >= 3) {
    return '有丰富经验';
  }
  return '有一定经验';
}

router.get('/chat/history', authMiddleware, async (req, res) => {
  try {
    const messages = await ChatMessage.find({ userId: req.userId })
      .sort({ createdAt: 1 })
      .limit(50);

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/analysis/history', authMiddleware, async (req, res) => {
  try {
    const analyses = await ResumeAnalysis.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ analyses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

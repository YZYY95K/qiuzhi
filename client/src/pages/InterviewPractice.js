import React, { useState } from 'react';
import { Card, Button, Input, List, Tag, Typography, Space, message, Steps, Rate } from 'antd';
import { PlayCircleOutlined, SendOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { generateQuestions, evaluateAnswer, completeInterview, resetInterview } from '../store/slices/interviewSlice';

const { Title, Text } = Typography;
const { TextArea } = Input;

function InterviewPractice() {
  const dispatch = useDispatch();
  const { questions, currentQuestionIndex, evaluations, loading } = useSelector((state) => state.interview);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isInterviewFinished, setIsInterviewFinished] = useState(false);
  const [targetCompany, setTargetCompany] = useState('');

  const handleStartInterview = async () => {
    const result = await dispatch(generateQuestions({ targetCompany }));
    if (generateQuestions.fulfilled.match(result)) {
      setSessionId(result.payload.sessionId);
      setIsInterviewStarted(true);
      message.success('面试问题已生成，准备开始');
    } else {
      message.error('生成问题失败，请重试');
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) {
      message.warning('请输入回答');
      return;
    }

    const result = await dispatch(evaluateAnswer({
      sessionId,
      questionIndex: currentQuestionIndex,
      answer: currentAnswer
    }));

    if (evaluateAnswer.fulfilled.match(result)) {
      message.success('回答已提交');
      setCurrentAnswer('');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      dispatch({ type: 'interview/setCurrentQuestion', payload: currentQuestionIndex + 1 });
      setCurrentAnswer('');
    }
  };

  const handleFinishInterview = async () => {
    const result = await dispatch(completeInterview(sessionId));
    if (completeInterview.fulfilled.match(result)) {
      setIsInterviewFinished(true);
      message.success('面试完成');
    }
  };

  const handleReset = () => {
    dispatch(resetInterview());
    setIsInterviewStarted(false);
    setIsInterviewFinished(false);
    setSessionId(null);
    setCurrentAnswer('');
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <Title level={4}>模拟面试</Title>

      {!isInterviewStarted ? (
        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Text>输入目标公司（可选），开始生成个性化面试问题</Text>
            <Input
              placeholder="目标公司（可选）"
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              style={{ width: 300 }}
            />
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={handleStartInterview}
              loading={loading}
              size="large"
            >
              开始面试
            </Button>
          </Space>
        </Card>
      ) : !isInterviewFinished ? (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Steps
            current={currentQuestionIndex}
            items={questions.map((q, i) => ({ title: `问题 ${i + 1}` }))}
          />

          <Card>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Tag color={currentQuestion?.type === 'intro' ? 'blue' : currentQuestion?.type === 'technical' ? 'purple' : 'green'}>
                  {currentQuestion?.type === 'intro' ? '自我介绍' : currentQuestion?.type === 'technical' ? '技术问题' : currentQuestion?.type === 'behavior' ? '行为面试' : '综合问题'}
                </Tag>
                <Tag>{currentQuestion?.difficulty === 'easy' ? '简单' : currentQuestion?.difficulty === 'medium' ? '中等' : '困难'}</Tag>
              </div>
              <Title level={5}>{currentQuestion?.question}</Title>
              <Text type="secondary">考察重点：{currentQuestion?.keyPoint}</Text>

              <TextArea
                rows={6}
                placeholder="请输入你的回答..."
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
              />

              <Space>
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSubmitAnswer}
                  disabled={!currentAnswer.trim()}
                >
                  提交回答
                </Button>
                {currentQuestionIndex < questions.length - 1 ? (
                  <Button onClick={handleNextQuestion}>
                    下一题
                  </Button>
                ) : (
                  <Button type="primary" onClick={handleFinishInterview}>
                    完成面试
                  </Button>
                )}
              </Space>
            </Space>
          </Card>

          {evaluations[currentQuestionIndex] && (
            <Card title="回答评估" style={{ background: '#f6ffed' }}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Rate disabled value={evaluations[currentQuestionIndex].totalScore / 20} />
                <Text>{evaluations[currentQuestionIndex].feedback}</Text>
                {evaluations[currentQuestionIndex].suggestions?.length > 0 && (
                  <div>
                    <Text strong>优化建议：</Text>
                    <List
                      size="small"
                      dataSource={evaluations[currentQuestionIndex].suggestions}
                      renderItem={(item) => <List.Item>- {item}</List.Item>}
                    />
                  </div>
                )}
              </Space>
            </Card>
          )}
        </Space>
      ) : (
        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a' }} />
            <Title level={4}>面试完成！</Title>
            <Button type="primary" onClick={handleReset}>
              重新开始
            </Button>
          </Space>
        </Card>
      )}
    </div>
  );
}

export default InterviewPractice;

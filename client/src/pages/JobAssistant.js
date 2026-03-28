import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, List, Avatar, Typography, Space, Spin } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined, ClearOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

function JobAssistant() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: '你好！我是智求职AI助手小智，可以帮助你解答求职相关的问题，如简历优化、面试技巧、职业规划等。有什么可以帮到你的吗？'
        }
      ]);
    }
  }, []);

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { role: 'user', content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3000/api/ai/chat',
        { message: currentMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const assistantMessage = {
        role: 'assistant',
        content: response.data.response
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: '抱歉，我遇到了一些问题，请稍后再试。'
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setLoading(false);
  };

  const handleClear = async () => {
    setClearing(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:3000/api/ai/chat',
        { message: 'clear', clearContext: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages([
        {
          role: 'assistant',
          content: '对话已清除，我是智求职AI助手小智，可以帮助你解答求职相关的问题。有什么可以帮到你的吗？'
        }
      ]);
    } catch (error) {
      console.error('Failed to clear chat:', error);
    }
    setClearing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div>
      <Title level={4}>AI求职助手</Title>

      <Card
        style={{ height: 500, display: 'flex', flexDirection: 'column' }}
        bodyStyle={{ display: 'flex', flexDirection: 'column', padding: 0, height: '100%' }}
      >
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          <List
            dataSource={messages}
            renderItem={(item) => (
              <List.Item style={{ justifyContent: item.role === 'user' ? 'flex-end' : 'flex-start', border: 'none' }}>
                <Space align="start">
                  {item.role === 'assistant' && (
                    <Avatar icon={<RobotOutlined />} style={{ background: '#1890ff' }} />
                  )}
                  <Card
                    size="small"
                    style={{
                      maxWidth: '70%',
                      background: item.role === 'user' ? '#1890ff' : '#f5f5f5',
                      color: item.role === 'user' ? 'white' : 'inherit'
                    }}
                  >
                    <Text style={{ color: item.role === 'user' ? 'white' : 'inherit' }}>
                      {item.content}
                    </Text>
                  </Card>
                  {item.role === 'user' && (
                    <Avatar icon={<UserOutlined />} style={{ background: '#52c41a' }} />
                  )}
                </Space>
              </List.Item>
            )}
          />
          {loading && (
            <div style={{ textAlign: 'center', padding: 8 }}>
              <Spin size="small" />
              <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>小智正在思考...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0' }}>
          <Space.Compact style={{ width: '100%' }}>
            <Button
              icon={<ClearOutlined />}
              onClick={handleClear}
              loading={clearing}
              disabled={loading}
            >
              清空
            </Button>
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入你的问题..."
              disabled={loading}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              loading={loading}
            >
              发送
            </Button>
          </Space.Compact>
        </div>
      </Card>
    </div>
  );
}

export default JobAssistant;

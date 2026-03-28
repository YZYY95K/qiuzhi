import React, { useState, useEffect } from 'react';
import { Card, List, Tag, Button, Typography, Space, Progress, Empty, Spin } from 'antd';
import { SearchOutlined, EnvironmentOutlined, DollarOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

function JobMatcher() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/positions');
      setPositions(response.data.positions || []);
    } catch (error) {
      console.error('Failed to fetch positions:', error);
    }
  };

  const handleGetRecommendations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3000/api/positions/recommend',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecommendations(response.data.recommendations || []);
    } catch (error) {
      console.error('Failed to get recommendations:', error);
    }
    setLoading(false);
  };

  const getMatchScoreTag = (score) => {
    if (score >= 80) return <Tag color="success">高度匹配</Tag>;
    if (score >= 60) return <Tag color="processing">匹配</Tag>;
    return <Tag color="default">一般</Tag>;
  };

  return (
    <div>
      <Title level={4}>职位智能匹配</Title>

      <Card
        style={{ marginBottom: 16, cursor: 'pointer', background: '#f0f5ff' }}
        onClick={handleGetRecommendations}
        hoverable
      >
        <Space>
          <SearchOutlined style={{ fontSize: 24, color: '#1890ff' }} />
          <div>
            <Text strong>根据我的简历获取推荐职位</Text>
            <br />
            <Text type="secondary">基于你的技能、经验精准匹配</Text>
          </div>
        </Space>
      </Card>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 50 }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>AI正在分析匹配中...</div>
        </div>
      ) : recommendations.length > 0 ? (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={5}>为你推荐以下职位</Title>
          {recommendations.map((rec, index) => (
            <Card key={index} size="small">
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Space>
                  <Text strong style={{ fontSize: 16 }}>{rec.position?.title}</Text>
                  {getMatchScoreTag(rec.matchScore)}
                </Space>
                <Text type="secondary">{rec.position?.company}</Text>
                <Space>
                  <Tag icon={<EnvironmentOutlined />}>{rec.position?.location}</Tag>
                  {rec.position?.salary && (
                    <Tag icon={<DollarOutlined />}>
                      {rec.position.salary.min}-{rec.position.salary.max}K
                    </Tag>
                  )}
                </Space>

                {rec.matchScore >= 80 && (
                  <div style={{ marginTop: 8 }}>
                    <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                    <Text type="secondary">你的优势：</Text>
                    <div>
                      {rec.candidateStrengths?.map((s, i) => (
                        <Tag key={i} color="green">{s}</Tag>
                      ))}
                    </div>
                  </div>
                )}

                {rec.matchScore < 80 && (
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary">需要提升：</Text>
                    <div>
                      {rec.areasForImprovement?.map((a, i) => (
                        <Tag key={i} color="orange">{a}</Tag>
                      ))}
                    </div>
                  </div>
                )}
              </Space>
            </Card>
          ))}
        </Space>
      ) : (
        <Empty description="点击上方卡片获取AI智能推荐" />
      )}

      <Card title="全部职位" style={{ marginTop: 24 }}>
        <List
          size="small"
          dataSource={positions}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.title}
                description={
                  <Space>
                    <Text type="secondary">{item.company}</Text>
                    <Tag>{item.location}</Tag>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}

export default JobMatcher;

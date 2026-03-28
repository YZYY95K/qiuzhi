import React from 'react';
import { Row, Col, Card, Statistic, List, Avatar } from 'antd';
import { FileTextOutlined, TeamOutlined, SearchOutlined, RobotOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const features = [
    {
      title: '简历智能分析',
      description: 'AI深度分析简历，评估匹配度',
      icon: <FileTextOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
      path: '/resume-analyzer',
      color: '#e6f7ff'
    },
    {
      title: '模拟面试',
      description: 'AI生成个性化面试问题',
      icon: <TeamOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
      path: '/interview',
      color: '#f6ffed'
    },
    {
      title: '职位智能匹配',
      description: '基于简历精准推荐合适职位',
      icon: <SearchOutlined style={{ fontSize: 32, color: '#faad14' }} />,
      path: '/job-matcher',
      color: '#fffbe6'
    },
    {
      title: 'AI求职助手',
      description: '7x24小时在线求职顾问',
      icon: <RobotOutlined style={{ fontSize: 32, color: '#722ed1' }} />,
      path: '/assistant',
      color: '#f9f0ff'
    }
  ];

  const tips = [
    '建议先完善简历信息，再使用AI分析功能',
    '模拟面试可以帮助你熟悉面试流程',
    '定期更新简历，提高被HR发现的概率',
    '使用求职助手获取更多求职技巧'
  ];

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 24 }}>欢迎使用智求职系统</h1>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card><Statistic title="今日分析" value={3} prefix={<FileTextOutlined />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="模拟面试" value={2} prefix={<TeamOutlined />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="匹配职位" value={15} prefix={<SearchOutlined />} suffix={<ArrowUpOutlined style={{ color: '#52c41a' }} />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="助手对话" value={8} prefix={<RobotOutlined />} /></Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={18}>
          <Card title="AI功能">
            <Row gutter={[16, 16]}>
              {features.map((feature, index) => (
                <Col span={6} key={index}>
                  <Card
                    hoverable
                    style={{ background: feature.color, textAlign: 'center' }}
                    onClick={() => navigate(feature.path)}
                  >
                    <div style={{ marginBottom: 8 }}>{feature.icon}</div>
                    <div style={{ fontWeight: 'bold' }}>{feature.title}</div>
                    <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{feature.description}</div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="求职小贴士">
            <List
              size="small"
              dataSource={tips}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;

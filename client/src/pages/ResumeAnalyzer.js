import React, { useState } from 'react';
import { Card, Form, Input, Button, Upload, Progress, List, Tag, message, Space, Typography } from 'antd';
import { UploadOutlined, FileTextOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { analyzeResume, uploadResume } from '../store/slices/resumeSlice';

const { TextArea } = Input;
const { Title, Text } = Typography;

function ResumeAnalyzer() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { analysis, loading } = useSelector((state) => state.resume);
  const [resumeContent, setResumeContent] = useState('');

  const handleAnalyze = async () => {
    const values = form.getFieldsValue();
    const content = values.resumeContent || resumeContent;

    if (!content) {
      message.warning('请输入简历内容或上传简历文件');
      return;
    }

    const result = await dispatch(analyzeResume({
      resumeContent: content,
      targetPosition: values.targetPosition || '通用职位'
    }));

    if (analyzeResume.rejected.match(result)) {
      message.error('分析失败，请重试');
    } else {
      message.success('简历分析完成');
    }
  };

  const handleFileUpload = async (file) => {
    const result = await dispatch(uploadResume(file));
    if (uploadResume.fulfilled.match(result)) {
      message.success('简历上传成功');
    }
    return false;
  };

  return (
    <div>
      <Title level={4}>简历智能分析</Title>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="上传简历">
          <Upload
            accept=".pdf,.doc,.docx"
            beforeUpload={handleFileUpload}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>上传简历文件 (PDF/Word)</Button>
          </Upload>
        </Card>

        <Card title="简历内容">
          <Form form={form} layout="vertical">
            <Form.Item name="resumeContent" label="简历内容">
              <TextArea
                rows={10}
                placeholder="请粘贴简历内容，或上传简历文件后自动解析"
                value={resumeContent}
                onChange={(e) => setResumeContent(e.target.value)}
              />
            </Form.Item>
            <Form.Item name="targetPosition" label="目标职位（可选）">
              <Input placeholder="例如：前端开发工程师" />
            </Form.Item>
            <Button type="primary" onClick={handleAnalyze} loading={loading}>
              开始分析
            </Button>
          </Form>
        </Card>

        {analysis && (
          <Card title="分析结果">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Space size="large">
                <Card size="small" style={{ width: 150, textAlign: 'center', background: '#e6f7ff' }}>
                  <Text type="secondary">完整度</Text>
                  <Progress percent={analysis.completeness} size="small" />
                </Card>
                <Card size="small" style={{ width: 150, textAlign: 'center', background: '#f6ffed' }}>
                  <Text type="secondary">匹配度</Text>
                  <Progress percent={analysis.matchScore} size="small" />
                </Card>
              </Space>

              <Card size="small" title="优势" style={{ background: '#f6ffed' }}>
                <List
                  size="small"
                  dataSource={analysis.strengths || []}
                  renderItem={(item) => (
                    <List.Item>
                      <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                      {item}
                    </List.Item>
                  )}
                />
              </Card>

              <Card size="small" title="需要改进" style={{ background: '#fff2f0' }}>
                <List
                  size="small"
                  dataSource={analysis.weaknesses || []}
                  renderItem={(item) => (
                    <List.Item>
                      <CloseCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
                      {item}
                    </List.Item>
                  )}
                />
              </Card>

              <Card size="small" title="优化建议">
                <List
                  size="small"
                  dataSource={analysis.suggestions || []}
                  renderItem={(item, index) => (
                    <List.Item>
                      <Tag color="blue">{index + 1}</Tag>
                      {item}
                    </List.Item>
                  )}
                />
              </Card>
            </Space>
          </Card>
        )}
      </Space>
    </div>
  );
}

export default ResumeAnalyzer;

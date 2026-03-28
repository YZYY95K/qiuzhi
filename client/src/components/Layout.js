import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Space } from 'antd';
import { UserOutlined, FileTextOutlined, TeamOutlined, SearchOutlined, RobotOutlined, LogoutOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const { Header, Content, Sider } = Layout;

function LayoutComponent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const menuItems = [
    { key: '/', icon: <UserOutlined />, label: '首页' },
    { key: '/resume-analyzer', icon: <FileTextOutlined />, label: '简历分析' },
    { key: '/interview', icon: <TeamOutlined />, label: '模拟面试' },
    { key: '/job-matcher', icon: <SearchOutlined />, label: '职位匹配' },
    { key: '/assistant', icon: <RobotOutlined />, label: '求职助手' },
  ];

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  const handleMenuClick = (e) => {
    navigate(e.key);
  };

  const handleUserMenuClick = ({ key }) => {
    if (key === 'logout') {
      dispatch(logout());
      navigate('/login');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#001529', padding: '0 24px' }}>
        <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>智求职</div>
        <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <Avatar icon={<UserOutlined />} />
          </Space>
        </Dropdown>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['/']}
            defaultOpenKeys={['/']}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
            onClick={handleMenuClick}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280, borderRadius: 8 }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default LayoutComponent;

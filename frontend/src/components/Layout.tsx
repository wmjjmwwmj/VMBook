import React from 'react';
import { Breadcrumb, Layout, theme } from 'antd';
import MenuButton from './MenuButton/MenuButton';
import { AndroidFilled } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

interface MyLayoutProps {
  children: React.ReactNode;
}

const MyLayout: React.FC<MyLayoutProps> = ({ children }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // TODO: Manage breadcrumb items dynamically with React Context
  // const breadCrumbItems = [
  //   {
  //     title: 'Home',
  //     href: '/',
  //   },
  //   {
  //     title: 'Profile',
  //   },
  // ]

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <a href="/" style={{ color: 'white', fontSize: 24 }}>
          <AndroidFilled /> VMBook
        </a>
      </Header>
      <Content style={{ padding: '0 24px' }}>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
      <MenuButton />
    </Layout>
  );
};

export default MyLayout;
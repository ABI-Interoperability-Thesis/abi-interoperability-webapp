import { Link, Routes, Route, useLocation } from 'react-router-dom'
import { Button, Layout, Menu, theme } from 'antd';
import { useState } from 'react';
import Dashboard from './Components/Dashboard/index';
import Requests from './Components/Requests/index';
import Channels from './Components/Channels/index';
import Models from './Components/Models/index';
import ModelDetails from './Components/ModelDetails/index';
import Clients from './Components/Clients/index';
import ClientDetails from './Components/ClientDetails/index';
import AttributeMappings from './Components/AttributeMappings/index';
import About from './Components/About/index';

import { MenuFoldOutlined, MenuUnfoldOutlined, DashboardOutlined, MailOutlined, DeploymentUnitOutlined, BranchesOutlined, TeamOutlined, MonitorOutlined, QuestionOutlined } from '@ant-design/icons'
import SVGS from './svgs.js'
import './index.css'

const { Header, Sider, Content } = Layout;
const App = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className='logo-container'>
          <SVGS type='logo' />
          <div style={{ color: '#ffffff' }}>ABI Interoperability</div>
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={location.pathname}>
          <Menu.Item key={'/'} icon={<DashboardOutlined />}>
            <Link to={'/'}>Dashboard</Link>
          </Menu.Item>
          <Menu.Item key={'/requests'} icon={<MailOutlined />}>
            <Link to={'/requests'}>Requests</Link>
          </Menu.Item>
          <Menu.Item key={'/channels'} icon={<DeploymentUnitOutlined />}>
            <Link to={'/channels'}>Channels</Link>
          </Menu.Item>
          <Menu.Item key={'/models'} icon={<BranchesOutlined />}>
            <Link to={'/models'}>Models</Link>
          </Menu.Item>
          <Menu.Item key={'/clients'} icon={<TeamOutlined />}>
            <Link to={'/clients'}>Clients</Link>
          </Menu.Item>
          <Menu.Item key={'/attribute-mappings'} icon={<MonitorOutlined />}>
            <Link to={'/attribute-mappings'}>Attribute Mappings</Link>
          </Menu.Item>
          <Menu.Item key={'/about'} icon={<QuestionOutlined />}>
            <Link to={'/about'}>About</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <Button type='primary' style={{ backgroundColor: 'red', marginRight: '1rem' }}>
            Log Out
          </Button>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            overflowY: 'scroll'
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/channels" element={<Channels />} />
            <Route path="/models" element={<Models />} />
            <Route path="/models/:model_id" element={<ModelDetails />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:client_id" element={<ClientDetails />} />
            <Route path="/attribute-mappings" element={<AttributeMappings />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};
export default App;
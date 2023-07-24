import { Link, Routes, Route, useLocation } from 'react-router-dom'
import { Button, Layout, Menu, theme, Typography } from 'antd';
import { useState, useEffect } from 'react';
import Dashboard from './Components/Dashboard/index';
import Requests from './Components/Requests/index';
import RequestDetails from './Components/RequestDetails/index';
import Channels from './Components/Channels/index';
import Models from './Components/Models/index';
import ModelDetails from './Components/ModelDetails/index';
import Clients from './Components/Clients/index';
import ClientDetails from './Components/ClientDetails/index';
import AttributeMappings from './Components/AttributeMappings/index';
import AttributeMappingDetails from './Components/AttributeMappings/AttributeMappingDetails/index';
import About from './Components/About/index';
import Validations from './Components/Validations/index'
import Preprocessors from './Components/Preprocessors/index'
import Login from './Components/Login/index'
import Issues from './Components/Issues/index'
import IssueDetailsAdmin from './Components/IssueDetails/index'


import ClientAccountSettings from './ClientComponents/AccountSettings'
import ClientIssues from './ClientComponents/ClientIssues'
import IssueDetails from './ClientComponents/ClientIssues/IssueDetails'
import ClientRequests from './ClientComponents/Requests'
import ClientModels from './ClientComponents/Models'
import ClientDashboard from './ClientComponents/Dashboard'
import ClientModelDetails from './ClientComponents/ModelDetails/index';

import endpoints from './Components/config/endpoints.json'
import axios from 'axios'
import { LoadingOutlined, MenuFoldOutlined, MenuUnfoldOutlined, DashboardOutlined, MailOutlined, DeploymentUnitOutlined, BranchesOutlined, TeamOutlined, MonitorOutlined, QuestionOutlined, ReadOutlined, CheckCircleOutlined, CalculatorOutlined } from '@ant-design/icons'
import SVGS from './svgs.js'
import './index.css'

const { Title } = Typography
const { Header, Sider, Content } = Layout;
const app_env = process.env.REACT_APP_ENV
const mysql_endpoint = endpoints['mysql-ws'][app_env]

const App = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentAcc, setCurrentAcc] = useState();
  const [userType, setUserType] = useState('client');

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const VerifyIfLoggedIn = async () => {
    const url = `${mysql_endpoint}/auth/is-logged-in`
    const method = 'get'
    const headers = {
      'session-token': localStorage.getItem('session-token')
    }

    const config = { method, url, headers }

    const axios_response = await axios(config)
    const res_data = axios_response.data
    console.log(res_data)

    if (res_data.status === 200) {
      console.log(res_data.account_data)
      setCurrentAcc(res_data.account_data)
      setLoggedIn(true)
      setLoading(false)
    } else {
      setLoggedIn(false)
      setLoading(false)
    }
  }

  const LogoutUser = () => {
    setLoggedIn(false)
    localStorage.removeItem('session-token')
  }

  useEffect(() => {
    VerifyIfLoggedIn()
  }, [])


  return (
    <>
      {
        loggedIn ?
          (
            <>
              {
                currentAcc.role === 'client' ?
                  (
                    <Layout style={{ height: "100vh" }}>
                      <Sider trigger={null} collapsible collapsed={collapsed}>
                        <div style={{ justifyContent: 'center' }} className='logo-container'>
                          <SVGS type='logo' />
                          {!collapsed && <div style={{ color: '#ffffff' }}>ABI Interoperability</div>}
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

                          <Menu.Item key={'/models'} icon={<BranchesOutlined />}>
                            <Link to={'/models'}>Models</Link>
                          </Menu.Item>

                          <Menu.Item key={'/hl7-docs'} icon={<ReadOutlined />}>
                            <a href="https://hl7-definition.caristix.com/v2/HL7v2.5.1" target="_blank" rel="noopener noreferrer">
                              HL7 Docs
                            </a>
                          </Menu.Item>
                          <Menu.Item key={'/about'} icon={<QuestionOutlined />}>
                            <Link to={'/about'}>About</Link>
                          </Menu.Item>

                          <Menu.Item key={'/issues'} icon={<QuestionOutlined />}>
                            <Link to={'/issues'}>Issues</Link>
                          </Menu.Item>

                          <Menu.Item key={'/account-settings'} icon={<QuestionOutlined />}>
                            <Link to={'/account-settings'}>Account Settings</Link>
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
                          <div style={{ display: 'flex', gap: '2rem' }}>
                            <Title style={{ margin: 0 }} level={4}>{currentAcc.name}</Title>
                            <Button type='primary' style={{ backgroundColor: 'red', marginRight: '1rem' }} onClick={LogoutUser}>
                              Log Out
                            </Button>
                          </div>
                        </Header>
                        <Content
                          style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                            background: colorBgContainer,
                            overflowY: 'scroll',
                          }}
                        >
                          <Routes>
                            <Route path="/" element={<ClientDashboard />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/account-settings" element={<ClientAccountSettings />} />
                            <Route path="/issues" element={<ClientIssues />} />
                            <Route path="/issues/:issue_id" element={<IssueDetails currentAcc={currentAcc} />} />
                            <Route path="/requests" element={<ClientRequests />} />
                            <Route path="/requests/:req_id" element={<RequestDetails />} />
                            <Route path="/models" element={<ClientModels />} />
                            <Route path="/models/:model_id" element={<ClientModelDetails />} />
                            <Route path="/attribute-mappings/:model_name/:model_attribute" element={<AttributeMappingDetails />} />
                            
                          </Routes>
                        </Content>
                      </Layout>
                    </Layout>
                  )
                  :
                  (
                    <Layout style={{ height: "100vh" }}>
                      <Sider trigger={null} collapsible collapsed={collapsed}>
                        <div style={{ justifyContent: 'center' }} className='logo-container'>
                          <SVGS type='logo' />
                          {!collapsed && <div style={{ color: '#ffffff' }}>ABI Interoperability</div>}
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
                          <Menu.Item key={'/validations'} icon={<CheckCircleOutlined />}>
                            <Link to={'/validators'}>Validators</Link>
                          </Menu.Item>
                          <Menu.Item key={'/preprocessors'} icon={<CalculatorOutlined />}>
                            <Link to={'/preprocessors'}>Preprocessors</Link>
                          </Menu.Item>
                          <Menu.Item key={'/issues'} icon={<QuestionOutlined />}>
                            <Link to={'/issues'}>Issues</Link>
                          </Menu.Item>
                          <Menu.Item key={'/hl7-docs'} icon={<ReadOutlined />}>
                            <a href="https://hl7-definition.caristix.com/v2/HL7v2.5.1" target="_blank" rel="noopener noreferrer">
                              HL7 Docs
                            </a>
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
                          <div style={{ display: 'flex', gap: '2rem' }}>
                            <Title style={{ margin: 0 }} level={4}>{currentAcc.username}</Title>
                            <Button type='primary' style={{ backgroundColor: 'red', marginRight: '1rem' }} onClick={LogoutUser}>
                              Log Out
                            </Button>
                          </div>
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
                            <Route path="/requests/:req_id" element={<RequestDetails />} />
                            <Route path="/channels" element={<Channels />} />
                            <Route path="/models" element={<Models />} />
                            <Route path="/models/:model_id" element={<ModelDetails />} />
                            <Route path="/clients" element={<Clients />} />
                            <Route path="/clients/:client_id" element={<ClientDetails />} />
                            <Route path="/attribute-mappings" element={<AttributeMappings />} />
                            <Route path="/attribute-mappings/:model_name/:model_attribute" element={<AttributeMappingDetails />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/validators" element={<Validations />} />
                            <Route path="/preprocessors" element={<Preprocessors />} />
                            <Route path='/issues' element={<Issues />} />
                            <Route path="/issues/:issue_id" element={<IssueDetailsAdmin currentAcc={currentAcc} />} />
                          </Routes>
                        </Content>
                      </Layout>
                    </Layout>
                  )
              }
            </>
          )
          :
          (
            <>
              {
                loading ?
                  (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                      <LoadingOutlined
                        style={{
                          fontSize: 40,
                        }}
                        spin
                      />
                    </div>
                  ) :
                  (
                    <Login setLoggedIn={setLoggedIn} VerifyIfLoggedIn={VerifyIfLoggedIn} />
                  )
              }
            </>
          )
      }
    </>
  );
};
export default App;
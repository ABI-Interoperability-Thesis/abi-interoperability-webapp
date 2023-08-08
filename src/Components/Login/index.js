import React, { useState, useEffect } from 'react'
import axios from 'axios'
import endpoints from '../config/endpoints.json'
import { Form, Input, Button, Card, Typography, notification } from 'antd'
import SVGS from '../../svgs'

const { Title } = Typography

const app_env = process.env.REACT_APP_ENV
const mysql_endpoint = process.env.REACT_APP_MYSQL_SERVICE_ENDPOINT

const Login = (props) => {
  const setLoggedIn = props.setLoggedIn
  const VerifyIfLoggedIn = props.VerifyIfLoggedIn

  const [clientLogin, setClientLogin] = useState(false)
  const [api, contextHolder] = notification.useNotification();


  const onFinish = async (values) => {
    const url = `${mysql_endpoint}/auth/login`
    const data = values
    const method = 'post'

    const config = { method, url, data }

    const axios_response = await axios(config)
    if (axios_response.data.status !== 500) {
      const token = axios_response.data.token
      localStorage.setItem('session-token', token);
      VerifyIfLoggedIn()
    } else {
      api.error({
        message: `Could not Login`,
        description: 'Could not Login because of incorrect credentials'
      });
    }

  }

  const LoginClient = async (values) => {
    console.log(values)
    const url = `${mysql_endpoint}/auth/client-login`
    const data = values
    const method = 'post'

    const config = { method, url, data }

    const axios_response = await axios(config)
    if (axios_response.data.status !== 500) {
      const token = axios_response.data.token
      localStorage.setItem('session-token', token);
      VerifyIfLoggedIn()
    } else {
      api.error({
        message: `Could not Login`,
        description: 'Could not Login because of incorrect credentials'
      });
    }

  }


  const onFinishFailed = (values) => {
    console.log(values)
  }
  return (
    <>
    {contextHolder}
      <div>
        {
          clientLogin ?
            (
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <SVGS type='logo-login' />
                  <Title style={{ margin: 0 }} level={1}>ABI Interoperability</Title>
                </div>
                <Title style={{ margin: 0 }} level={4}>Client Area</Title>
                <Card style={{ minWidth: '30rem', marginTop: '1rem' }}>
                  <Form
                    name="basic"
                    onFinish={LoginClient}
                    onFinishFailed={onFinishFailed}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <Form.Item
                        name="email"
                        rules={[
                          {
                            required: true,
                            message: 'Please provide a email!',
                          },
                        ]}
                      >
                        <Input placeholder='Email' />
                      </Form.Item>

                      <Form.Item
                        name="password"
                        rules={[
                          {
                            required: true,
                            message: 'Please provide a password!',
                          },
                        ]}
                      >
                        <Input.Password placeholder='Password' />
                      </Form.Item>

                      <Button style={{ width: '100%', backgroundColor: '#001529' }} type="primary" htmlType="submit">Login</Button>
                      <Button disabled={clientLogin} onClick={() => setClientLogin(true)}>Login As Client</Button>
                      <Button disabled={!clientLogin} onClick={() => setClientLogin(false)}>Login As Platform Engineer</Button>
                    </div>
                  </Form>
                </Card>
              </div>
            )
            :
            (
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <SVGS type='logo-login' />
                  <Title style={{ margin: 0 }} level={1}>ABI Interoperability</Title>
                </div>
                <Title style={{ margin: 0 }} level={4}>Platform Engineering</Title>
                <Card style={{ minWidth: '30rem', marginTop: '1rem' }}>
                  <Form
                    name="basic"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <Form.Item
                        name="username"
                        rules={[
                          {
                            required: true,
                            message: 'Please provide a username!',
                          },
                        ]}
                      >
                        <Input placeholder='Username' />
                      </Form.Item>

                      <Form.Item
                        name="password"
                        rules={[
                          {
                            required: true,
                            message: 'Please provide a password!',
                          },
                        ]}
                      >
                        <Input.Password placeholder='Password' />
                      </Form.Item>

                      <Button style={{ width: '100%', backgroundColor: '#001529' }} type="primary" htmlType="submit">Login</Button>
                      <Button disabled={clientLogin} onClick={() => setClientLogin(true)}>Login As Client</Button>
                      <Button disabled={!clientLogin} onClick={() => setClientLogin(false)}>Login As Platform Engineer</Button>
                    </div>
                  </Form>
                </Card>
              </div>
            )
        }
      </div>
    </>

  )
}

export default Login
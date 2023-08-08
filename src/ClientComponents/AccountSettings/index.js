import React, { useState, useEffect } from 'react';
import endpoints from '../../Components/config/endpoints.json'
import { Table, Button, Popconfirm, Typography, Input, Card, Tabs, Descriptions, Divider, Form, notification } from 'antd'
import axios from 'axios'
const { Paragraph, Title } = Typography;

const app_env = process.env.REACT_APP_ENV
const mysql_endpoint = process.env.REACT_APP_MYSQL_SERVICE_ENDPOINT


const AccountSettings = () => {
    const [clientToken, setClientToken] = useState();
    const [testingToken, setTestingToken] = useState()
    const [userData, setUserData] = useState()
    const [api, contextHolder] = notification.useNotification();

    const GetUserInfo = async () => {
        const url = `${mysql_endpoint}/auth/user-info`
        const method = 'get'
        const headers = {
            'session-token': localStorage.getItem('session-token')
        }
        const config = { method, url, headers }
        const response = await axios(config)
        setUserData(response.data)
    }

    const GenerateToken = async () => {
        const url = `${mysql_endpoint}/auth/generate-token`
        const method = 'get'
        const headers = {
            'session-token': localStorage.getItem('session-token')
        }
        const config = { method, url, headers }
        const response = await axios(config)
        setClientToken(response.data)
    }

    const CheckIfTokenIsValid = async () => {
        console.log(testingToken)
        const url = `${mysql_endpoint}/auth/is-logged-in`
        const method = 'get'
        const headers = {
            'session-token': testingToken
        }

        const config = { method, url, headers }

        const axios_response = await axios(config)
        const res_data = axios_response.data
        console.log(res_data)

        if (res_data.status === 200) {
            alert('Token Valid')
        } else {
            alert('Token Not Valid')
        }
    }

    useEffect(() => {
        GetUserInfo()
    }, [])

    const ChangePassword = async (values) => {
        const url = `${mysql_endpoint}/auth/change-password`
        const method = 'put'
        const headers = {
            'Content-Type': 'application/json',
            'session-token': localStorage.getItem('session-token')
        }
        const config = { method, url, headers, data: values }
        const response = await axios(config)

        if (response.data.status !== 200) {
            api.error({
                message: `There was an error changing your password`,
                description: 'Original Password is incorrect'
            });
        } else {
            api.success({
                message: `Success`,
                description: 'Password Changed Successfully'
            });
        }
    }

    return (
        <>
            {contextHolder}
            <Tabs items={[
                {
                    key: '1',
                    label: 'User Data',
                    children: (
                        <>
                            {
                                userData &&
                                <>
                                    <Descriptions bordered column={1} title='User Data'>
                                        <Descriptions.Item label='Name'>{userData.name}</Descriptions.Item>
                                        <Descriptions.Item label='Email'>{userData.email}</Descriptions.Item>
                                        <Descriptions.Item label='Phone'>{userData.phone}</Descriptions.Item>
                                    </Descriptions>
                                    <Divider>Password Settings</Divider>
                                    <Form onFinish={ChangePassword}>
                                        <Form.Item name='password' label='Old Password'>
                                            <Input placeholder='Old Password' />
                                        </Form.Item>
                                        <Form.Item name='new_password' label='New Password'>
                                            <Input placeholder='New Password' />
                                        </Form.Item>
                                        <Button type='primary' htmlType='submit'>Change Password</Button>
                                    </Form>
                                </>
                            }
                        </>
                    )
                },
                {
                    key: '2',
                    label: 'Token Actions',
                    children: (
                        <>
                            <Title level={2}>Account Settings</Title>
                            <Card title={<Title level={3}>Token Generation</Title>}>
                                <p>Generate a unique to use the ABI Interoperability web API and integrate our services in your processes.</p>
                                <Button type='primary' onClick={GenerateToken}>Generate Token</Button>
                                {
                                    clientToken &&
                                    <>
                                        <Paragraph>
                                            <pre><Paragraph copyable>{clientToken.token}</Paragraph></pre>
                                        </Paragraph>
                                        <p>Please copy and store this token as it won't be available to access again!</p>
                                    </>
                                }
                            </Card>

                            <Card style={{ marginTop: '1.5rem' }} title={<Title level={3}>Token Validation</Title>}>
                                <div>
                                    <p>Validate your existing tokens for API usage.</p>
                                    <Input placeholder='Token' onChange={(event) => setTestingToken(event.target.value)} />
                                    <Button style={{ marginTop: '1rem' }} type='primary' onClick={CheckIfTokenIsValid}>Validate Token</Button>
                                </div>
                            </Card>
                        </>
                    )
                }
            ]} />
        </>
    )
}

export default AccountSettings
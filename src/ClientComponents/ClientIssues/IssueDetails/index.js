import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import axios from 'axios'
import endpoints from '../../../Components/config/endpoints.json'
import { Typography, Card, Tag, Button, Input, Form } from 'antd';

const { Title, Paragraph } = Typography

const app_env = process.env.REACT_APP_ENV
const mysql_endpoint = process.env.REACT_APP_MYSQL_SERVICE_ENDPOINT


const IssueDetails = (props) => {
    const currentAcc = props.currentAcc
    const { issue_id } = useParams();

    const [issueMeta, setIssueMeta] = useState()
    const [issueMsgs, setIssueMsgs] = useState()

    const GetIssueData = async () => {
        const url = `${mysql_endpoint}/auth/issues/${issue_id}`
        const method = 'get'
        const headers = {
            'session-token': localStorage.getItem('session-token')
        }
        const config = { method, url, headers }
        const response = await axios(config)

        response.data.issue_messages.sort((a, b) => a.created - b.created)
        setIssueMeta(response.data.issue_metadata)
        setIssueMsgs(response.data.issue_messages)
    }

    const UpdateIssueState = async (new_state) => {
        const url = `${mysql_endpoint}/auth/issues/state/${issue_id}`
        const method = 'put'
        const headers = {
            'session-token': localStorage.getItem('session-token')
        }
        const data = {
            new_state
        }
        const config = { method, url, headers, data }
        const response = await axios(config)
        GetIssueData()
    }

    const SendMessage = async (values) => {
        console.log(values)

        const data = {
            ...values,
            issue_id,
            sent_by_id: currentAcc.client_id,
            sent_by_name: currentAcc.name
        }

        const url = `${mysql_endpoint}/auth/issue-messages`
        const method = 'post'
        const headers = {
            'session-token': localStorage.getItem('session-token')
        }
        const config = { method, url, headers, data }
        await axios(config)
        GetIssueData()

    }

    useEffect(() => {
        GetIssueData()
    }, [])

    return (
        <div style={{ height: '100%' }}>
            {
                issueMeta && issueMsgs &&
                <div style={{ height: '100%' }}>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                        <Title style={{ margin: 0 }} level={3}>Issue Title</Title>
                        <Title style={{ margin: 0 }} level={3}>{issueMeta.issue_title}</Title>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <Title style={{ margin: 0 }} level={4}>Issue Type </Title>
                            <Paragraph style={{ margin: 0 }}>
                                <pre>{issueMeta.issue_type}</pre>
                            </Paragraph>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <Title style={{ margin: 0 }} level={4}>Issue State </Title>
                            {
                                issueMeta.answered === true ?
                                    (
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <Tag color='green'>Closed</Tag>
                                            <Button onClick={() => UpdateIssueState(false)} type='primary'>Reopen Issue</Button>
                                        </div>
                                    ) :
                                    (
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <Tag color='blue'>Open</Tag>
                                            <Button type='primary' onClick={() => UpdateIssueState(true)}>Close Issue</Button>
                                        </div>
                                    )
                            }

                        </div>
                    </div>

                    <div style={{ height: 'calc(100% - 10.5rem)', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'scroll' }}>
                        {
                            issueMsgs.map((msg) => (
                                <div style={{ width: '100%', display: 'flex', justifyContent: msg.sent_by_id === currentAcc.client_id ? 'flex-end' : 'flex-start' }}>
                                    <Card style={{ width: '50%' }} title={msg.sent_by_id === currentAcc.client_id ? 'You' : msg.sent_by_name}>
                                        <Paragraph>
                                            <pre>{msg.message}</pre>
                                        </Paragraph>
                                    </Card>
                                </div>
                            ))
                        }
                    </div>

                    <Form onFinish={SendMessage} style={{ width: '100%' }}>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'space-between' }}>

                            <Form.Item name='message' style={{ width: '100%' }}>
                                <Input style={{ width: '100%' }} placeholder='Start Typing a message' />
                            </Form.Item>
                            <Button type='primary' htmlType='submit'>Send</Button>

                        </div>
                    </Form>
                </div>
            }


        </div >
    )
}

export default IssueDetails
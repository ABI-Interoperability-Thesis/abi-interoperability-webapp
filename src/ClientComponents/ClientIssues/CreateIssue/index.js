import React from 'react'
import { Button, Typography, Form, Input, Select } from 'antd'
import axios from 'axios'
const { Title } = Typography
const { TextArea } = Input;

const CreateIssue = (props) => {
    const mysql_endpoint = props.endpoint
    const setCreate = props.setCreate
    const GetIssues = props.GetIssues

    const CreateIssue = async (values) => {
        const url = `${mysql_endpoint}/auth/create-issue`

        const method = 'post'
        const headers = {
            'session-token': localStorage.getItem('session-token')
        }
        const config = { method, url, headers, data: values }
        const response = await axios(config)
        await GetIssues()
        setCreate(false)
    }

    const issue_type_options = [
        {
            label: 'Model Permissions',
            value: 'Model Permissions'
        },
        {
            label: 'Bug Reporting',
            value: 'Bug Reporting'
        },
        {
            label: 'Custom Mappings',
            value: 'Custom Mappings'
        },
        {
            label: 'Other',
            value: 'Other'
        },
    ]

    return (
        <>
            <Title level={2}>Create New Issue</Title>
            <Form onFinish={CreateIssue}>

                <Form.Item name='issue_title'
                    rules={[
                        {
                            required: true,
                            message: 'Please provide the Issue Title',
                        },
                    ]}>
                    <Input placeholder='Issue Title' />
                </Form.Item>

                <Form.Item name='issue_type'
                    rules={[
                        {
                            required: true,
                            message: 'Please select the Issue Type',
                        },
                    ]}>
                    <Select placeholder='Issue Type' options={issue_type_options} />
                </Form.Item>

                <Form.Item name='message'
                    rules={[
                        {
                            required: true,
                            message: 'Please provide the Issue Message',
                        },
                    ]}>
                    <TextArea placeholder='Message' />
                </Form.Item>

                <div style={{display: 'flex', gap: '1rem'}}>
                    <Button type='primary' style={{ backgroundColor: '#4CAF50' }} htmlType='submit'>Create Issue</Button>
                    <Button type='primary' style={{ backgroundColor: '#F44336' }} onClick={() => setCreate(false)}>Cancel</Button>
                </div>

            </Form>
        </>
    )
}

export default CreateIssue
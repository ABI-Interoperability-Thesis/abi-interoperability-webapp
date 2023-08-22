import React, { useState, useEffect } from 'react';
import endpoints from '../../Components/config/endpoints.json'
import { Table, Button, Popconfirm, Typography, Input, Card } from 'antd'
import { LockOutlined, UnlockOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import axios from 'axios'
import CreateIssue from './CreateIssue';

const { Paragraph, Title } = Typography;

const app_env = process.env.REACT_APP_ENV
const mysql_endpoint = process.env.REACT_APP_MYSQL_SERVICE_ENDPOINT

const ClientIssues = () => {
    const [issues, setIssues] = useState()
    const [create, setCreate] = useState(false)

    const GetIssues = async (req, res) => {
        const url = `${mysql_endpoint}/auth/issues`
        const method = 'get'
        const headers = {
            'session-token': localStorage.getItem('session-token')
        }
        const config = { method, url, headers }
        const response = await axios(config)
        setIssues(response.data)
    }

    const handleDelete = async (issue) => {
        const url = `${mysql_endpoint}/auth/issues/${issue.issue_id}`
        const method = 'delete'
        const headers = {
            'session-token': localStorage.getItem('session-token')
        }
        const config = { method, url, headers }
        const response = await axios(config)
        GetIssues()
    }

    useEffect(() => {
        GetIssues()
    }, [])

    const columns = [
        { title: 'Issue Title', dataIndex: 'issue_title', key: 'issue_title' },
        { title: 'Issue Type', dataIndex: 'issue_type', key: 'issue_type' },
        { title: 'State', key: 'answered', render: (obj) => (obj.answered ? <LockOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} /> : <UnlockOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />) },
        { title: 'Created', dataIndex: 'created', key: 'created', sorter: (a, b) => a.created_date - b.created_date, },
        {
            title: 'Actions',
            key: 'action',
            render: (text, record) => (
                <div className='table-actions-requests'>
                    <Popconfirm
                        title="Are you sure you want to delete this item?"
                        icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => handleDelete(record)}
                    >
                        <Button danger>
                            Delete
                        </Button>
                    </Popconfirm>
                    <Link to={`/issues/${record.issue_id}`}>
                        <Button type='primary'>Open Conversation</Button>
                    </Link>
                </div>
            ),
        }
    ]

    return (
        <>
            {
                create ?
                    (
                        <CreateIssue setCreate={setCreate} GetIssues={GetIssues} endpoint={mysql_endpoint} />
                    ) :
                    (
                        <>
                            <Title level={2}>Issues</Title >
                            {
                                issues &&
                                <Table dataSource={issues} columns={columns} />
                            }
                            <Button style={{ backgroundColor: '#4CAF50', marginTop: '1rem' }} type='primary' onClick={() => setCreate(true)}>New Issue</Button>
                        </>
                    )
            }
        </>
    )
}

export default ClientIssues
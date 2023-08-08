import React, { useState, useEffect } from 'react';
import endpoints from '../../Components/config/endpoints.json'
import { Table, Button, Popconfirm, Typography, Input, Card } from 'antd'
import { CheckCircleOutlined, QuestionCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import axios from 'axios'

const { Paragraph, Title } = Typography;

const app_env = process.env.REACT_APP_ENV
const mysql_endpoint = process.env.REACT_APP_MYSQL_SERVICE_ENDPOINT

const Requests = () => {

    const [requests, setRequests] = useState()

    const GetClientRequests = async () => {
        const url = `${mysql_endpoint}/auth/requests`
        const method = 'get'
        const headers = {
            'session-token': localStorage.getItem('session-token')
        }
        const config = { method, url, headers }
        const response = await axios(config)

        response.data.forEach(obj => {
            obj['created_date_formatted'] = GetDateFromTimeStamp(obj['created_date']);
        });

        setRequests(response.data)
    }

    const GetDateFromTimeStamp = (created_date) => {
        const date = new Date(created_date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`
        return formattedDate
    }

    useEffect(() => {
        GetClientRequests()
    }, [])

    const handleDelete = (record) => {
        console.log(`Deleting ${JSON.stringify(record)}`)
        DeleteRequest(record.request_type, record.model_data_id)

    };

    const DeleteRequest = async (request_type, request_id) => {
        const url = `${mysql_endpoint}/api/request/${request_type}/${request_id}`
        await axios.delete(url)
        GetClientRequests()
    }

    const columns = [
        { title: 'Request Type', dataIndex: 'request_type', key: 'request_type' },
        { title: 'Answered', key: 'answered', render: (obj) => (obj.answered ? <CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} /> : <QuestionCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />) },
        { title: 'Answer', dataIndex: 'answer', key: 'answer' },
        { title: 'Created', dataIndex: 'created_date_formatted', key: 'created_date_formatted', sorter: (a, b) => a.created_date - b.created_date, },
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
                    <Link to={`/requests/${record.model_data_id}`}>
                        <Button type='primary'>Inspect</Button>
                    </Link>
                </div>
            ),
        }
    ]

    return (
        <>
            <Title level={2}>Requests</Title>
            <Table dataSource={requests} columns={columns} />
        </>
    )
}

export default Requests
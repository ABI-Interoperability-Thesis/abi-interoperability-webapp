import React, { useState, useEffect } from 'react';
import { Table, Button, Popconfirm,Typography } from 'antd'
import axios from 'axios'
import { CheckCircleOutlined, QuestionCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import endpoints from '../config/endpoints.json'
import './index.css'

const { Title } = Typography;

const app_env = process.env.REACT_APP_ENV
const mysql_endpoint = endpoints['mysql-ws'][app_env]


const Requests = () => {
    const [data, setData] = useState([]);

    const GetAllRequests = async () => {
        const url = `${mysql_endpoint}/api/requests`
        const response = await axios.get(url)
        setData(response.data)
    }

    const DeleteRequest = async (request_type, request_id) => {
        const url = `${mysql_endpoint}/api/request/${request_type}/${request_id}`
        await axios.delete(url)
        GetAllRequests()
    }

    useEffect(() => {
        GetAllRequests()
    }, []);

    const columns = [
        { title: 'Request Type', dataIndex: 'request_type', key: 'request_type' },
        { title: 'Answered', key: 'answered', render: (obj) => (obj.answered ? <CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} /> : <QuestionCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />) },
        { title: 'Answer', dataIndex: 'answer', key: 'answer' },
        { title: 'Client', dataIndex: 'client_id', key: 'client_id' },
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
                    <Button type='primary'>Inspect</Button>
                </div>
            ),
        }
    ]

    const handleDelete = (record) => {
        console.log(`Deleting ${JSON.stringify(record)}`)
        DeleteRequest(record.request_type, record.model_data_id)

    };

    return (
        <>
            <Title level={2}>Client Requests</Title>
            <Table dataSource={data} columns={columns} />
        </>
    )
}

export default Requests
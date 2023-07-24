import React, { useState, useEffect } from 'react';
import endpoints from '../../Components/config/endpoints.json'
import { Table, Button, Popconfirm, Typography, Input, Card } from 'antd'
import { LockOutlined, UnlockOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import axios from 'axios'

const { Paragraph, Title } = Typography;

const app_env = process.env.REACT_APP_ENV
const mysql_endpoint = endpoints['mysql-ws'][app_env]

const Models = () => {
    const [models, setModels] = useState()

    const GetModels = async () => {
        const url = `${mysql_endpoint}/auth/models`
        const method = 'get'
        const headers = {
            'session-token': localStorage.getItem('session-token')
        }
        const config = { method, url, headers }
        const response = await axios(config)
        setModels(response.data)
    }

    useEffect(() => {
        GetModels()
    }, [])

    const columns = [
        { title: 'Model Name', dataIndex: 'model_name', key: 'model_name' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        { title: 'Attributes', dataIndex: 'attribute_count', key: 'attribute_count' },
        {
          title: 'Actions',
          key: 'action',
          render: (text, record) => (
            <div>
              <Link to={`/models/${record.model_id}`}>
                <Button type='primary'>
                  Inspect
                </Button>
              </Link>
            </div>
          ),
        }
      ]

    return (
        <>
            <Title level={2}>Models</Title>
            <Table dataSource={models} columns={columns} />
        </>
    )
}

export default Models
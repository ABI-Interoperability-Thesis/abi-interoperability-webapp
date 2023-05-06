import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import endpoints from '../config/endpoints.json'
import './index.css'
import { Table, Button, Popconfirm, Typography } from 'antd'
import axios from 'axios'
const { Title } = Typography;

const app_env = process.env.REACT_APP_ENV
const mysql_endpoint = endpoints['mysql-ws'][app_env]


const Models = () => {
  const [data, setData] = useState([]);

  const GetAllModels = async () => {
    const url = `${mysql_endpoint}/api/models`
    const response = await axios.get(url)
    setData(response.data)
  }

  useEffect(() => {
    GetAllModels()
  }, []);

  const columns = [
    { title: 'Model Name', dataIndex: 'model_name', key: 'model_name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Deployed', dataIndex: 'deployed', key: 'deployed' },
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
      <Title level={2}>Machine Learning Models</Title>
      <Table dataSource={data} columns={columns} />
    </>
  )
}

export default Models
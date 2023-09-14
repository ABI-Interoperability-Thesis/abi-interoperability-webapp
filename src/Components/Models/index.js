import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import SVG from './svg';
import './index.css'
import { Table, Button, Popconfirm, Typography, Tag } from 'antd'
import axios from 'axios'
import CreateNew from './CreateNew/index'
const { Title } = Typography;

const app_env = process.env.REACT_APP_ENV
const mysql_endpoint = process.env.REACT_APP_MYSQL_SERVICE_ENDPOINT


const Models = () => {
  const [data, setData] = useState([]);
  const [createNew, setCreateNew] = useState(false)

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
    {
      title: 'Support', key: 'support', render: (text, record) => (
        <div style={{ display: 'flex', gap: '1rem' }}>
          {
            record.hl7_support === 1 &&
            <Tag color='geekblue'>HL7</Tag>
          }

          {
            record.fhir_support === 1 &&
            <Tag color='geekblue'>FHIR</Tag>
          }

          {
            record.fhir_support === 0 && record.hl7_support === 0 &&
            <Tag color='geekblue'>No Support</Tag>
          }
        </div>
      )
    },
    { title: 'Type', key: 'model_type', render: (obj) => (obj.model_type === 'prediction' ? <SVG type='prediction' /> : <SVG type='optimization' />) },
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
      {
        createNew ?
          <CreateNew setCreateNew={setCreateNew} endpoint={mysql_endpoint} GetAllModels={GetAllModels} />
          :
          <>
            <Title level={2}>Machine Learning Models</Title>
            <Table dataSource={data} columns={columns} />
            <Button type='primary' style={{ backgroundColor: '#4CAF50', marginTop: '1rem' }} onClick={() => setCreateNew(true)}>Create New Model</Button>
          </>
      }
    </>
  )
}

export default Models
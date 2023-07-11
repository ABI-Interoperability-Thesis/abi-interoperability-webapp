import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Typography, Table, Button } from 'antd';
import endpoints from '../../config/endpoints.json'
import axios from 'axios'
import {Link} from 'react-router-dom'

const app_env = process.env.REACT_APP_ENV
const mysql_endpoint = endpoints['mysql-ws'][app_env]
const { Title } = Typography

const AttributeMappingDetails = () => {
  const { model_name, model_attribute } = useParams();
  const [data, setData] = useState([])

  useEffect(() => {
    getAttributeData()
  }, [])

  const getAttributeData = async () => {
    const url = `${mysql_endpoint}/api/attribute-mappings/${model_name}/${model_attribute}`
    const method = 'get'
    const config = { method, url }
    const axios_response = await axios(config)
    console.log(axios_response.data)
    setData(axios_response.data)
  }

  const DeleteAttributeMapping = async (mapping_id) => {
    const url = `${mysql_endpoint}/api/attribute-mappings/${mapping_id}`
    const method = 'delete'
    const config = { method, url }
    await axios(config)
    getAttributeData()
  }

  const columns = [
    { title: 'Model Name', dataIndex: 'model_name', key: 'model_name' },
    { title: 'Attribute Name', dataIndex: 'attribute', key: 'attribute' },
    { title: 'Value', dataIndex: 'value', key: 'value' },
    { title: 'Mapping', dataIndex: 'mapping', key: 'mapping' },
    {
      title: 'Actions',
      key: 'action',
      render: (text, record) => (
        <div>
          <Button danger onClick={() => DeleteAttributeMapping(record.mapping_id)}>
            Delete
          </Button>
        </div>
      ),
    }
  ]

  return (
    <div>
      <Title level={2}>{model_attribute}</Title>
      <Title level={3}>Model: {model_name}</Title>
      <Table dataSource={data} columns={columns} />
      <Link to={`/attribute-mappings`}>
        <Button style={{ backgroundColor: '#F44336' }} type='primary'>Back to Mappings</Button>
      </Link>
    </div>
  )
}

export default AttributeMappingDetails
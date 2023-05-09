import React, { useState, useEffect } from 'react'
import { Typography, Table, Button } from 'antd'
import endpoints from '../config/endpoints.json'
import axios from 'axios'
import CreateNew from './CreateNew/index'

const app_env = process.env.REACT_APP_ENV
const mysql_endpoint = endpoints['mysql-ws'][app_env]

const { Title } = Typography
const AttributeMappings = () => {
  const [data, setData] = useState([])
  const [createNew, setCreateNew] = useState(false)

  const GetAllAttributeMappings = async () => {
    const url = `${mysql_endpoint}/api/attribute-mappings`
    const method = 'get'
    const config = { method, url }
    const axios_response = await axios(config)
    setData(axios_response.data)
  }

  useEffect(() => {
    GetAllAttributeMappings()
  }, [])

  const columns = [
    { title: 'Model Name', dataIndex: 'model_name', key: 'model_name' },
    { title: 'Attribute Name', dataIndex: 'attribute', key: 'attribute' },
    { title: 'Value', dataIndex: 'value', key: 'value' },
    { title: 'Mapping', dataIndex: 'mapping', key: 'mapping' }
  ]

  return (
    <div>
      {
        createNew ? (
          <CreateNew setCreateNew={setCreateNew} mysql_endpoint={mysql_endpoint} GetAllAttributeMappings={GetAllAttributeMappings}/>
        ) : (
          <div>
            <Title level={2}>Attribute Mappings</Title >
            <Table dataSource={data} columns={columns} />
            <Button type='primary' style={{ backgroundColor: '#4CAF50' }} onClick={() => setCreateNew(true)}>New Mapping</Button>
          </div>
        )
      }
    </div>
  )
}

export default AttributeMappings
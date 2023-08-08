import React, { useState, useEffect } from 'react'
import { Typography, Table, Button, Select } from 'antd'
import endpoints from '../config/endpoints.json'
import axios from 'axios'
import CreateNew from './CreateNew/index'
import {Link} from 'react-router-dom'

const app_env = process.env.REACT_APP_ENV
const mysql_endpoint = process.env.REACT_APP_MYSQL_SERVICE_ENDPOINT

const { Title } = Typography
const AttributeMappings = () => {
  const [data, setData] = useState([])
  const [createNew, setCreateNew] = useState(false)
  const [models, setModels] = useState([])
  const [selectedModel, setSelectedModel] = useState('')
  const [modelAttributes, setModelAttributes] = useState()


  const GetAllModelMappings = async (model_name) => {
    setSelectedModel(model_name)
    const url = `${mysql_endpoint}/api/attribute-mappings/${model_name}`
    const response = await axios.get(url)
    console.log(response.data)
    setModelAttributes(response.data)
  }
  const GetAllModels = async () => {
    const url = `${mysql_endpoint}/api/models`
    const response = await axios.get(url)

    const processedData = response.data.map((model) => {
      return {
        label: model.model_name,
        value: model.model_name,
      }
    })
    setModels(processedData)
  }



  const GetAllAttributeMappings = async () => {
    const url = `${mysql_endpoint}/api/attribute-mappings`
    const method = 'get'
    const config = { method, url }
    const axios_response = await axios(config)
    setData(axios_response.data)
  }

  const DeleteAttributeMapping = async (mapping_id) => {
    const url = `${mysql_endpoint}/api/attribute-mappings/${mapping_id}`
    const method = 'delete'
    const config = { method, url }
    const axios_response = await axios(config)
    GetAllAttributeMappings()
  }

  useEffect(() => {
    GetAllAttributeMappings()
    GetAllModels()
  }, [])

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

  const columns_attributes = [
    { title: 'Attribute Name', dataIndex: 'attribute', key: 'attribute' },
    { title: 'Mappings', dataIndex: 'count', key: 'count' },
    {
      title: 'Actions',
      key: 'action',
      render: (text, record) => (
        <div>
          <Link to={`/attribute-mappings/${selectedModel}/${record.attribute}`}>
            <Button type='primary'>
              Inspect
            </Button>
          </Link>
        </div>
      ),
    }
  ]

  return (
    <div>
      {
        createNew ? (
          <CreateNew setCreateNew={setCreateNew} mysql_endpoint={mysql_endpoint} GetAllAttributeMappings={GetAllAttributeMappings} />
        ) : (
          <div>
            <Title level={2}>Attribute Mappings</Title >
            <Select placeholder='model' options={models} style={{ width: '100%' }} onChange={(value) => GetAllModelMappings(value)} />
            {
              modelAttributes &&
              <Table dataSource={modelAttributes} columns={columns_attributes} />
            }
            <Button type='primary' style={{ backgroundColor: '#4CAF50' }} onClick={() => setCreateNew(true)}>New Mapping</Button>
          </div>
        )
      }
    </div>
  )
}

export default AttributeMappings
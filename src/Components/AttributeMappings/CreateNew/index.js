import React, { useEffect, useState } from 'react'
import { Button, Typography, Select, Form, Space, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import axios from 'axios'

const { Title, TextArea } = Typography

const CreateNew = (props) => {
  const setCreateNew = props.setCreateNew
  const mysql_endpoint = props.mysql_endpoint
  const GetAllAttributeMappings = props.GetAllAttributeMappings
  const [modelsDataOptions, setModelsDataOptions] = useState([])
  const [modelAttributesOptions, setModelAttributesOptions] = useState([])
  const [modelID, setModelID] = useState('')
  const [modelName, setModelName] = useState('')
  const [modelAttribute, setModelAttribute] = useState('')

  const GetAllModels = async () => {
    const url = `${mysql_endpoint}/api/models`
    const response = await axios.get(url)
    const processed_data = response.data.map((model) => {
      return {
        value: model.model_id,
        label: model.model_name
      }
    })
    setModelsDataOptions(processed_data)
  }

  useEffect(() => {
    GetAllModels()
  }, [])

  const onFinish = async (values) => {
    const final_data = {
      model_id: modelID,
      model_name: modelName,
      ...values
    }
    const url = `${mysql_endpoint}/api/attribute-mappings`
    const method = 'post'
    const data = final_data
    const config = { method, url, data }

    const axios_response = await axios(config)
    GetAllAttributeMappings()
    setCreateNew(false)
  }

  const HandleModelChange = async (value, option) => {
    const url = `${mysql_endpoint}/api/model-attributes/${value}`
    const method = 'get'
    const config = { method, url }
    const axios_response = await axios(config)

    const processed_data = axios_response.data.map((attribute) => {
      return {
        value: attribute.name,
        label: attribute.name
      }
    })

    setModelID(value)
    setModelName(option.label)
    setModelAttributesOptions(processed_data)
  }


  return (
    <div>
      <Title level={2}>Create New Mapping</Title>
      <Form onFinish={onFinish}>
        <Form.Item name='model_id' label='Model Name'>
          <Select placeholder="Model Name" options={modelsDataOptions} onSelect={HandleModelChange} />
        </Form.Item>

        {
          !(modelAttributesOptions.length === 0) &&
          <Form.Item name='attribute' label='Model Attribute'>
            <Select placeholder="Model Attribute" options={modelAttributesOptions} onChange={(value) => setModelAttribute(value)} />
          </Form.Item>
        }

        {
          modelID && modelAttribute &&
          <Form.List name="mappings">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{
                      display: 'block',
                      marginBottom: 8,
                    }}
                    align="baseline"
                  >
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <Form.Item
                        {...restField}
                        name={[name, 'value']}
                        rules={[
                          {
                            required: true,
                            message: 'Missing attribute name',
                          },
                        ]}
                      >
                        <Input placeholder="Attribute Value" />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'mapping']}
                        rules={[
                          {
                            required: true,
                            message: 'Missing value mapping',
                          },
                        ]}
                      >
                        <Input placeholder="Value Mapping" />
                      </Form.Item>
                      <Button style={{ margin: 0 }} danger onClick={() => remove(name)}>Remove</Button>
                    </div>
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add New Attribute
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        }
        <div style={{display: 'flex', gap: '1rem'}}>
          <Button type="primary" htmlType="submit" style={{ backgroundColor: '#4CAF50' }} >Create Mapping</Button>
          <Button type='primary' style={{ backgroundColor: '#F44336' }} onClick={() => setCreateNew(false)} >Cancel</Button>
        </div>
      </Form>
    </div>
  )
}

export default CreateNew
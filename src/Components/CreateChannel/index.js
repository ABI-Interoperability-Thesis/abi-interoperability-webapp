import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Typography, Button, Input, InputNumber, Select, Card, notification, Form } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import './index.css'
const { Title } = Typography

const CreateChannel = (props) => {
    const setCreateNewChannel = props.setCreateNewChannel
    const mirth_endpoint = props.mirth_endpoint
    const mysql_endpoint = props.mysql_endpoint
    const preprocessor_endpoint = props.preprocessor_endpoint
    const [preprocessorOptions, setPreprocessorOptions] = useState([])
    const [modelsData, setModelsData] = useState([])
    const [modelsDataOptions, setModelsDataOptions] = useState([])
    const [modelAttributes, setModelAttributes] = useState([])
    const [notificationApi, contextHolder] = notification.useNotification();


    useEffect(() => {
        GetPreprocessorOptions()
        GetAllModels()
    }, []);

    const GetAllModels = async () => {
        const url = `${mysql_endpoint}/api/models`
        const response = await axios.get(url)
        console.log(response.data)
        const processed_data = response.data.map((model) => {
            return {
                value: model.model_name,
                label: model.model_name
            }
        })
        setModelsData(response.data)
        setModelsDataOptions(processed_data)
    }

    const GetPreprocessorOptions = async () => {
        const url = `${preprocessor_endpoint}/api/preprocessors`
        const config = { method: 'get', url }

        const axios_response = await axios(config)

        const prepared_data = axios_response.data.map((preprocessor) => {
            return {
                value: preprocessor,
                value: preprocessor
            }
        })

        setPreprocessorOptions(prepared_data)
    }

    const GetModelAttributes = async (model_name) => {
        const model = modelsData.find((model) => model.model_name === model_name);
        const url = `${mysql_endpoint}/api/model-attributes/${model.model_id}`
        const response = await axios.get(url)
        const model_mappings = response.data.map((attribute) => {
            return {
                name: attribute.name,
                map_to: '',
                hl7_type: '',
                hl7_triggers: []
            }
        })
        setModelAttributes(model_mappings)
    }

    const message_type_options = [
        {
            value: 'ADT',
            label: 'ADT'
        },
        {
            value: 'ORU',
            label: 'ORU'
        }
    ]

    const message_triggers_options = [
        {
            value: 'A01',
            label: 'A01'
        },
        {
            value: 'A02',
            label: 'A02'
        },
        {
            value: 'A03',
            label: 'A03'
        },
        {
            value: 'R01',
            label: 'R01'
        },
        {
            value: 'R03',
            label: 'R03'
        }
    ]

    const obersvation_id_options = [
        {
            value: '01',
            label: '01'
        },
        {
            value: '02',
            label: '02'
        }
    ]

    const initialValues = {
        channel_port: 1000,
    };

    const onFinish = async (values) => {
        const new_channel_complete = {
            ...values,
            mappings: modelAttributes
        }

        const url = `${mirth_endpoint}/api/channels`
        const config = { method: 'post', url, data: new_channel_complete }
        console.log(new_channel_complete)
        const mirth_response = await axios(config)

        mirth_response.status === 200 ? notificationApi.success({
            message: 'Channel created successfully',
            description: 'The channel was created successfully'
        }) : notificationApi.error({
            message: 'Channel not created',
            description: 'The channel was not created. There was an error'
        })
    };

    const UpdateModelAttributes = (index, attribute, value) => {
        const currentState = [...modelAttributes]
        currentState[index][attribute] = value
        setModelAttributes(currentState)
    }

    return (
        <div>
            {contextHolder}
            <Title level={2}>New Channel</Title>

            <Form initialValues={initialValues} onFinish={onFinish}>

                <Form.Item label="Channel Name" name='channel_name'>
                    <Input placeholder="Enter the channel name" />
                </Form.Item>

                <Form.Item label="Channel Port" name='channel_port'>
                    <InputNumber defaultValue={1000} placeholder="Enter the channel port" min={1000} max={2000} />
                </Form.Item>

                <Form.Item label="Model" name='model_name'>
                    <Select placeholder="Select the model to use" options={modelsDataOptions} onChange={(value) => GetModelAttributes(value)} />
                </Form.Item>

                <Form.Item label="Preprocessor" name='preprocessor'>
                    <Select placeholder="Enter the channel preprocessor" options={preprocessorOptions} />
                </Form.Item>

                {
                    modelAttributes.map((attribute, index) => (
                        <Card key={index} title={attribute.name} style={{ marginBottom: '1rem' }}>
                            <Form.Item label="Attribute HL7 Mapping">
                                <Input placeholder="Enter the channel port" onChange={(event) => UpdateModelAttributes(index, 'map_to', event.target.value)} />
                            </Form.Item>
                            <Form.Item label="Supported Message Type">
                                <Select options={message_type_options} onChange={(value) => UpdateModelAttributes(index, 'hl7_type', value)} />
                            </Form.Item>
                            {
                                attribute.hl7_type === 'ORU' &&
                                <Form.Item label="Observation Id">
                                    <Select options={obersvation_id_options} onChange={(value) => UpdateModelAttributes(index, 'mapping_id', value)} />
                                </Form.Item>
                            }
                            <Form.Item label="Supported Message Triggers">
                                <Select mode='multiple' options={message_triggers_options} onChange={(value) => UpdateModelAttributes(index, 'hl7_triggers', value)} />
                            </Form.Item>
                        </Card>
                    ))
                }

                <div className='create-channel-buttons-container'>
                    <Button type="primary" htmlType="submit" style={{ backgroundColor: '#4CAF50' }} >Create Channel</Button>
                    <Button type='primary' style={{ backgroundColor: '#F44336' }} onClick={() => setCreateNewChannel(false)}>Cancel</Button>
                </div>
            </Form>

        </div>
    )
}

export default CreateChannel
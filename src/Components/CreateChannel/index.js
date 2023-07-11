import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Typography, Button, Input, InputNumber, Select, Card, notification, Form } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import './index.css'
import hl7_support from '../config/hl7-types-triggers.json'

const { Title } = Typography
const { TextArea } = Input;

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
    const [hl7MessageTypes, setHl7MessageTypes] = useState([])
    const [hl7MessageTriggers, setHl7MessageTriggers] = useState([])
    const [hl7MessageSegments, setHl7MessageSegments] = useState([])

    useEffect(() => {
        GetPreprocessorOptions()
        GetAllModels()
        GetHL7MessageTypes()
        GetHL7Triggers()
        GetHL7Segments()
    }, []);

    const GetHL7SubFields = async (field) => {
        const url = `${mysql_endpoint}/api/hl7-sub-fields/${field}`
        const response = await axios.get(url)
        let processed_data = []
        for (let i = 0; i < response.data.length; i++) {
            const element = response.data[i];
            processed_data.push({
                value: element,
                label: element
            })
        }
        return processed_data
    }

    const GetHL7Fields = async (msg_segment) => {
        const url = `${mysql_endpoint}/api/hl7-fields/${msg_segment}`
        const response = await axios.get(url)
        let processed_data = []
        for (let i = 0; i < response.data.length; i++) {
            const element = response.data[i];
            processed_data.push({
                value: element,
                label: element
            })
        }
        return processed_data
    }

    const GetHL7Segments = async () => {
        const url = `${mysql_endpoint}/api/hl7-segments`
        const response = await axios.get(url)
        const processed_data = response.data.map((hl7_segment) => {
            return {
                value: hl7_segment,
                label: hl7_segment
            }
        })
        setHl7MessageSegments(processed_data)
    }

    const GetHL7Triggers = async () => {
        const url = `${mysql_endpoint}/api/hl7-triggers`
        const response = await axios.get(url)
        const uniqueTriggers = [...new Set(response.data)];
        const processed_data = uniqueTriggers.map((hl7_trigger) => {
            return {
                value: hl7_trigger,
                label: hl7_trigger
            }
        })
        setHl7MessageTriggers(processed_data)
    }

    const GetHL7MessageTypes = async () => {
        const url = `${mysql_endpoint}/api/hl7-types`
        const response = await axios.get(url)
        const processed_data = response.data.map((hl7_type) => {
            return {
                value: hl7_type.value,
                label: hl7_type.value
            }
        })
        setHl7MessageTypes(processed_data)
    }

    const GetAllModels = async () => {
        const url = `${mysql_endpoint}/api/models`
        const response = await axios.get(url)
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
                label: preprocessor
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

    const message_type_options = Object.keys(hl7_support['types']).map((hl7_support_obj) => {
        return {
            label: hl7_support_obj,
            value: hl7_support_obj
        }
    })

    const initialValues = {
        channel_port: 1000,
    };

    const onFinish = async (values) => {
        const deleted_options = modelAttributes.map(item => {
            // Create a copy of the item object
            const newItem = { ...item };

            // Delete the specified attributes
            delete newItem.fields_options;
            delete newItem.sub_fields_options;
            delete newItem.sub2_fields_options;

            const seg = newItem.hl7_segment
            const field = newItem.hl7_field
            const subfield = newItem.hl7_sub_field ? newItem.hl7_sub_field : field + '.1'
            const map_to = `msg['${seg}']['${field}']['${subfield}']`
            newItem['map_to'] = map_to

            return newItem;
        });

        const new_channel_complete = {
            ...values,
            mappings: deleted_options
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

        setCreateNewChannel(false)
    };

    const UpdateModelAttributes = async (index, attribute, value) => {
        const currentState = [...modelAttributes]
        if (attribute === 'hl7_segment') {
            const fields_options = await GetHL7Fields(value)
            currentState[index]['fields_options'] = fields_options
            setModelAttributes(currentState)
        }

        if (attribute === 'hl7_field') {
            const sub_fields_options = await GetHL7SubFields(value)
            delete currentState[index]['sub_fields_options']
            setModelAttributes(currentState)
            if (sub_fields_options.length > 0) {
                currentState[index]['sub_fields_options'] = sub_fields_options
                setModelAttributes(currentState)
            }
        }

        if (attribute === 'hl7_sub_field') {
            const sub2_fields_options = await GetHL7SubFields(value)
            delete currentState[index]['sub2_fields_options']
            setModelAttributes(currentState)
            if (sub2_fields_options.length > 0) {
                currentState[index]['sub2_fields_options'] = sub2_fields_options
                setModelAttributes(currentState)
            }
        }

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

                <Form.Item label="Channel Description" name='channel_description'>
                    <TextArea placeholder="Enter the channel description" />
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
                            <Form.Item label="Supported Message Type">
                                <Select showSearch options={hl7MessageTypes} onChange={(value) => UpdateModelAttributes(index, 'hl7_type', value)} />
                            </Form.Item>
                            {
                                attribute.hl7_type === 'ORU' &&
                                <Form.Item label="Observation Id">
                                    <Input onChange={(event) => UpdateModelAttributes(index, 'mapping_id', event.target.value)} />
                                </Form.Item>
                            }
                            <Form.Item label="Supported Message Triggers">
                                <Select showSearch mode='multiple' options={hl7MessageTriggers} onChange={(value) => UpdateModelAttributes(index, 'hl7_triggers', value)} />
                            </Form.Item>

                            <div style={{display: 'flex', gap: '2rem'}}>
                                <Form.Item label="Mapped Message Segment" style={{width: '100%'}}>
                                    <Select showSearch options={hl7MessageSegments} onChange={(value) => UpdateModelAttributes(index, 'hl7_segment', value)}/>
                                </Form.Item>

                                {
                                    attribute.hl7_segment &&

                                    <Button type="primary" onClick={() => window.open(`https://hl7-definition.caristix.com/v2/HL7v2.5.1/Segments/${attribute.hl7_segment}`)}>
                                        {attribute.hl7_segment} Documentation
                                    </Button>
                                }
                            </div>

                            {
                                attribute.fields_options &&
                                <Form.Item label="Mapped Message Field">
                                    <Select showSearch options={attribute.fields_options} onChange={(value) => UpdateModelAttributes(index, 'hl7_field', value)} />
                                </Form.Item>
                            }

                            {
                                attribute.sub_fields_options &&
                                <Form.Item label="Mapped Message SubField">
                                    <Select showSearch options={attribute.sub_fields_options} onChange={(value) => UpdateModelAttributes(index, 'hl7_sub_field', value)} />
                                </Form.Item>
                            }

                            {
                                attribute.sub2_fields_options &&
                                <Form.Item label="Mapped Message SubField Field">
                                    <Select showSearch options={attribute.sub2_fields_options} onChange={(value) => UpdateModelAttributes(index, 'hl7_sub2_field', value)} />
                                </Form.Item>
                            }


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
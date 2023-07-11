import React from 'react'
import { Button, Typography, Input, Form, Space, Select, notification } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import axios from 'axios'
const { Title } = Typography
const { TextArea } = Input;



const CreateNew = (props) => {
    const setCreateNew = props.setCreateNew
    const endpoint = props.endpoint
    const GetAllModels = props.GetAllModels
    const [notificationApi, contextHolder] = notification.useNotification();

    const onFinish = (values) => {
        console.log('Received values of form:', values);
        CreateModel(values)
        setCreateNew(false)
    };

    const CreateModel = async (data) => {
        const url = `${endpoint}/api/models`
        const config = { method: 'post', url, data }
        const axios_response = await axios(config)
        console.log(axios_response.data)

        axios_response.status === 200 ? notificationApi.success({
            message: `Model ${data.model_name} created successfully`,
            description: 'The Model was created successfully'
        }) : notificationApi.error({
            message: `Model ${data.model_name} could not be created`,
            description: 'The Model was not created successfully. There was an error'
        })

        GetAllModels()
    }

    return (
        <>
            {contextHolder}
            <Title level={2}>Create New Model</Title>
            <Form onFinish={onFinish}>
                <Form.Item label="Model Name" name='model_name'>
                    <Input placeholder="Enter the model name" />
                </Form.Item>

                <Form.Item label="Model Description" name='description'>
                    <TextArea placeholder="Enter a description for a model" />
                </Form.Item>

                <Form.List name="attributes">
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
                                            name={[name, 'name']}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Missing attribute name',
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Attribute Name" />
                                        </Form.Item>

                                        <Form.Item
                                            {...restField}
                                            name={[name, 'data_type']}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Missing attribute data type',
                                                },
                                            ]}
                                        >
                                            <Select placeholder="Attribute Data Type" options={[{ value: 'continuous', label: 'continuous' }, { value: 'categorical', label: 'categorical' }]} />
                                        </Form.Item>
                                        <Button style={{ margin: 0 }} danger onClick={() => remove(name)}>Remove</Button>
                                    </div>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'description']}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Missing attribute description',
                                            },
                                        ]}
                                    >
                                        <TextArea placeholder="Attribute Description" />
                                    </Form.Item>
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

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                    <Button type='primary' style={{ backgroundColor: '#F44336' }} onClick={() => setCreateNew(false)} >Cancel</Button>
                </div>
            </Form>
        </>
    )
}

export default CreateNew
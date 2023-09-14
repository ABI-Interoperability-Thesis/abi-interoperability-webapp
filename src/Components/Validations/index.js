import React, { useState, useEffect } from 'react'
import { Typography, Button, Table, notification, Popconfirm, Input, Form, Descriptions } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'

const app_env = process.env.REACT_APP_ENV
const mysql_endpoint = process.env.REACT_APP_MYSQL_SERVICE_ENDPOINT

const { Title } = Typography
const { TextArea } = Input
const Validations = () => {

    const [validations, setValidations] = useState()
    const [createNew, setCreateNew] = useState(false)
    const [validationExpression, setValidationExpression] = useState()
    const [testValue, setTestValue] = useState()
    const [responseData, setResponseData] = useState()

    const GetAllValidations = async () => {
        const url = `${mysql_endpoint}/api/validations`

        const config = {
            method: 'get',
            url
        }

        const axios_response = await axios(config)
        const data = axios_response.data
        setValidations(data)
    }

    useEffect(() => {
        GetAllValidations()
    }, [])


    const handleDelete = async (record) => {
        console.log(record)
        const url = `${mysql_endpoint}/api/validations/${record.validation_id}`

        const config = {
            method: 'delete',
            url
        }

        await axios(config)
        GetAllValidations()
    }

    const CreateValidator = async (values) => {
        const url = `${mysql_endpoint}/api/validations/`

        const config = {
            method: 'post',
            url,
            data: values
        }

        await axios(config)
        GetAllValidations()
        setCreateNew(false)
    }

    const columns = [
        { title: 'Name', dataIndex: 'validation_name', key: 'validation_name' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        { title: 'Documentation Description', dataIndex: 'doc_description', key: 'doc_description' },
        { title: 'Validation Expression', dataIndex: 'validation_expression', key: 'validation_expression' },
        {
            title: 'Actions',
            key: 'action',
            render: (text, record) => (
                <div className='table-actions-requests'>
                    <Popconfirm
                        title="Are you sure you want to delete this item?"
                        icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => handleDelete(record)}
                    >
                        <Button danger>
                            Delete
                        </Button>
                    </Popconfirm>

                    <Button type='primary'>Update</Button>
                </div>
            ),
        }
    ]

    const TestValidator = async () => {
        const data = {
            value: testValue,
            expression: validationExpression
        }

        const url = `${mysql_endpoint}/api/test-validation`
        const method = 'post'

        const config = { method, url, data }

        const axios_response = await axios(config)
        const response_data = axios_response.data
        console.log(response_data)
        setResponseData(response_data)
    }

    return (
        <>
            <Title level={2}>General Validators</Title>
            {
                !createNew ? (
                    <>
                        {
                            validations &&
                            <div>
                                <Table dataSource={validations} columns={columns} />
                            </div>
                        }
                        <Button type='primary' style={{ backgroundColor: '#4CAF50' }} onClick={() => setCreateNew(true)}>New Validator</Button>
                    </>
                ) : (
                    <>
                        <Form onFinish={CreateValidator}>

                            <Form.Item label="Validator Name" name='validation_name'>
                                <Input placeholder="Validator name" />
                            </Form.Item>

                            <Form.Item label="Validator Description" name='description'>
                                <TextArea placeholder="Validator description" />
                            </Form.Item>

                            <Form.Item label="Validator Documentation Description" name='doc_description'>
                                <TextArea placeholder="Validator documentation description" />
                            </Form.Item>

                            <Form.Item label="Validator Expression" name='validation_expression'>
                                <TextArea placeholder="Validator expression" onChange={(event) => setValidationExpression(event.target.value)} />
                            </Form.Item>

                            {
                                validationExpression &&
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                    <Form.Item style={{ margin: 0 }} label="Test Value">
                                        <Input style={{ width: '15rem' }} onChange={(e) => setTestValue(e.target.value)} />
                                    </Form.Item>
                                    {
                                        testValue &&
                                        <Button type='primary' onClick={TestValidator}>Test Validator</Button>
                                    }
                                </div>
                            }



                            {
                                responseData &&
                                <Descriptions title="Validation Test Result" bordered column={1} style={{ marginBottom: '1rem' }}>
                                    <Descriptions.Item label="Valid">{responseData.validation_response ? <CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} /> : <CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />}</Descriptions.Item>
                                </Descriptions>
                            }


                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <Button type="primary" htmlType="submit" style={{ backgroundColor: '#4CAF50' }} >Create Validator</Button>
                                <Button type='primary' style={{ backgroundColor: '#F44336' }} onClick={() => setCreateNew(false)} >Cancel</Button>
                            </div>

                        </Form>
                    </>
                )
            }
        </>
    )
}

export default Validations
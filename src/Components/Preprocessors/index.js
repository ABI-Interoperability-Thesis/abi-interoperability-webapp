import React, { useState, useEffect } from 'react'
import { Typography, Button, Table, notification, Popconfirm, Input, Form } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import endpoints from '../config/endpoints.json'
import axios from 'axios'

const app_env = process.env.REACT_APP_ENV
const mysql_endpoint = endpoints['mysql-ws'][app_env]

const { Title } = Typography
const {TextArea} = Input
const Preprocessors = () => {

    const [preprocessors, setPreprocessors] = useState()
    const [createNew, setCreateNew] = useState(false)

    const GetAllPreprocessors = async () => {
        const url = `${mysql_endpoint}/api/preprocessors`

        const config = {
            method: 'get',
            url
        }

        const axios_response = await axios(config)
        const data = axios_response.data
        setPreprocessors(data)
    }

    useEffect(() => {
        GetAllPreprocessors()
    }, [])


    const handleDelete = async (record) => {
        console.log(record)
        const url = `${mysql_endpoint}/api/preprocessors/${record.preprocessor_id}`

        const config = {
            method: 'delete',
            url
        }

        await axios(config)
        GetAllPreprocessors()
    }

    const CreatePreprocessor = async (values) => {
        const url = `${mysql_endpoint}/api/preprocessors/`

        const config = {
            method: 'post',
            url,
            data: values
        }

        await axios(config)
        GetAllPreprocessors()
        setCreateNew(false)
    }

    const columns = [
        { title: 'Preprocessor Name', dataIndex: 'preprocessor_name', key: 'preprocessor_name' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        { title: 'Documentation Description', dataIndex: 'doc_description', key: 'doc_description' },
        { title: 'Preprocessor Script', dataIndex: 'preprocessor_script', key: 'preprocessor_script' },
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

    return (
        <>
            <Title level={2}>General Preprocessors</Title>
            {
                !createNew ? (
                    <>
                        {
                            preprocessors &&
                            <div>
                                <Table dataSource={preprocessors} columns={columns} />
                            </div>
                        }
                        <Button type='primary' style={{ backgroundColor: '#4CAF50' }} onClick={() => setCreateNew(true)}>New Preprocessor</Button>
                    </>
                ) : (
                    <>
                        <Form onFinish={CreatePreprocessor}>

                            <Form.Item label="Preprocessor Name" name='preprocessor_name'>
                                <Input placeholder="Preprocessor name" />
                            </Form.Item>

                            <Form.Item label="Preprocessor Description" name='description'>
                                <TextArea placeholder="Preprocessor description" />
                            </Form.Item>

                            <Form.Item label="Preprocessor Script" name='preprocessor_script'>
                                <TextArea placeholder="Preprocessor script" />
                            </Form.Item>


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

export default Preprocessors
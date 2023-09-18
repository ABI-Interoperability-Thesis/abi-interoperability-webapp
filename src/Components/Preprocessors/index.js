import React, { useState, useEffect } from 'react'
import { Typography, Button, Table, Popconfirm, Input, Form, Modal, Descriptions, Divider, Select } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
import MonacoEditor from 'react-monaco-editor';

const app_env = process.env.REACT_APP_ENV
const mysql_endpoint = process.env.REACT_APP_MYSQL_SERVICE_ENDPOINT

const { Title, Paragraph } = Typography
const { TextArea } = Input
const Preprocessors = () => {

    // Modal Data
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalOpenScript, setIsModalOpenScript] = useState(false)
    const [selectedScript, setSelectedScript] = useState()

    // Preprocessor Data
    const [preprocessors, setPreprocessors] = useState()
    const [createNew, setCreateNew] = useState(false)
    const [testingValue, setTestingValue] = useState(false)
    const [responseData, setResponseData] = useState(false)
    const [selectedSourceType, setSelectedSourceType] = useState('hl7')

    // Monaco Data
    const [testingObject, setTestingObject] = useState('')

    // Monaco Controls
    const handleEditorChange = (newCode, event) => {
        // Update the code state when the editor content changes
        setTestingObject(newCode);
    };

    const editorOptions = {
        minimap: { enabled: false },
        formatOnPaste: true, // Enable automatic formatting on paste
        formatOnType: true,  // Enable automatic formatting while typing
    }

    useEffect(() => {
        GetAllPreprocessors('hl7')
    }, [])


    const GetAllPreprocessors = async (source_type) => {
        const url = `${mysql_endpoint}/api/preprocessors/${source_type}`

        const config = {
            method: 'get',
            url
        }

        const axios_response = await axios(config)
        const data = axios_response.data
        setPreprocessors(data)
    }


    const handleDelete = async (record) => {
        console.log(record)
        const url = `${mysql_endpoint}/api/preprocessors/${record.preprocessor_id}`

        const config = {
            method: 'delete',
            url
        }

        await axios(config)
        GetAllPreprocessors(selectedSourceType)
    }

    const CreatePreprocessor = async (values) => {
        const url = `${mysql_endpoint}/api/preprocessors/`
        const data = {
            ...values,
            preprocessor_script: testingObject
        }

        const config = {
            method: 'post',
            url,
            data
        }

        console.log(data)

        await axios(config)
        GetAllPreprocessors(selectedSourceType)
        setCreateNew(false)
    }

    const columns = [
        { title: 'Preprocessor Name', dataIndex: 'preprocessor_name', key: 'preprocessor_name' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        { title: 'Source Type', dataIndex: 'preprocessor_source_type', key: 'preprocessor_source_type' },
        { title: 'Documentation Description', dataIndex: 'doc_description', key: 'doc_description' },
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

                    <Button style={{ backgroundColor: '#FFA500' }} type='primary' onClick={() => { setSelectedScript(record['preprocessor_script']); setIsModalOpenScript(true) }}>Inspect Script</Button>
                </div>
            ),
        }
    ]

    const TestPreprocessor = async () => {
        const data = {
            input_data: testingValue,
            preprocessor_script: testingObject
        }

        console.log(data)

        const url = `${mysql_endpoint}/api/test-preprocessor`
        const method = 'post'
        const config = { method, url, data }

        const axios_response = await axios(config)
        const response_data = axios_response.data

        setResponseData(response_data)
    }

    const AppendApiToScript = (api_value) => {
        setTestingObject((prevValue) => prevValue + api_value);
    }

    const source_type_options = [
        {
            label: 'HL7',
            value: 'hl7'
        },
        {
            label: 'FHIR',
            value: 'fhir'
        },
    ]

    return (
        <>
            <Title level={2}>General Preprocessors</Title>
            {
                !createNew ? (
                    <>
                        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <p>Preprocessor Source Type</p>
                            <Select options={source_type_options} defaultValue='HL7' onChange={(value) => {GetAllPreprocessors(value); setSelectedSourceType(value)}} />
                        </div>
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

                            <Divider>Preprocessor Metadata</Divider>
                            <Form.Item label="Preprocessor Name" name='preprocessor_name'>
                                <Input placeholder="Preprocessor name" />
                            </Form.Item>

                            <Form.Item label="Preprocessor Source Type" name='preprocessor_source_type'>
                                <Select options={source_type_options} />
                            </Form.Item>

                            <Form.Item label="Preprocessor Description" name='description'>
                                <TextArea placeholder="Preprocessor description" />
                            </Form.Item>

                            <Form.Item label="Preprocessor Documentation Description" name='doc_description'>
                                <TextArea placeholder="Preprocessor documentation description" />
                            </Form.Item>


                            <Divider>Preprocessor APIs</Divider>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <Button onClick={() => AppendApiToScript('result')}>result</Button>
                                    <Button onClick={() => AppendApiToScript('input_data')}>input_data</Button>
                                </div>
                                <Button type='primary' onClick={() => setIsModalOpen(true)}>How to write a preprocessor</Button>
                            </div>

                            <Divider>Preprocessor Script</Divider>

                            <MonacoEditor
                                language="javascript" // Specify the language mode (e.g., javascript)
                                theme='vs' // Specify the editor theme (e.g., vs)
                                value={testingObject}
                                options={editorOptions}
                                onChange={handleEditorChange}
                                height="30rem"
                                width="100%"
                                autoClosingQuotes={true}
                                lineNumbers={false}
                            />

                            {
                                testingObject &&
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', marginTop: '1rem' }}>
                                    <Form.Item style={{ margin: 0 }} label="Test Value">
                                        <Input onChange={(e) => setTestingValue(e.target.value)} />
                                    </Form.Item>
                                    {
                                        testingValue &&
                                        <Button type='primary' onClick={TestPreprocessor}>Test Preprocessor</Button>
                                    }
                                </div>
                            }

                            {
                                responseData &&
                                <Descriptions title='Test Response' column={1} bordered>
                                    <Descriptions.Item label='Result'>{responseData.result}</Descriptions.Item>
                                </Descriptions>
                            }

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }} >
                                <Button type="primary" htmlType="submit" style={{ backgroundColor: '#4CAF50' }} >Create Preprocessor</Button>
                                <Button type='primary' style={{ backgroundColor: '#F44336' }} onClick={() => setCreateNew(false)} >Cancel</Button>
                            </div>
                        </Form>
                    </>
                )
            }
            {/* Preprocessor writting instruction modal */}
            <Modal title="How to Write a Preprocessor" open={isModalOpen} onOk={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)}>
                <Title level={3}>Preprocessor Writting Instructions</Title>
                <p>The ABI Interoperability system allows you to write your own preprocessors in Javascript with access to two main APIs.</p>
                <p>You must use one or both of them to turn your input value into your preprocessed value.</p>
                <Descriptions label="Preprocessor APIs" column={1} bordered>
                    <Descriptions.Item label="input_data">Literal data value coming from the request. </Descriptions.Item>
                    <Descriptions.Item label="result">This variable must hold the preprocessed state of the input_data. </Descriptions.Item>
                </Descriptions>
                <Divider>Example Preprocessor</Divider>
                <p>In this example preprocessor the input_data is taken and multiplied by 100.</p>
                <Paragraph>
                    <pre>
                        result = input_data * 100
                    </pre>
                </Paragraph>
            </Modal>

            {/* Preprocessor Script */}
            <Modal title="Preprocessor Script" open={isModalOpenScript} onOk={() => setIsModalOpenScript(false)} onCancel={() => setIsModalOpenScript(false)}>
                <MonacoEditor
                    language="javascript"
                    theme='vs'
                    options={{
                        ...editorOptions,
                        readOnly: true,
                    }}
                    height="30rem"
                    width="100%"
                    autoClosingQuotes={true}
                    lineNumbers={false}
                    value={selectedScript}
                />
            </Modal>
        </>
    )
}

export default Preprocessors
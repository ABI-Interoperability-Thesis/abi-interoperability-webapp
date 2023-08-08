import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, Link, useNavigate } from 'react-router-dom';
import endpoints from '../../Components/config/endpoints.json'
import { Typography, Tabs, Descriptions, Input, Button, Form, Tag } from 'antd';
import AttributeCard from './AttributeCard/index'
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons'
import Loading from '../../Common/Loading/index'

const { Title, Paragraph } = Typography
const { TextArea } = Input;

const app_env = process.env.REACT_APP_ENV
const mysql_endpoint = process.env.REACT_APP_MYSQL_SERVICE_ENDPOINT
const mirth_endpoint = process.env.REACT_APP_MIRTH_SERVICE_ENDPOINT

const ModelDetails = () => {
    const { model_id } = useParams();

    const [modelData, setModelData] = useState()
    const [channelPorts, setChannelPorts] = useState()
    const [testResponse, setTestResponse] = useState()
    const [runnerResponse, setRunnerResponse] = useState()
    const [loading, setLoading] = useState(false)
    const [runnerLoading, setRunnerLoading] = useState(false)


    const GetModelDetails = async () => {
        const url = `${mysql_endpoint}/auth/models/${model_id}`
        const method = 'get'
        const headers = {
            'session-token': localStorage.getItem('session-token')
        }
        const config = { method, url, headers }
        const response = await axios(config)
        console.log(response.data)
        setModelData(response.data)
    }

    const getChannelEndpoints = async () => {
        console.log('Getting Channel Endpoints')
        const default_url = process.env.REACT_APP_MIRTH_ENDPOINT
        const default_url_docs = process.env.REACT_APP_MIRTH_ENDPOINT_DOCS
        const url = `${mysql_endpoint}/api/mirth-channels`
        const method = 'get'
        const config = { method, url }
        const axios_response = await axios(config)
        const channel_ids = axios_response.data

        const runner_port = await getChannelPorts(channel_ids['runner_channel'])
        const tester_port = await getChannelPorts(channel_ids['tester_channel'])


        console.log({
            runner_url: {
                front_end: `${default_url}:${runner_port}`,
                docs: `${default_url_docs}:${runner_port}`,
            },
            tester_url: {
                front_end: `${default_url}:${tester_port}`,
                docs: `${default_url_docs}:${tester_port}`,
            }
        })

        setChannelPorts({
            runner_url: {
                front_end: `${default_url}:${runner_port}`,
                docs: `${default_url_docs}:${runner_port}`,
            },
            tester_url: {
                front_end: `${default_url}:${tester_port}`,
                docs: `${default_url_docs}:${tester_port}`,
            }
        })

    }

    const getChannelPorts = async (channel_id) => {
        const url = `${mirth_endpoint}/api/channels/channel-port/${channel_id}`
        const method = 'get'
        const config = { method, url }
        const axios_response = await axios(config)
        return axios_response.data.channel_port
    }

    const TestModel = async (values) => {
        setLoading(true)
        const url = `${mysql_endpoint}/api/proxy-request`
        const body_config = {
            url: `${channelPorts['tester_url']['front_end']}?model=${modelData['model']['model_name']}`,
            method: 'post',
            headers: {
                'API-Token': localStorage.getItem('session-token'),
                'Content-Type': 'text/plain'
            },
            data: values['messages']
        }

        console.log(body_config)

        const config = {
            url,
            method: 'post',
            data: { config: body_config }
        }

        try {
            const axios_response = await axios(config)
            setTestResponse(axios_response.data)
            setLoading(false)
            console.log(axios_response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const RunModel = async (values) => {
        setRunnerLoading(true)
        const url = `${mysql_endpoint}/api/proxy-request`
        const body_config = {
            url: `${channelPorts['runner_url']['front_end']}?model=${modelData['model']['model_name']}`,
            method: 'post',
            headers: {
                'API-Token': localStorage.getItem('session-token'),
                'Content-Type': 'text/plain'
            },
            data: values['messages']
        }

        console.log(body_config)

        const config = {
            url,
            method: 'post',
            data: { config: body_config }
        }

        try {
            const axios_response = await axios(config)
            setRunnerResponse(axios_response.data)
            setRunnerLoading(false)
            console.log(axios_response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        GetModelDetails()
        getChannelEndpoints()
    }, [])


    return (
        <>
            {
                modelData &&
                <>
                    <Descriptions style={{ marginBottom: '1rem' }} title='Model Summary' column={1} bordered>
                        <Descriptions.Item label='Model Name'>{modelData['model']['model_name']}</Descriptions.Item>
                        <Descriptions.Item label='Model Description'>{modelData['model']['description']}</Descriptions.Item>
                        <Descriptions.Item label='Attribute Count'>{modelData['model']['attribute_count']}</Descriptions.Item>
                        <Descriptions.Item label='Permission'>
                            <div>
                                {modelData.client_permission ? <CheckCircleFilled style={{ fontSize: '1.5rem', color: '#4CAF50' }} /> : <CloseCircleFilled style={{ fontSize: '1.5rem', color: '#FF9800' }} />}
                            </div>
                        </Descriptions.Item>

                    </Descriptions>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Title level={3} style={{ margin: 0, padding: 0 }}>Model Access</Title>

                    </div>

                    <Tabs items={[
                        {
                            key: '1',
                            label: 'Model Attributes',
                            children: (
                                <>
                                    {
                                        modelData &&
                                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                                            <Title style={{ marginTop: "2rem" }} level={2}>Model Attributes</Title>
                                            {
                                                modelData.attribute_configs.map((mapping) => (
                                                    <AttributeCard mysql_endpoint={mysql_endpoint} data={mapping} />
                                                ))
                                            }

                                        </div>
                                    }
                                </>
                            )
                        },
                        {
                            key: '2',
                            label: 'Test the Model',
                            children: (
                                <>
                                    {
                                        channelPorts &&
                                        <>
                                            <Title level={2}>Test the Model</Title>
                                            <Paragraph>
                                                <pre>
                                                    <Paragraph copyable>{`${channelPorts['tester_url']['docs']}?model=${modelData['model']['model_name']}`}</Paragraph>
                                                </pre>
                                            </Paragraph>
                                            <Form onFinish={TestModel}>
                                                <Form.Item name='messages'>
                                                    <TextArea style={{ minHeight: '10rem' }} placeholder='Your HL7 messages' />
                                                </Form.Item>
                                                <Button htmlType='submit' style={{ marginTop: '1rem' }} type='primary'>Test Model</Button>
                                            </Form>

                                            {
                                                loading ?
                                                    (
                                                        <Loading />
                                                    ) :
                                                    (
                                                        <>
                                                            {
                                                                testResponse &&
                                                                <div style={{ marginTop: '1rem' }}>
                                                                    {
                                                                        testResponse.complete_req === true && testResponse.req_valid === true ?
                                                                            (<Tag color='green'>Request is ready to run model</Tag>) :
                                                                            (<Tag color='red'>Request is not ready to run model</Tag>)
                                                                    }
                                                                    <Descriptions style={{ marginTop: '1rem' }} title='System Response' bordered column={1}>
                                                                        <Descriptions.Item label='Status'>{testResponse.status}</Descriptions.Item>
                                                                        <Descriptions.Item label='Client Permission'>
                                                                            {
                                                                                testResponse.client_permission ? <CheckCircleFilled style={{ fontSize: '1.5rem', color: '#4CAF50' }} /> : <CloseCircleFilled style={{ fontSize: '1.5rem', color: '#FF9800' }} />
                                                                            }
                                                                        </Descriptions.Item>

                                                                        {
                                                                            testResponse.complete_req !== null &&
                                                                            <Descriptions.Item label='Complete Request'>
                                                                                {
                                                                                    testResponse.complete_req ? <CheckCircleFilled style={{ fontSize: '1.5rem', color: '#4CAF50' }} /> : <CloseCircleFilled style={{ fontSize: '1.5rem', color: '#FF9800' }} />
                                                                                }
                                                                            </Descriptions.Item>
                                                                        }

                                                                        {
                                                                            testResponse.req_valid !== null &&
                                                                            <Descriptions.Item label='Valid Request'>
                                                                                {
                                                                                    testResponse.req_valid ? <CheckCircleFilled style={{ fontSize: '1.5rem', color: '#4CAF50' }} /> : <CloseCircleFilled style={{ fontSize: '1.5rem', color: '#FF9800' }} />
                                                                                }
                                                                            </Descriptions.Item>
                                                                        }


                                                                    </Descriptions>

                                                                    {
                                                                        testResponse.fields_response !== null &&
                                                                        <Descriptions style={{ marginTop: '1rem' }} title='Request Data' bordered column={1}>
                                                                            {
                                                                                Object.keys(testResponse.fields_response).map((field, index) => (
                                                                                    <Descriptions.Item label={field} key={index}>
                                                                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                                                            <b><p>Status: </p></b>
                                                                                            {testResponse.fields_response[field]['status'] === 'ok' ? <CheckCircleFilled style={{ fontSize: '1.5rem', color: '#4CAF50' }} /> : <CloseCircleFilled style={{ fontSize: '1.5rem', color: '#FF9800' }} />}
                                                                                            <b><p>Value: </p></b>
                                                                                            {
                                                                                                testResponse.fields_response[field]['value'] ?
                                                                                                    <>{testResponse.fields_response[field]['value']}</> : 'missing'
                                                                                            }

                                                                                            {
                                                                                                testResponse.fields_response[field]['msg_type'] &&
                                                                                                <>
                                                                                                    <b><p>Message Type: </p></b>
                                                                                                    {testResponse.fields_response[field]['msg_type']}
                                                                                                </>
                                                                                            }

                                                                                            {
                                                                                                testResponse.fields_response[field]['mapping'] &&
                                                                                                <>
                                                                                                    <b><p>Field Mapping: </p></b>
                                                                                                    {testResponse.fields_response[field]['mapping']}
                                                                                                </>
                                                                                            }

                                                                                            {
                                                                                                testResponse.fields_response[field]['msg_triggers'] &&
                                                                                                <>
                                                                                                    <b><p>Message Triggers: </p></b>
                                                                                                    {testResponse.fields_response[field]['msg_triggers']}
                                                                                                </>
                                                                                            }
                                                                                        </div>
                                                                                    </Descriptions.Item>
                                                                                ))
                                                                            }
                                                                        </Descriptions>
                                                                    }

                                                                    {
                                                                        testResponse.val_obj &&
                                                                        <Descriptions style={{ marginTop: '1rem' }} title='Data Validation' bordered column={1}>
                                                                            {
                                                                                Object.keys(testResponse.val_obj).map((field, index) => (
                                                                                    <Descriptions.Item label={field} key={index}>
                                                                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                                                            <b><p>Validation: </p></b>
                                                                                            {testResponse.val_obj[field]['validation_response'] ? <CheckCircleFilled style={{ fontSize: '1.5rem', color: '#4CAF50' }} /> : <CloseCircleFilled style={{ fontSize: '1.5rem', color: '#FF9800' }} />}
                                                                                            <b><p>Documentation: </p></b>
                                                                                            {testResponse.val_obj[field]['description']}
                                                                                            <b><p>Regex: </p></b>
                                                                                            {testResponse.val_obj[field]['regex']}
                                                                                        </div>
                                                                                    </Descriptions.Item>
                                                                                ))
                                                                            }
                                                                        </Descriptions>
                                                                    }
                                                                </div>
                                                            }
                                                        </>
                                                    )
                                            }
                                        </>
                                    }
                                </>
                            )
                        },
                        {
                            key: '3',
                            label: 'Run the Model',
                            children: (
                                <>
                                    {
                                        channelPorts &&
                                        <>
                                            <Title level={2}>Test the Model</Title>
                                            <Paragraph>
                                                <pre>
                                                    <Paragraph copyable>{`${channelPorts['runner_url']['docs']}?model=${modelData['model']['model_name']}`}</Paragraph>
                                                </pre>
                                            </Paragraph>
                                            <Form onFinish={RunModel}>
                                                <Form.Item name='messages'>
                                                    <TextArea style={{ minHeight: '10rem' }} placeholder='Your HL7 messages' />
                                                </Form.Item>
                                                <Button htmlType='submit' style={{ marginTop: '1rem' }} type='primary'>Run Model</Button>
                                            </Form>

                                            {
                                                runnerLoading ?
                                                    (
                                                        <Loading />
                                                    )
                                                    :
                                                    (
                                                        <>
                                                            {
                                                                runnerResponse &&
                                                                <Descriptions title='System Response' bordered column={1}>
                                                                    <Descriptions.Item label='Status'>{runnerResponse.status}</Descriptions.Item>
                                                                    <Descriptions.Item label='Message'>{runnerResponse.message}</Descriptions.Item>
                                                                </Descriptions>
                                                            }
                                                        </>
                                                    )
                                            }
                                        </>
                                    }

                                </>
                            )
                        }
                    ]} />
                </>

            }
        </>
    )
}

export default ModelDetails
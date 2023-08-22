import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Typography, Button, Card, Tag, Empty, Input, Form, InputNumber, Table, notification, Tabs, Popconfirm } from 'antd'
import {ExclamationCircleOutlined} from '@ant-design/icons'
import axios from 'axios'
const { Title, Paragraph } = Typography


const CreateRunnerChannel = (props) => {
    const runner_info = props.runner_info
    const mirth_endpoint = props.mirth_endpoint
    const channel_type = props.channel_type
    const GetChannelIds = props.GetChannelIds

    const [api, contextHolder] = notification.useNotification();
    const [createChannel, setCreateChannel] = useState(false)
    const [usedPorts, setUsedPorts] = useState([])

    const DeleteChannel = async (id) => {
        const url = `${mirth_endpoint}/api/channels/${runner_info.channel_id}`
        const method = 'delete'
        const config = { method, url }
        const axios_response = await axios(config)
        if (axios_response.status !== 200) {
            api.error({
                message: `Channel Could not be deleted`,
                description: `There was an error deleting the channel`
            });
            return
        }
        GetChannelIds()
        GetUsedPorts()
    }

    const CreateChannel = async (values) => {
        if (usedPorts.some(item => item.port === values.channel_port)) {
            api.warning({
                message: `Port already in use`,
                description: `Port ${values.channel_port} is already in use`
            });
            return
        }

        const data = {
            channel_type,
            ...values
        }
        console.log(data)

        const url = `${mirth_endpoint}/api/channels/create-channel`
        const method = 'post'
        const config = { method, url, data }
        const axios_response = await axios(config)
        if (axios_response.status !== 200) {
            api.error({
                message: `Channel Could bot be created`,
                description: `There was an error creating the channel`
            });
            return
        }

        GetChannelIds()
        GetUsedPorts()
        setCreateChannel(false)
    }

    const GetUsedPorts = async () => {
        const url = `${mirth_endpoint}/api/channels/ports`
        const method = 'get'
        const config = { method, url }
        const axios_response = await axios(config)
        const used_ports = axios_response.data
        setUsedPorts(used_ports)
    }

    useEffect(() => {
        GetUsedPorts()
    }, [])

    const ports_columns = [
        { title: 'Channel Id', dataIndex: 'id', key: 'id' },
        { title: 'Client Name', dataIndex: 'name', key: 'name' },
        { title: 'Channel Port', dataIndex: 'port', key: 'port' },
    ]

    const channel_details = {
        "runner": {
            "name": "Runner",
            "description": "This channel will process HL7 messages and run them through the entire Interoperability system. It's meant for production usage.",
        },
        "test": {
            "name": "Tester",
            "description": "This channel will only test incoming HL7 messages. It's meant for testing new models and mappings.",
        }
    }

    const tabItems = [
        {
            key: '1',
            label: `Channel Configuration`,
            children: (
                <>
                    <Title level={3}>Create {channel_details[channel_type]['name']} Channel</Title>
                    <Paragraph>
                        <pre>
                            {channel_details[channel_type]['description']}
                        </pre>
                    </Paragraph>
                    <Form onFinish={CreateChannel}>
                        <Form.Item label='Channel Name' name='channel_name' rules={[
                            {
                                required: true,
                                message: 'Please provide the Channel Name',
                            },
                        ]}>
                            <Input placeholder='Channel Name' />
                        </Form.Item>

                        <Form.Item label='Channel Description' name='channel_description' rules={[
                            {
                                required: true,
                                message: 'Please provide the Channel Description',
                            },
                        ]}>
                            <Input placeholder='Channel Port' />
                        </Form.Item>

                        <Form.Item label='Channel Port' name='channel_port' rules={[
                            {
                                required: true,
                                message: 'Please provide the Channel Port',
                            },
                        ]}>
                            <InputNumber />
                        </Form.Item>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Button type="primary" style={{ backgroundColor: '#F44336' }} onClick={() => setCreateChannel(false)}>Cancel</Button>
                            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#4CAF50' }} >Create Channel</Button>
                        </div>
                    </Form>
                </>
            ),
        },
        {
            key: '2',
            label: `Ports in Use`,
            children: (
                <>
                    <Title level={4}>Used Ports</Title>
                    <Table columns={ports_columns} dataSource={usedPorts} />
                </>
            ),
        }
    ]

    return (
        <>
            {contextHolder}
            {
                !createChannel ?
                    (
                        <>
                            {
                                runner_info !== 'not found' ? (
                                    <Card title={<>{channel_details[channel_type]['name']} Channel <Tag color='geekblue'>{runner_info.channel_id}</Tag></>}>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <Title style={{ margin: 0 }} level={5}>Channel Name</Title>
                                            <Paragraph style={{ margin: 0 }}>
                                                <pre>{runner_info.channel_name}</pre>
                                            </Paragraph>
                                        </div>

                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <Title style={{ margin: 0 }} level={5}>Channel Description</Title>
                                            <Paragraph style={{ margin: 0 }}>
                                                <pre>{runner_info.channel_description}</pre>
                                            </Paragraph>
                                        </div>

                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <Title style={{ margin: 0 }} level={5}>Channel Type</Title>
                                            <Paragraph style={{ margin: 0 }}>
                                                <pre>HTTP</pre>
                                            </Paragraph>
                                        </div>

                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <Title style={{ margin: 0 }} level={5}>Channel Port</Title>
                                            <Paragraph style={{ margin: 0 }}>
                                                <pre>{runner_info.port}</pre>
                                            </Paragraph>
                                        </div>

                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <Title style={{ margin: 0 }} level={5}>Revision</Title>
                                            <Paragraph style={{ margin: 0 }}>
                                                <pre>{runner_info.revision}</pre>
                                            </Paragraph>
                                        </div>

                                        <Paragraph>
                                            ver. {runner_info.version}
                                        </Paragraph>

                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <Link to={`/channels/${runner_info.channel_id}`}>
                                                <Button type='primary'>Inspect</Button>
                                            </Link>
                                            <Popconfirm
                                                title="Are you sure you want to delete this channel?"
                                                icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                                                okText="Yes"
                                                cancelText="No"
                                                onConfirm={DeleteChannel}
                                            >
                                                <Button danger>
                                                    Delete
                                                </Button>
                                            </Popconfirm>
                                        </div>

                                    </Card>)
                                    :
                                    (
                                        <>
                                            <Card title={`${channel_details[channel_type]['name']} Channel`}>
                                                <>
                                                    <Empty description={`There was no ${channel_details[channel_type]['name']} Channel found in this Mirth Connect deployment`} />
                                                    <Button type='primary' onClick={() => setCreateChannel(true)}>Create {channel_details[channel_type]['name']} Channel</Button>
                                                </>
                                            </Card>
                                        </>

                                    )
                            }
                        </>
                    )
                    :
                    (
                        <>
                            <Tabs defaultActiveKey='1' items={tabItems} />
                        </>
                    )
            }
        </>
    )
}

export default CreateRunnerChannel
import React, { useEffect, useState } from 'react'
import { Card, Typography, Statistic, Table, Button, Tag } from 'antd';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import axios from 'axios'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'

import './index.css'
const formatter = (value) => <CountUp end={value} separator="," />;

const { Title, Paragraph } = Typography;
const app_env = process.env.REACT_APP_ENV
const mysql_endpoint = process.env.REACT_APP_MYSQL_SERVICE_ENDPOINT

const Dashboard = () => {
    const [requestsInfo, setRequestsInfo] = useState({})
    const [requestsInfoByModel, setRequestsInfoByModel] = useState([])
    const [modelConfigs, setModelConfigs] = useState([])
    const [issueInfobyClient, setIssueInfobyClient] = useState([])
    const [mirthChannels, setMirthChannels] = useState();


    const GetChannelIds = async () => {
        // Getting mirth channels ids
        const url = `${mysql_endpoint}/api/mirth-channels`
        const method = 'get'
        const config = { method, url }
        const axios_response = await axios(config)
        const mirth_ids = axios_response.data
        console.log(mirth_ids)
        setMirthChannels([
            {
                channel: 'HL7 Mapper Channel',
                state: mirth_ids['hl7_mapper']
            }
        ])
    }

    const GetAllRequestsInfo = async () => {
        const url = `${mysql_endpoint}/api/dash-requests`
        const method = 'get'
        const config = { method, url }
        const axios_response = await axios(config)
        const req_data = axios_response.data
        setRequestsInfo(req_data)
    }

    const GetAllRequestsInfoByModel = async () => {
        const url = `${mysql_endpoint}/api/dash-requests-by-model`
        const method = 'get'
        const config = { method, url }
        const axios_response = await axios(config)
        const req_data = axios_response.data
        setRequestsInfoByModel(req_data)
    }

    const GetModelConfigs = async () => {
        const url = `${mysql_endpoint}/api/dash-model-config`
        const method = 'get'
        const config = { method, url }
        const axios_response = await axios(config)
        const req_data = axios_response.data
        console.log('Model Configs')
        console.log(req_data)
        setModelConfigs(req_data)
    }

    const GetIssueInfoByClient = async () => {
        const url = `${mysql_endpoint}/api/issues-info`
        const method = 'get'
        const config = { method, url }
        const axios_response = await axios(config)
        const req_data = axios_response.data
        setIssueInfobyClient(req_data)
    }

    useEffect(() => {
        GetAllRequestsInfo()
        GetAllRequestsInfoByModel()
        GetModelConfigs()
        GetIssueInfoByClient()
        GetChannelIds()
    }, [])

    const columns = [
        { title: 'Model Name', dataIndex: 'model_name', key: 'model_name' },
        { title: 'Total Requests', dataIndex: 'total_requests', key: 'total_requests' },
        { title: 'Total Answered Requests', dataIndex: 'answered_requests', key: 'answered_requests' },
        { title: 'Total Unanswered Requests', dataIndex: 'unanswered_requests', key: 'unanswered_requests' },
    ]

    const columns_configs = [
        { title: 'Model Name', dataIndex: 'model_name', key: 'model_name' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        { title: 'Deployed', key: 'deployed', render: (obj) => (obj.deployed ? <CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} /> : <CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />) },
        { title: 'HL7 Support', key: 'hl7_support', render: (obj) => (obj.hl7_support ? <CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} /> : <CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />) },
        { title: 'FHIR Support', key: 'fhir_support', render: (obj) => (obj.fhir_support ? <CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} /> : <CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />) },
        { title: 'Attributes', dataIndex: 'attribute_count', key: 'attribute_count' },
        { title: 'Default Mappings', dataIndex: 'default_mappings', key: 'default_mappings' },
        { title: 'Validators', dataIndex: 'model_validations', key: 'model_validations' },
        { title: 'Preprocessors', dataIndex: 'model_preprocessors', key: 'model_preprocessors' },
        { title: 'HL7 Deploy Ready', key: 'configured', render: (obj) => (obj.configured ? <CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} /> : <CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />) },
        { title: 'FHIR Deploy Ready', key: 'configured', render: (obj) => (obj.configured_fhir ? <CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} /> : <CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />) },
        {
            title: 'Actions',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Link to={`/models/${record.model_id}`}>
                        <Button type='primary'>
                            Inspect
                        </Button>
                    </Link>
                </div>
            ),
        }
    ]

    const issue_columns = [
        { title: 'Client Name', dataIndex: 'client_name', key: 'client_name' },
        { title: 'Open Issues', dataIndex: 'open_issues', key: 'open_issues' },
        { title: 'Closed Issues', dataIndex: 'closed_issues', key: 'closed_issues' },
    ]

    const mirth_columns = [
        { title: 'Channel', dataIndex: 'channel', key: 'channel' },
        { title: 'Channel State', key: 'state', render: (obj) => (obj.state !== 'not found' ? <CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} /> : <CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />) },
    ]

    return (
        <>
            <Title level={2}>Request Information</Title>
            <div className='req-info-container'>
                <Card bordered={false} style={{ width: '15rem', justifyContent: 'center' }}>
                    <Statistic title="Total Requests" value={requestsInfo['total_requests']} formatter={formatter} />
                </Card>
                <Card bordered={false} style={{ width: '15rem', justifyContent: 'center' }}>
                    <Statistic title="Total Unanswered Requests" value={requestsInfo['unanswered_requests']} formatter={formatter} valueStyle={{ color: '#FF9800' }} />
                </Card>
                <Card bordered={false} style={{ width: '15rem', justifyContent: 'center' }}>
                    <Statistic title="Total AnsweredRequests" value={requestsInfo['answered_requests']} formatter={formatter} valueStyle={{ color: '#4CAF50' }} />
                </Card>
            </div>

            {
                mirthChannels &&
                <div>
                    <Title level={2}>Mirth Channels</Title>
                    {
                        mirthChannels.some(channel => channel.state === 'not found') &&
                        <Paragraph style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Tag color='warning'>HL7 Mapper Channel was not found. This channel is essential to run HL7 requests through the system.</Tag>
                            <Link to={'/channels'}>
                                <Button type='primary'>Configure Channels</Button>
                            </Link>
                        </Paragraph>
                    }
                    <Table dataSource={mirthChannels} columns={mirth_columns} />
                </div>

            }

            <Title level={2}>Model Requests</Title>
            <Table dataSource={requestsInfoByModel} columns={columns} />

            <Title level={2}>Models Configuration</Title>
            <Table dataSource={modelConfigs} columns={columns_configs} />

            <Title level={2}>Client Issues</Title>
            <Table dataSource={issueInfobyClient} columns={issue_columns} />
        </>
    )
}

export default Dashboard
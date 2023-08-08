import React, { useEffect, useState } from 'react'
import axios from 'axios'
import endpoints from '../../Components/config/endpoints.json'
import { Card, Typography, Statistic, Table, Button } from 'antd';
import CountUp from 'react-countup';

const app_env = process.env.REACT_APP_ENV
const mysql_endpoint = process.env.REACT_APP_MYSQL_SERVICE_ENDPOINT
const { Title } = Typography;
const formatter = (value) => <CountUp end={value} separator="," />;

const Dashboard = () => {
    const [requestData, setRequestData] = useState()
    const [requestDataByModel, setRequestDataByModel] = useState()
    const [issuesInfo, setIssuesInfo] = useState()

    const GetRequestsInfo = async () => {
        const url = `${mysql_endpoint}/auth/requests-info`
        const method = 'get'
        const headers = {
            'session-token': localStorage.getItem('session-token')
        }
        const config = { method, url, headers }
        const response = await axios(config)
        setRequestData(response.data)
    }

    const GetRequestsInfoByModel = async () => {
        const url = `${mysql_endpoint}/auth/requests-info-by-model`
        const method = 'get'
        const headers = {
            'session-token': localStorage.getItem('session-token')
        }
        const config = { method, url, headers }
        const response = await axios(config)
        setRequestDataByModel(response.data)
    }

    const GetIssuesInfo = async () => {
        const url = `${mysql_endpoint}/auth/issues-info`
        const method = 'get'
        const headers = {
            'session-token': localStorage.getItem('session-token')
        }
        const config = { method, url, headers }
        const response = await axios(config)
        console.log(response.data)
        setIssuesInfo([response.data])
    }

    useEffect(() => {
        GetRequestsInfo()
        GetRequestsInfoByModel()
        GetIssuesInfo()
    }, [])

    const columns = [
        { title: 'Model Name', dataIndex: 'model_name', key: 'model_name' },
        { title: 'Total Requests', dataIndex: 'total_requests', key: 'total_requests' },
        { title: 'Total Answered Requests', dataIndex: 'answered_requests', key: 'answered_requests' },
        { title: 'Total Unanswered Requests', dataIndex: 'unanswered_requests', key: 'unanswered_requests' },
    ]

    const issue_columns = [
        { title: 'Total Requests', dataIndex: 'open_issues', key: 'open_issues' },
        { title: 'Total Answered Requests', dataIndex: 'closed_issues', key: 'closed_issues' }
    ]

    return (
        <>
            {
                requestData &&
                <>
                    <Title level={2}>Request Information</Title>
                    <div className='req-info-container'>
                        <Card bordered={false} style={{ width: '15rem', justifyContent: 'center' }}>
                            <Statistic title="Total Requests" value={requestData['total_requests']} formatter={formatter} />
                        </Card>
                        <Card bordered={false} style={{ width: '15rem', justifyContent: 'center' }}>
                            <Statistic title="Total Unanswered Requests" value={requestData['unanswered_requests']} formatter={formatter} valueStyle={{ color: '#FF9800' }} />
                        </Card>
                        <Card bordered={false} style={{ width: '15rem', justifyContent: 'center' }}>
                            <Statistic title="Total AnsweredRequests" value={requestData['answered_requests']} formatter={formatter} valueStyle={{ color: '#4CAF50' }} />
                        </Card>
                    </div>

                    <Title level={2}>Requests By Model</Title>
                    <Table dataSource={requestDataByModel} columns={columns} />

                    <Title level={2}>Issues</Title>
                    <Table dataSource={issuesInfo} columns={issue_columns} />
                </>
            }
        </>
    )
}

export default Dashboard
import React from 'react'
import { Card, Typography, Statistic } from 'antd';
import CountUp from 'react-countup';

import './index.css'
const formatter = (value) => <CountUp end={value} separator="," />;

const { Title } = Typography;

const Dashboard = () => {
    return (
        <>
            <Title level={2}>Request Information</Title>
            <div className='req-info-container'>
                <Card bordered={false} style={{ width: '15rem', justifyContent: 'center' }}>
                    <Statistic title="Total Requests" value={10000} formatter={formatter} />
                </Card>
                <Card bordered={false} style={{ width: '15rem', justifyContent: 'center' }}>
                    <Statistic title="Total Unanswered Requests" value={10000} formatter={formatter} valueStyle={{ color: '#FF9800' }} />
                </Card>
                <Card bordered={false} style={{ width: '15rem', justifyContent: 'center' }}>
                    <Statistic title="Total AnsweredRequests" value={10000} formatter={formatter} valueStyle={{ color: '#4CAF50' }}/>
                </Card>
            </div>

            <Title level={2}>Requests by Model</Title>

            <Title level={2}>Requests Over Time</Title>
        </>
    )
}

export default Dashboard
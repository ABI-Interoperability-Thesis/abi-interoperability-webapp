import React from 'react'
import { Card, Typography } from 'antd'
import './index.css'

const { Title } = Typography;

const Dashboard = () => {
    return (
        <>
        <Title level={2}>Request Information</Title>
            <div className='req-info-container'>
                <Card title="Total Requests" bordered={false} style={{ width: '15rem', justifyContent: 'center' }}>
                    <Title level={3}>10000</Title>
                </Card>
                <Card title="Pending Requests" bordered={false} style={{ width: '15rem', justifyContent: 'center' }}>
                    <Title level={3}>10000</Title>
                </Card>
                <Card title="Answered Requests" bordered={false} style={{ width: '15rem', justifyContent: 'center' }}>
                    <Title level={3}>10000</Title>
                </Card>
                <Card title="Errored Requests" bordered={false} style={{ width: '15rem', justifyContent: 'center' }}>
                    <Title level={3}>10000</Title>
                </Card>
            </div>

            <Title level={2}>Requests by Model</Title>

            <Title level={2}>Requests Over Time</Title>
        </>
    )
}

export default Dashboard
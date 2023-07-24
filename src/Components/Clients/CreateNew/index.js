import React from 'react'
import { Button, Typography, Form, Input } from 'antd'
import axios from 'axios'

const { Title } = Typography

const CreateNewClient = (props) => {
    const setCreateNew = props.setCreateNew
    const mysql_endpoint = props.mysql_endpoint
    const notificationApi = props.notificationApi
    const GetAllClients = props.GetAllClients

    const onFinish = async (values) => {
        const data = values
        const url = `${mysql_endpoint}/api/clients`
        const method = 'post'
        const config = { method, url, data }
        const axios_response = await axios(config)


        axios_response.status === 200 ? notificationApi.success({
            message: `Client ${data.name} created successfully`,
            description: 'The Client was created successfully'
        }) : notificationApi.error({
            message: `Client ${data.name} could not be created`,
            description: 'The Client was not created successfully. There was an error'
        })
        setCreateNew(false)
        GetAllClients()

    }
    return (
        <>
            <Title level={2}>New Client</Title>
            <Form onFinish={onFinish}>

                <Form.Item label="Client Name" name='name'>
                    <Input placeholder="Client name" />
                </Form.Item>

                <Form.Item label="Email" name='email'>
                    <Input placeholder="Client email" />
                </Form.Item>

                <Form.Item label="Contact" name='phone'>
                    <Input placeholder="Client contact" />
                </Form.Item>

                <Form.Item label="Password" name='password'>
                    <Input.Password placeholder="Client contact" />
                </Form.Item>


                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Button type="primary" htmlType="submit" style={{ backgroundColor: '#4CAF50' }} >Create Client</Button>
                    <Button type='primary' style={{ backgroundColor: '#F44336' }} onClick={() => setCreateNew(false)} >Cancel</Button>
                </div>
            </Form>
        </>
    )
}

export default CreateNewClient
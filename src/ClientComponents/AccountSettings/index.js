import React, { useState } from 'react';
import endpoints from '../../Components/config/endpoints.json'
import { Table, Button, Popconfirm, Typography, Input, Card } from 'antd'
import axios from 'axios'
const { Paragraph, Title } = Typography;

const app_env = process.env.REACT_APP_ENV
const mysql_endpoint = endpoints['mysql-ws'][app_env]


const AccountSettings = () => {
    const [clientToken, setClientToken] = useState();
    const [createNew, setCreateNew] = useState(false)
    const [testingToken, setTestingToken] = useState()

    const GenerateToken = async () => {
        const url = `${mysql_endpoint}/auth/generate-token`
        const method = 'get'
        const headers = {
            'session-token': localStorage.getItem('session-token')
        }
        const config = { method, url, headers }
        const response = await axios(config)
        setClientToken(response.data)
    }

    const CheckIfTokenIsValid = async () => {
        console.log(testingToken)
        const url = `${mysql_endpoint}/auth/is-logged-in`
        const method = 'get'
        const headers = {
            'session-token': testingToken
        }

        const config = { method, url, headers }

        const axios_response = await axios(config)
        const res_data = axios_response.data
        console.log(res_data)

        if (res_data.status === 200) {
            alert('Token Valid')
        } else {
            alert('Token Not Valid')
        }
    }

    return (
        <>
            <Title level={2}>Account Settings</Title>
            <Card title={<Title level={3}>Token Generation</Title>}>
                <p>Generate a unique to use the ABI Interoperability web API and integrate our services in your processes.</p>
                <Button type='primary' onClick={GenerateToken}>Generate Token</Button>
                {
                    clientToken &&
                    <>
                        <Paragraph>
                            <pre><Paragraph copyable>{clientToken.token}</Paragraph></pre>
                        </Paragraph>
                        <p>Please copy and store this token as it won't be available to access again!</p>
                    </>
                }
            </Card>

            <Card style={{ marginTop: '1.5rem' }} title={<Title level={3}>Token Validation</Title>}>
                <div>
                    <p>Validate your existing tokens for API usage.</p>
                    <Input placeholder='Token' onChange={(event) => setTestingToken(event.target.value)} />
                    <Button style={{ marginTop: '1rem' }} type='primary' onClick={CheckIfTokenIsValid}>Validate Token</Button>
                </div>
            </Card>
        </>
    )
}

export default AccountSettings
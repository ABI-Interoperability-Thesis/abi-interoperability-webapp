import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, Link, useNavigate } from 'react-router-dom';
import endpoints from '../../Components/config/endpoints.json'
import { Typography } from 'antd';
import AttributeCard from './AttributeCard/index'
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons'

const { Title, Paragraph } = Typography

const app_env = process.env.REACT_APP_ENV
const mysql_endpoint = endpoints['mysql-ws'][app_env]

const ModelDetails = () => {
    const { model_id } = useParams();

    const [modelData, setModelData] = useState()


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

    useEffect(() => {
        GetModelDetails()
    }, [])


    return (
        <>
            {
                modelData &&
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <Title style={{ margin: 0 }} level={3}>Model Name</Title>
                        <Paragraph>
                            <pre style={{ margin: 0 }}>{modelData['model']['model_name']}</pre>
                        </Paragraph>
                    </div>

                    <div style={{ display: "flex", gap: "1rem" }}>
                        <Title style={{ margin: 0 }} level={3}>Model Description</Title>
                        <Paragraph>
                            <pre style={{ margin: 0 }}>{modelData['model']['description']}</pre>
                        </Paragraph>
                    </div>

                    <div style={{ display: "flex", gap: "1rem" }}>
                        <Title style={{ margin: 0 }} level={3}>Attribute Number</Title>
                        <Paragraph>
                            <pre style={{ margin: 0 }}>{modelData['model']['attribute_count']}</pre>
                        </Paragraph>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Title level={3} style={{ margin: 0, padding: 0 }}>Model Access</Title>
                        {modelData.client_permission ? <CheckCircleFilled style={{ fontSize: '1.5rem', color: '#4CAF50' }} /> : <CloseCircleFilled style={{ fontSize: '1.5rem', color: '#FF9800' }} />}
                    </div>

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
}

export default ModelDetails
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom';
import axios from 'axios'
import endpoints from '../config/endpoints.json'
import { Button, Typography, Collapse } from 'antd'
import './index.css'
const { Title } = Typography;
const { Panel } = Collapse;

const app_env = process.env.REACT_APP_ENV
const mysql_endpoint = endpoints['mysql-ws'][app_env]

const ModelDetails = () => {
    const { model_id } = useParams();
    const [modelData, setModelData] = useState({});
    const [modelAttributes, setModelAttributes] = useState([]);

    const GetModel = async () => {
        const url = `${mysql_endpoint}/api/models/${model_id}`
        const response = await axios.get(url)
        setModelData(response.data)
    }

    const GetModelAttributes = async () => {
        const url = `${mysql_endpoint}/api/model-attributes/${model_id}`
        const response = await axios.get(url)
        setModelAttributes(response.data)
    }

    useEffect(() => {
        GetModel()
        GetModelAttributes()
    }, []);
    return (
        <>
            <Title level={2}>{modelData.model_name}</Title>
            <div className='model-header'>
                <Title level={3} style={{padding: 0, margin: 0}}>Deployed: {modelData.deployed}</Title>
                <Title level={3} style={{padding: 0, margin: 0}}>Attributes: {modelData.attribute_count}</Title>
            </div>
            <Title level={4} style={{fontWeight:'normal'}}>{modelData.description}</Title>

            <Title level={3}>Model Attributes</Title>

            <Collapse bordered={false} defaultActiveKey={['0']}>
                {
                    modelAttributes.map((model_attribute, index) => (
                        <Panel header={model_attribute.name} key={index}>
                            <div>{model_attribute.description}</div>
                            <div>{model_attribute.type} variable</div>
                        </Panel>
                    ))
                }
            </Collapse>
            <Link to='/models'>
                <Button type='primary' style={{ backgroundColor: '#F44336', marginTop: '1rem' }}>Back to Models</Button>
            </Link>
        </>
    )
}

export default ModelDetails
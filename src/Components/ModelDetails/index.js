import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import endpoints from '../config/endpoints.json'
import { Button, Typography, Collapse, Modal, Tabs } from 'antd'
import './index.css'
import ModelFeatures from './ModelFeatures';

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

const app_env = process.env.REACT_APP_ENV
const mysql_endpoint = endpoints['mysql-ws'][app_env]

const ModelDetails = () => {
    const { model_id } = useParams();
    const navigate = useNavigate();
    const [modelData, setModelData] = useState({});
    const [modelAttributes, setModelAttributes] = useState([]);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [mappingsCheck, setMappingsCheck] = useState(false);

    const GetModel = async () => {
        const url = `${mysql_endpoint}/api/models/${model_id}`
        const response = await axios.get(url)
        setModelData(response.data)
    }

    useEffect(() => {
        GetModel()
    }, []);

    const DeleteModel = async () => {
        const url = `${mysql_endpoint}/api/models/${modelData.model_id}`
        const method = 'delete'
        const config = { method, url }
        const axios_response = await axios(config)
        setConfirmVisible(false)
        navigate('/models')
    }
    return (
        <>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                <Title level={2} style={{ margin: 0, padding: 0 }}>{modelData.model_name}</Title>
                <Button danger onClick={() => setConfirmVisible(true)}>Delete</Button>
            </div>
            <div className='model-header'>
                <Paragraph>
                    <pre>{modelData.description}</pre>
                </Paragraph>
                <Title level={3} style={{ padding: 0, margin: 0 }}>Attributes: {modelData.attribute_count}</Title>
            </div>

            <ModelFeatures model={modelData.model_name} model_id={model_id} />

            <Link to='/models'>
                <Button type='primary' style={{ backgroundColor: '#F44336', marginTop: '1rem' }}>Back to Models</Button>
            </Link>

            <Modal
                title="Are you sure you want to delete this model?"
                visible={confirmVisible}
                onCancel={() => setConfirmVisible(false)}
                onOk={DeleteModel}
                okText="Yes"
                cancelText="No"
            >
                <p>This action is permanent you will not be able to recover this information</p>
            </Modal>
        </>
    )
}

export default ModelDetails
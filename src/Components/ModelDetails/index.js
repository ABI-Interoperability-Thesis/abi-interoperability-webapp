import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import endpoints from '../config/endpoints.json'
import { Button, Typography, Collapse, Modal, Tag, Descriptions } from 'antd'
import './index.css'
import ModelFeatures from './ModelFeatures';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons'
import { LoadingOutlined } from '@ant-design/icons';
import Loading from '../../Common/Loading';

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

const app_env = process.env.REACT_APP_ENV
const mysql_endpoint = process.env.REACT_APP_MYSQL_SERVICE_ENDPOINT

const ModelDetails = () => {
    const { model_id } = useParams();
    const navigate = useNavigate();
    const [modelData, setModelData] = useState({});
    const [modelAttributes, setModelAttributes] = useState([]);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [mappingsCheck, setMappingsCheck] = useState(false);
    const [deployModalOpen, setDeployModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [loading, setLoading] = useState(true);
    const [canDeploy, setCanDeploy] = useState();

    const GetModel = async () => {
        const url = `${mysql_endpoint}/api/models/${model_id}`
        const response = await axios.get(url)
        setLoading(false)
        setModelData(response.data)
    }

    const UndeployModel = async () => {
        const url = `${mysql_endpoint}/api/undeploy-model/${model_id}`
        const method = 'put'
        const config = { method, url }
        const axios_response = await axios(config)
        const req_data = axios_response.data
        GetModel()
    }

    const DeployModel = async () => {
        const url = `${mysql_endpoint}/api/deploy-model/${model_id}`
        const method = 'put'
        const config = { method, url }
        const axios_response = await axios(config)
        const req_data = axios_response.data
        if (req_data.status !== 200) { setErrorMessage(req_data); setDeployModalOpen(true) }
        GetModel()
    }

    const GetModelConfigs = async () => {
        const url = `${mysql_endpoint}/api/model-config/${model_id}`
        const response = await axios.get(url)
        setLoading(false)
        setCanDeploy(response.data)
    }

    useEffect(() => {
        GetModelConfigs()
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
            {
                loading ?
                    (<Loading />)
                    :
                    (
                        <>
                            {modelData.model_type}
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Title level={2}>Model Details</Title>
                                <Button danger onClick={() => setConfirmVisible(true)}>Delete</Button>
                            </div>
                            <Descriptions column={1} bordered>
                                <Descriptions.Item label='Model Name'>{modelData.model_name}</Descriptions.Item>
                                <Descriptions.Item label='Model Description'>{modelData.description}</Descriptions.Item>
                                <Descriptions.Item label='Model Type'>{modelData.model_type}</Descriptions.Item>
                                <Descriptions.Item label='Attribute Number'>{modelData.attribute_count}</Descriptions.Item>
                                <Descriptions.Item label='Deployed'>
                                    {modelData.deployed ? <CheckCircleFilled style={{ fontSize: '1.5rem', color: '#4CAF50' }} /> : <CloseCircleFilled style={{ fontSize: '1.5rem', color: '#FF9800' }} />}
                                </Descriptions.Item>
                            </Descriptions>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Title style={{ margin: 0 }} level={3}>Model Attributes</Title>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    {
                                        canDeploy && !modelData.deployed &&
                                        <Tag color='success'>Model is ready to Deploy</Tag>
                                    }

                                    {
                                        !canDeploy && !modelData.deployed &&
                                        <Tag color='error'>Model is not ready to Deploy</Tag>
                                    }

                                    <div className='model-header'>

                                        {
                                            modelData.deployed ?
                                                (<Button type='primary' style={{ backgroundColor: '#F44336' }} onClick={UndeployModel}>Undeploy Model</Button>)
                                                :
                                                (<Button type='primary' onClick={DeployModel}>Deploy Model</Button>)
                                        }
                                    </div>
                                </div>
                            </div>

                            <ModelFeatures GetModelConfigs={GetModelConfigs} deployed={modelData.deployed} model={modelData.model_name} model_id={model_id} />

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

                            {/* Modal for Deploy error message */}
                            <Modal title="Error while deploying Model" open={deployModalOpen} onOk={() => setDeployModalOpen(false)} onCancel={() => setDeployModalOpen(false)}>
                                {
                                    errorMessage && (
                                        <>
                                            <div>
                                                {
                                                    errorMessage['valid_mappings'] === false ? 'Default Mappings are not well configured' : ('')
                                                }
                                            </div>
                                            <div>
                                                {
                                                    errorMessage['valid_preprocessors'] === false ? 'Preprocessores are not well configured' : ('')
                                                }
                                            </div>
                                            <div>
                                                {
                                                    errorMessage['valid_validations'] === false ? 'Validations are not well configured' : ('')
                                                }
                                            </div>
                                        </>
                                    )
                                }
                            </Modal>
                        </>
                    )
            }
        </>
    )
}

export default ModelDetails
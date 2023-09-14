import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import endpoints from '../config/endpoints.json'
import { Button, Typography, Collapse, Modal, Tag, Descriptions, Switch, notification, Tabs } from 'antd'
import './index.css'
import ModelFeatures from './ModelFeatures';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons'
import { LoadingOutlined } from '@ant-design/icons';
import Loading from '../../Common/Loading';
import TestModelComponent from '../../ClientComponents/ModelDetails/TestModel'

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
    const [fhirDeploy, setFhirDeploy] = useState(false);
    const [hl7Deploy, setHl7Deploy] = useState(false);

    const [api, contextHolder] = notification.useNotification();


    const GetModel = async () => {
        const url = `${mysql_endpoint}/api/models/${model_id}`
        const response = await axios.get(url)

        console.log(response.data)

        setHl7Deploy(response.data.hl7_support === 1 ? true : false)
        setFhirDeploy(response.data.fhir_support === 1 ? true : false)
        setModelData(response.data)
        setLoading(false)
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
        console.log(hl7Deploy)
        console.log(fhirDeploy)
        const url = `${mysql_endpoint}/api/deploy-model/${model_id}`
        const data = {
            hl7_support: hl7Deploy,
            fhir_support: fhirDeploy
        }
        const method = 'put'
        const config = { method, url, data }

        try {
            const axios_response = await axios(config)
            if (axios_response.status === 200) {
                api.success({
                    message: 'Success',
                    description: axios_response.data.message
                })
            }
        } catch (error) {
            api.error({
                message: `Error [Status Code - ${error.response.status}]`,
                description: error.response.data.message
            })
        }
        GetModel()
    }

    const GetModelConfigs = async () => {
        const url = `${mysql_endpoint}/api/model-config/${model_id}`
        const response = await axios.get(url)
        setLoading(false)
        setCanDeploy(response.data)

        if (response.data.configured_hl7 === false) {
            setHl7Deploy(false)
        }

        if (response.data.configured_fhir === false) {
            setFhirDeploy(false)
        }
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

    const GenerateTabs = () => {
        let tabs = []
        tabs.push({
            key: '1',
            label: 'Model Interoperability Configuration',
            children: <ModelFeatures GetModelConfigs={GetModelConfigs} deployed={modelData.deployed} model={modelData.model_name} model_id={model_id} />
        })

        if (modelData.deployed === 1) {
            tabs.push({
                key: '2',
                label: 'Test this model',
                children: <TestModelComponent model_name={modelData['model_name']} endpoint={mysql_endpoint} hl7_support={modelData['hl7_support'] === 1 ? true : false} fhir_support={modelData['fhir_support'] === 1 ? true : false} />
            })
        }
        return tabs
    }

    return (
        <>
            {
                loading ?
                    (<Loading />)
                    :
                    (
                        <>
                            {contextHolder}
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

                                <Descriptions.Item label='Source Support'>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        {
                                            modelData.hl7_support === 1 &&
                                            <Tag color='geekblue'>HL7</Tag>
                                        }

                                        {
                                            modelData.fhir_support === 1 &&
                                            <Tag color='geekblue'>FHIR</Tag>
                                        }

                                        {
                                            modelData.fhir_support === 0 && modelData.hl7_support === 0 &&
                                            <Tag color='geekblue'>No Support</Tag>
                                        }
                                    </div>
                                </Descriptions.Item>
                            </Descriptions>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Title style={{ margin: 0 }} level={3}>Model Attributes</Title>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

                                    {
                                        canDeploy &&
                                        <div>
                                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <p>HL7 Support</p>
                                                <Switch
                                                    checked={hl7Deploy}
                                                    checkedChildren="Enabled"
                                                    unCheckedChildren="Disabled"
                                                    onChange={() => {
                                                        setHl7Deploy(!hl7Deploy);
                                                    }}
                                                    disabled={!canDeploy['configured_hl7']}
                                                />
                                            </div>

                                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <p>FHIR Support</p>
                                                <Switch
                                                    checked={fhirDeploy}
                                                    checkedChildren="Enabled"
                                                    unCheckedChildren="Disabled"
                                                    onChange={() => {
                                                        setFhirDeploy(!fhirDeploy);
                                                    }}
                                                    disabled={!canDeploy['configured_fhir']}
                                                />
                                            </div>
                                        </div>
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

                            <Tabs items={GenerateTabs()} />


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
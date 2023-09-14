import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Typography, Modal, Button, Form, Select, Input, Tabs, Descriptions, Tag } from 'antd'

const { Paragraph, Title } = Typography
const { TextArea } = Input

const AttributePreprocessor = (props) => {
    const model_id = props.model_id
    const model = props.model
    const attribute_name = props.attribute_name
    const endpoint = props.endpoint
    const openNotification = props.openNotification
    const deployed = props.deployed
    const GetModelConfigs = props.GetModelConfigs


    const [preprocessor, setPreprocessor] = useState()
    const [edit, setEdit] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [preprocessingName, setPreprocessingName] = useState()
    const [preprocessingScript, setPreprocessingScript] = useState()
    const [description, setDescription] = useState()
    const [docDescription, setDocDescription] = useState()
    const [preprocessingOptions, setPreprocessingOptions] = useState()

    // FHIR Data
    const [preprocessorFhir, setPreprocessorFhir] = useState()
    const [isModalOpenFhir, setIsModalOpenFhir] = useState(false);
    const [preprocessingNameFhir, setPreprocessingNameFhir] = useState()
    const [preprocessingScriptFhir, setPreprocessingScriptFhir] = useState()
    const [descriptionFhir, setDescriptionFhir] = useState()
    const [docDescriptionFhir, setDocDescriptionFhir] = useState()
    const [preprocessingOptionsFhir, setPreprocessingOptionsFhir] = useState()


    const CheckPreprocessor = async () => {
        const config = {
            method: 'get',
            url: `${endpoint}/api/model-preprocessors/${model_id}/${attribute_name}?source_type=hl7`,
        };

        const axios_response = await axios(config)
        const data = axios_response.data

        if (data.status === 200) {
            setPreprocessor(data.preprocessor)
            console.log(data)
        }
    }

    const CheckPreprocessorFhir = async () => {
        const config = {
            method: 'get',
            url: `${endpoint}/api/model-preprocessors/${model_id}/${attribute_name}?source_type=fhir`,
        };

        const axios_response = await axios(config)
        const data = axios_response.data

        if (data.status === 200) {
            setPreprocessorFhir(data.preprocessor)
        }else{
            setPreprocessorFhir()
        }
    }

    const setEditMode = () => {
        setEdit(true)
    }

    const DeletePreprocessor = async () => {
        if (!deployed) {
            const processing_id = preprocessor.preprocessor_id

            const config = {
                method: 'delete',
                url: `${endpoint}/api/model-preprocessors/${processing_id}`
            }

            await axios(config)
            setPreprocessor()
            CheckPreprocessor()
            GetModelConfigs()
        } else {
            const message = 'Unable to Delete Preprocessor!'
            const description = 'While the model is deployed Preprocessors cannot be deleted.'
            openNotification(message, description)
        }
    }

    const DeletePreprocessorFhir = async () => {
        if (!deployed) {
            const processing_id = preprocessorFhir.preprocessor_id

            const config = {
                method: 'delete',
                url: `${endpoint}/api/model-preprocessors/${processing_id}`
            }

            await axios(config)
            setPreprocessingNameFhir()
            CheckPreprocessorFhir()
            GetModelConfigs()
        } else {
            const message = 'Unable to Delete Preprocessor!'
            const description = 'While the model is deployed Preprocessors cannot be deleted.'
            openNotification(message, description)
        }
    }

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const showModalFhir = () => {
        setIsModalOpenFhir(true);
    };
    const handleOkFhir = () => {
        setIsModalOpenFhir(false);
    };
    const handleCancelFhir = () => {
        setIsModalOpenFhir(false);
    };

    useEffect(() => {
        CheckPreprocessor()
        CheckPreprocessorFhir()
        GetPreprocessorOptions()
    }, [])

    const CreatePreprocessor = async (values) => {
        const req_data = {
            model_id: model_id,
            model_name: model,
            source_type: 'hl7',
            field: attribute_name,
            preprocessor_name: preprocessingName
        }

        if (preprocessingScript !== undefined) req_data['preprocessor_script'] = preprocessingScript
        if (description !== undefined) req_data['description'] = description
        if (docDescription !== undefined) req_data['doc_description'] = docDescription

        const config = {
            method: 'post',
            url: `${endpoint}/api/model-preprocessors`,
            data: req_data
        }

        const axios_response = await axios(config)
        CheckPreprocessor()
        GetModelConfigs()

    }

    const CreatePreprocessorFhir = async (values) => {
        const req_data = {
            model_id: model_id,
            model_name: model,
            source_type: 'fhir',
            field: attribute_name,
            preprocessor_name: preprocessingNameFhir
        }

        if (preprocessingScriptFhir !== undefined) req_data['preprocessor_script'] = preprocessingScriptFhir
        if (descriptionFhir !== undefined) req_data['description'] = descriptionFhir
        if (docDescriptionFhir !== undefined) req_data['doc_description'] = docDescriptionFhir

        const config = {
            method: 'post',
            url: `${endpoint}/api/model-preprocessors`,
            data: req_data
        }

        await axios(config)
        CheckPreprocessorFhir()
        GetModelConfigs()

    }


    const GetPreprocessorOptions = async () => {
        const config = {
            method: 'get',
            url: `${endpoint}/api/preprocessors`
        }

        const axios_response = await axios(config)

        const treated = axios_response.data.map((item) => {
            return {
                label: item.preprocessor_name,
                value: item.preprocessor_name,
            }
        })

        treated.push({ label: 'custom', value: 'custom' })
        setPreprocessingOptions(treated)
        setPreprocessingOptionsFhir(treated)

    }

    return (
        <>
            <Descriptions column={2} style={{ width: '15rem' }}>
                <Descriptions.Item label='HL7'>
                    {
                        preprocessor ?
                            (<Tag color='green'>OK</Tag>) : (<Tag color='red'>No Data</Tag>)
                    }
                </Descriptions.Item>

                <Descriptions.Item label='FHIR'>
                    {
                        preprocessorFhir ?
                            (<Tag color='green'>OK</Tag>) : (<Tag color='red'>No Data</Tag>)
                    }
                </Descriptions.Item>
            </Descriptions>
            <Tabs items={[
                {
                    key: '1',
                    label: 'HL7 Preprocessor',
                    children: (
                        <>
                            {
                                preprocessor ?
                                    (
                                        <>
                                            <Paragraph>
                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                    <Title style={{ margin: 0 }} level={5}>Preset </Title>
                                                    <pre>{preprocessor.preprocessor_name}</pre>
                                                </div>

                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                    <Title style={{ margin: 0 }} level={5}>Description </Title>
                                                    <pre>{preprocessor.description}</pre>
                                                </div>

                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                    <Title style={{ margin: 0 }} level={5}>Documentation Description </Title>
                                                    <pre>{preprocessor.doc_description}</pre>
                                                </div>

                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
                                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                        <Button type='primary' onClick={setEditMode}>Update</Button>
                                                        <Button danger onClick={DeletePreprocessor}>Delete</Button>
                                                    </div>
                                                    <Button style={{ backgroundColor: '#FFA500' }} type='primary' onClick={showModal}>Inspect Preprocessor Code</Button>
                                                </div>
                                            </Paragraph>
                                            <Modal title="Generated Preprocessing Script" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                                                <Paragraph>
                                                    <pre>{preprocessor.preprocessor_script}</pre>
                                                </Paragraph>
                                            </Modal>
                                        </>
                                    ) :
                                    (
                                        <>
                                            <Title level={5}>It loooks like there isn't any preprocessor for {attribute_name}.</Title>
                                            <Form onFinish={CreatePreprocessor}>
                                                <Form.Item
                                                    label="Preset"
                                                    name="preprocessing_name">
                                                    <Select
                                                        showSearch
                                                        placeholder="Select a Preprocessor"
                                                        options={preprocessingOptions}
                                                        onChange={(value) => { setPreprocessingName(value) }}
                                                    />
                                                </Form.Item>

                                                {
                                                    preprocessingName === 'custom' &&
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                        <TextArea rows={4} placeholder="Write your preprocessor logic here" onChange={(e) => { setPreprocessingScript(e.target.value) }} />
                                                        <TextArea rows={4} placeholder="Write your preprocessor description here" onChange={(e) => { setDescription(e.target.value) }} />
                                                        <TextArea rows={4} placeholder="Write your preprocessor description here" onChange={(e) => { setDocDescription(e.target.value) }} />
                                                    </div>
                                                }
                                                <Button type='primary' htmlType='submit'>Create Preprocessor</Button>
                                            </Form>
                                        </>
                                    )
                            }
                        </>
                    )
                },
                {
                    key: '2',
                    label: 'FHIR Preprocessor',
                    children: (
                        <>
                            {
                                preprocessorFhir ?
                                    (
                                        <>
                                            <Paragraph>
                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                    <Title style={{ margin: 0 }} level={5}>Preset </Title>
                                                    <pre>{preprocessorFhir.preprocessor_name}</pre>
                                                </div>

                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                    <Title style={{ margin: 0 }} level={5}>Description </Title>
                                                    <pre>{preprocessorFhir.description}</pre>
                                                </div>

                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                    <Title style={{ margin: 0 }} level={5}>Documentation Description </Title>
                                                    <pre>{preprocessorFhir.doc_description}</pre>
                                                </div>

                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
                                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                        <Button type='primary' onClick={setEditMode}>Update</Button>
                                                        <Button danger onClick={DeletePreprocessorFhir}>Delete</Button>
                                                    </div>
                                                    <Button style={{ backgroundColor: '#FFA500' }} type='primary' onClick={showModalFhir}>Inspect Preprocessor Code</Button>
                                                </div>
                                            </Paragraph>
                                            <Modal title="Generated Preprocessing Script" open={isModalOpenFhir} onOk={handleOkFhir} onCancel={handleCancelFhir}>
                                                <Paragraph>
                                                    <pre>{preprocessorFhir.preprocessor_script}</pre>
                                                </Paragraph>
                                            </Modal>
                                        </>
                                    ) :
                                    (
                                        <>
                                            <Title level={5}>It loooks like there isn't any preprocessor for {attribute_name}.</Title>
                                            <Form onFinish={CreatePreprocessorFhir}>
                                                <Form.Item
                                                    label="Preset"
                                                    name="preprocessing_name">
                                                    <Select
                                                        showSearch
                                                        placeholder="Select a Preprocessor"
                                                        options={preprocessingOptionsFhir}
                                                        onChange={(value) => { setPreprocessingNameFhir(value) }}
                                                    />
                                                </Form.Item>

                                                {
                                                    preprocessingNameFhir === 'custom' &&
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                        <TextArea rows={4} placeholder="Write your preprocessor logic here" onChange={(e) => { setPreprocessingScriptFhir(e.target.value) }} />
                                                        <TextArea rows={4} placeholder="Write your preprocessor description here" onChange={(e) => { setDescriptionFhir(e.target.value) }} />
                                                        <TextArea rows={4} placeholder="Write your preprocessor description here" onChange={(e) => { setDocDescriptionFhir(e.target.value) }} />
                                                    </div>
                                                }
                                                <Button type='primary' htmlType='submit'>Create Preprocessor</Button>
                                            </Form>
                                        </>
                                    )
                            }
                        </>
                    )
                }
            ]} />
        </>
    )
}

export default AttributePreprocessor
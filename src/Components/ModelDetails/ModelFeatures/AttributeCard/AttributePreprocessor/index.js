import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Typography, Modal, Button, Form, Select, Input } from 'antd'

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


    const CheckPreprocessor = async () => {
        const config = {
            method: 'get',
            url: `${endpoint}/api/model-preprocessors/${model_id}/${attribute_name}`,
        };

        const axios_response = await axios(config)
        const data = axios_response.data

        if (data.status === 200) {
            setPreprocessor(data.preprocessor)
            console.log(data)
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

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        CheckPreprocessor()
        GetPreprocessorOptions()
    }, [])

    const CreatePreprocessor = async (values) => {
        const req_data = {
            model_id: model_id,
            model_name: model,
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

    }

    return (
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
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
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
}

export default AttributePreprocessor
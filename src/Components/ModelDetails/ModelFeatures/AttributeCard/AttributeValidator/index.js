import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Typography, Modal, Button, Form, Select, Input, Tabs, Descriptions, Tag } from 'antd'
const { Paragraph, Title } = Typography
const { TextArea } = Input

const AttributeValidator = (props) => {
    const model_id = props.model_id
    const model = props.model
    const attribute_name = props.attribute_name
    const endpoint = props.endpoint
    const openNotification = props.openNotification
    const deployed = props.deployed
    const GetModelConfigs = props.GetModelConfigs

    const [validator, setValidator] = useState()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [validationName, setValidationName] = useState();
    const [validationOptions, setValidationOptions] = useState()
    const [validationRegex, setValidationRegex] = useState()
    const [description, setDescription] = useState()
    const [docDescription, setDocDescription] = useState()

    // Fhir Data
    const [fhirValidator, setFhirValidator] = useState()
    const [isModalOpenFhir, setIsModalOpenFhir] = useState(false);
    const [validationNameFhir, setValidationNameFhir] = useState();
    const [validationOptionsFhir, setValidationOptionsFhir] = useState()
    const [validationRegexFhir, setValidationRegexFhir] = useState()
    const [descriptionFhir, setDescriptionFhir] = useState()
    const [docDescriptionFhir, setDocDescriptionFhir] = useState()


    const CheckValidator = async () => {
        const config = {
            method: 'get',
            url: `${endpoint}/api/model-validations/${model_id}/${attribute_name}?source_type=hl7`,
        };

        const axios_response = await axios(config)
        const data = axios_response.data


        if (data.status === 200) {
            console.log(data)
            setValidator(data.validations)
        }
    }

    const CheckValidatorFhir = async () => {
        const config = {
            method: 'get',
            url: `${endpoint}/api/model-validations/${model_id}/${attribute_name}?source_type=fhir`,
        };

        const axios_response = await axios(config)
        const data = axios_response.data


        if (data.status === 200) {
            console.log(data)
            setFhirValidator(data.validations)
        }
    }

    const GetValidationOptions = async () => {
        const config = {
            method: 'get',
            url: `${endpoint}/api/validations`
        }

        const axios_response = await axios(config)

        const treated = axios_response.data.map((item) => {
            return {
                label: item.validation_name,
                value: item.validation_name,
            }
        })

        treated.push({ label: 'custom', value: 'custom' })
        setValidationOptions(treated)
        setValidationOptionsFhir(treated)

    }

    useEffect(() => {
        // Check Default Validators
        CheckValidator()
        CheckValidatorFhir()

        GetValidationOptions()
    }, [])

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

    const CreateValidator = async (values) => {
        const req_data = {
            model_id: model_id,
            model_name: model,
            source_type: 'hl7',
            field: attribute_name,
            validation_name: validationName
        }

        if (validationRegex !== undefined) req_data['validation_expression'] = validationRegex
        if (description !== undefined) req_data['description'] = description
        if (docDescription !== undefined) req_data['doc_description'] = docDescription

        const config = {
            method: 'post',
            url: `${endpoint}/api/model-validations`,
            data: req_data
        }

        const axios_response = await axios(config)
        CheckValidator()
        GetModelConfigs()

    }

    const CreateValidatorFhir = async (values) => {
        const req_data = {
            model_id: model_id,
            model_name: model,
            source_type: 'fhir',
            field: attribute_name,
            validation_name: validationNameFhir
        }

        if (validationRegexFhir !== undefined) req_data['validation_expression'] = validationRegexFhir
        if (descriptionFhir !== undefined) req_data['description'] = descriptionFhir
        if (docDescriptionFhir !== undefined) req_data['doc_description'] = docDescriptionFhir

        const config = {
            method: 'post',
            url: `${endpoint}/api/model-validations`,
            data: req_data
        }

        await axios(config)
        CheckValidatorFhir()
        GetModelConfigs()

    }

    const DeleteValidation = async () => {
        if (!deployed) {
            const validation_id = validator.validation_id

            const config = {
                method: 'delete',
                url: `${endpoint}/api/model-validations/${validation_id}`
            }

            await axios(config)
            setValidator()
            CheckValidator()
            GetModelConfigs()
        } else {
            const message = 'Unable to Delete Validator!'
            const description = 'While the model is deployed Validators cannot be deleted.'
            openNotification(message, description)
        }

    }

    const DeleteFhirValidation = async () => {
        if (!deployed) {
            const validation_id = fhirValidator.validation_id

            const config = {
                method: 'delete',
                url: `${endpoint}/api/model-validations/${validation_id}`
            }

            await axios(config)
            setFhirValidator()
            CheckValidatorFhir()
            GetModelConfigs()
        } else {
            const message = 'Unable to Delete Validator!'
            const description = 'While the model is deployed Validators cannot be deleted.'
            openNotification(message, description)
        }

    }

    return (
        <>
            <Descriptions column={2} style={{ width: '15rem' }}>
                <Descriptions.Item label='HL7'>
                    {
                        validator ?
                            (<Tag color='green'>OK</Tag>) : (<Tag color='red'>No Data</Tag>)
                    }
                </Descriptions.Item>

                <Descriptions.Item label='FHIR'>
                    {
                        fhirValidator ?
                            (<Tag color='green'>OK</Tag>) : (<Tag color='red'>No Data</Tag>)
                    }
                </Descriptions.Item>
            </Descriptions>
            <Tabs items={[
                {
                    key: '1',
                    label: 'HL7 Validator',
                    children: (
                        <>
                            {
                                validator ?
                                    (
                                        <>
                                            <Paragraph>
                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                    <Title style={{ margin: 0 }} level={5}>Preset </Title>
                                                    <pre>{validator.validation_name}</pre>
                                                </div>

                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                    <Title style={{ margin: 0 }} level={5}>Description </Title>
                                                    <pre>{validator.description}</pre>
                                                </div>

                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                    <Title style={{ margin: 0 }} level={5}>Documentation Description</Title>
                                                    <pre>{validator.doc_description}</pre>
                                                </div>

                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
                                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                        <Button type='primary'>Update</Button>
                                                        <Button danger onClick={DeleteValidation}>Delete</Button>
                                                    </div>
                                                    <Button style={{ backgroundColor: '#FFA500' }} type='primary' onClick={showModal}>Inspect General Expression</Button>
                                                </div>
                                            </Paragraph>

                                            <Modal title="Generated Preprocessing Script" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                                                <Paragraph>
                                                    <pre>{validator.validation_expression}</pre>
                                                </Paragraph>
                                            </Modal>
                                        </>
                                    ) :
                                    (
                                        <>
                                            <Title level={5}>It loooks like there isn't any validator for {attribute_name}.</Title>
                                            <Form onFinish={CreateValidator}>
                                                <Form.Item
                                                    label="Validator Preset"
                                                    name="validation_name">
                                                    <Select
                                                        showSearch
                                                        placeholder="Select a Validator"
                                                        options={validationOptions}
                                                        onChange={(value) => { setValidationName(value) }}
                                                    />
                                                </Form.Item>

                                                {
                                                    validationName === 'custom' &&
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                        <TextArea rows={4} placeholder="Write your validation Regular Expression here" onChange={(e) => { setValidationRegex(e.target.value) }} />
                                                        <TextArea rows={4} placeholder="Write your validation Regular Expression description here" onChange={(e) => { setDescription(e.target.value) }} />
                                                        <TextArea rows={4} placeholder="Write your validation Regular Expression description here" onChange={(e) => { setDocDescription(e.target.value) }} />
                                                    </div>
                                                }
                                                <Button type='primary' htmlType='submit'>Create Validator</Button>
                                            </Form>
                                        </>
                                    )

                            }
                        </>
                    )
                },
                {
                    key: '2',
                    label: 'FHIR Validator',
                    children: (
                        <>
                            {
                                fhirValidator ?
                                    (
                                        <>
                                            <Paragraph>
                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                    <Title style={{ margin: 0 }} level={5}>Preset </Title>
                                                    <pre>{fhirValidator.validation_name}</pre>
                                                </div>

                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                    <Title style={{ margin: 0 }} level={5}>Description </Title>
                                                    <pre>{fhirValidator.description}</pre>
                                                </div>

                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                    <Title style={{ margin: 0 }} level={5}>Documentation Description</Title>
                                                    <pre>{fhirValidator.doc_description}</pre>
                                                </div>

                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
                                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                        <Button type='primary'>Update</Button>
                                                        <Button danger onClick={DeleteFhirValidation}>Delete</Button>
                                                    </div>
                                                    <Button style={{ backgroundColor: '#FFA500' }} type='primary' onClick={showModalFhir}>Inspect General Expression</Button>
                                                </div>
                                            </Paragraph>

                                            <Modal title="Generated Preprocessing Script" open={isModalOpenFhir} onOk={handleOkFhir} onCancel={handleCancelFhir}>
                                                <Paragraph>
                                                    <pre>{fhirValidator.validation_expression}</pre>
                                                </Paragraph>
                                            </Modal>
                                        </>
                                    ) :
                                    (
                                        <>
                                            <Title level={5}>It loooks like there isn't any validator for {attribute_name}.</Title>
                                            <Form onFinish={CreateValidatorFhir}>
                                                <Form.Item
                                                    label="Validator Preset"
                                                    name="validation_name">
                                                    <Select
                                                        showSearch
                                                        placeholder="Select a Validator"
                                                        options={validationOptionsFhir}
                                                        onChange={(value) => { setValidationNameFhir(value) }}
                                                    />
                                                </Form.Item>

                                                {
                                                    validationNameFhir === 'custom' &&
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                        <TextArea rows={4} placeholder="Write your validation Regular Expression here" onChange={(e) => { setValidationRegexFhir(e.target.value) }} />
                                                        <TextArea rows={4} placeholder="Write your validation Regular Expression description here" onChange={(e) => { setDescriptionFhir(e.target.value) }} />
                                                        <TextArea rows={4} placeholder="Write your validation Regular Expression description here" onChange={(e) => { setDocDescriptionFhir(e.target.value) }} />
                                                    </div>
                                                }
                                                <Button type='primary' htmlType='submit'>Create Validator</Button>
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

export default AttributeValidator
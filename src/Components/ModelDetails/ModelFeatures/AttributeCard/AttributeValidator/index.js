import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Typography, Modal, Button, Form, Select, Input } from 'antd'
const { Paragraph, Title } = Typography
const { TextArea } = Input

const AttributeValidator = (props) => {
    const model_id = props.model_id
    const model = props.model
    const attribute_name = props.attribute_name
    const endpoint = props.endpoint

    const [validator, setValidator] = useState()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [validationName, setValidationName] = useState();
    const [validationOptions, setValidationOptions] = useState()
    const [validationRegex, setValidationRegex] = useState()
    const [description, setDescription] = useState()



    const CheckValidator = async () => {
        const config = {
            method: 'get',
            url: `${endpoint}/api/model-validations/${model_id}/${attribute_name}`,
        };

        const axios_response = await axios(config)
        const data = axios_response.data


        if (data.status === 200) {
            console.log(data)
            setValidator(data.validations)
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

    }

    useEffect(() => {
        CheckValidator()
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

    const CreateValidator = async (values) => {
        const req_data = {
            model_id: model_id,
            model_name: model,
            field: attribute_name,
            validation_name: validationName
        }

        if (validationRegex !== undefined) req_data['validation_expression'] = validationRegex
        if (description !== undefined) req_data['description'] = description

        const config = {
            method: 'post',
            url: `${endpoint}/api/model-validations`,
            data: req_data
        }

        const axios_response = await axios(config)
        CheckValidator()

    }

    const DeleteValidation = async () => {
        const validation_id = validator.validation_id

        const config ={ 
            method: 'delete',
            url: `${endpoint}/api/model-validations/${validation_id}`
        }

        await axios(config)
        setValidator()
        CheckValidator()


    }

    return (
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
                            <Title level={5}>It loooks like there isn't any preprocessor for {attribute_name}.</Title>
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
                                    <>
                                        <TextArea rows={4} placeholder="Write your validation Regular Expression here" onChange={(e) => { setValidationRegex(e.target.value) }} />
                                        <TextArea rows={4} placeholder="Write your validation Regular Expression description here" onChange={(e) => { setDescription(e.target.value) }} />
                                    </>
                                }
                                <Button type='primary' htmlType='submit'>Create Preprocessor</Button>
                            </Form>
                        </>
                    )

            }
        </>
    )
}

export default AttributeValidator
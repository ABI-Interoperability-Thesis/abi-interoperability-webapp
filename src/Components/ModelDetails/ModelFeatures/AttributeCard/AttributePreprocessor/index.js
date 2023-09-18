import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Typography, Modal, Button, Form, Select, Input, Tabs, Descriptions, Tag, Divider } from 'antd'
import MonacoEditor from 'react-monaco-editor';

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
    const [hl7Preprocessors, setHl7Preprocessors] = useState()
    const [hl7SelectedPreprocessor, setHl7SelectedPreprocessor] = useState()
    const [showModalHL7Script, setShowModalHL7Script] = useState(false)
    const [hL7TestInputData, setHL7TestInputData] = useState()
    const [hl7TestingReponse, setHL7TestingReponse] = useState()


    // FHIR Data
    const [preprocessorFhir, setPreprocessorFhir] = useState()
    const [isModalOpenFhir, setIsModalOpenFhir] = useState(false);
    const [preprocessingNameFhir, setPreprocessingNameFhir] = useState()
    const [preprocessingScriptFhir, setPreprocessingScriptFhir] = useState()
    const [descriptionFhir, setDescriptionFhir] = useState()
    const [docDescriptionFhir, setDocDescriptionFhir] = useState()
    const [preprocessingOptionsFhir, setPreprocessingOptionsFhir] = useState()
    const [fhirPreprocessors, setFhirPreprocessors] = useState()
    const [fhirSelectedPreprocessor, setFhirSelectedPreprocessor] = useState()
    const [showModalFHIRScript, setShowModalFHIRScript] = useState(false)
    const [FhirTestInputData, setFHIRTestInputData] = useState()
    const [fhirTestingReponse, setFHIRTestingReponse] = useState()

    // Monaco
    const editorOptions = {
        minimap: { enabled: false },
        formatOnPaste: true, // Enable automatic formatting on paste
        formatOnType: true,  // Enable automatic formatting while typing
    }

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
        } else {
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
            setHl7SelectedPreprocessor()
            setPreprocessingScript()
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
        GetPreprocessorOptions('hl7')
        GetPreprocessorOptions('fhir')
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


    const GetPreprocessorOptions = async (source_type) => {
        const config = {
            method: 'get',
            url: `${endpoint}/api/preprocessors/${source_type}`
        }

        const axios_response = await axios(config)

        const treated = axios_response.data.map((item) => {
            return {
                label: item.preprocessor_name,
                value: item.preprocessor_name,
            }
        })

        treated.push({ label: 'custom', value: 'custom' })
        source_type === 'hl7' ? setPreprocessingOptions(treated) : setPreprocessingOptionsFhir(treated)
        source_type === 'hl7' ? setHl7Preprocessors(axios_response.data) : setFhirPreprocessors(axios_response.data)
    }

    const HandlePreprocessorChoice = async (value, source_type) => {
        source_type === 'hl7' ? setPreprocessingName(value) : setPreprocessingNameFhir(value)
        console.log(value)
        const arrayOfObjects = source_type === 'hl7' ? hl7Preprocessors : fhirPreprocessors
        const selectedProcessor = arrayOfObjects.find(obj => obj.preprocessor_name === value);

        console.log(selectedProcessor)
        source_type === 'hl7' ? setHl7SelectedPreprocessor(selectedProcessor) : setFhirSelectedPreprocessor(selectedProcessor)
    }

    const TestPreprocessor = async (source_type, preprocessor_script, preprocessor_name) => {
        const data = {
            input_data: source_type === 'hl7' ? hL7TestInputData : FhirTestInputData,
            preprocessor_script,
            model: model_id,
            field: attribute_name
        }

        
        console.log(data)
        console.log(preprocessor_name)

        const url = preprocessor_name === 'db-lookup' ? `${endpoint}/api/test-preprocessor?db_lookup=true` : `${endpoint}/api/test-preprocessor`
        const method = 'post'
        const config = { method, url, data }

        const axios_response = await axios(config)
        const response_data = axios_response.data

        source_type === 'hl7' ? setHL7TestingReponse(response_data) : setFHIRTestingReponse(response_data)
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
                                            <Title level={5}>It looks like there isn't any HL7 preprocessor for {attribute_name}.</Title>
                                            <Form onFinish={CreatePreprocessor}>
                                                <Form.Item
                                                    label="Preset"
                                                    name="preprocessing_name">
                                                    <Select
                                                        showSearch
                                                        placeholder="Select a Preprocessor"
                                                        options={preprocessingOptions}
                                                        onChange={(value) => { HandlePreprocessorChoice(value, 'hl7'); setHL7TestingReponse(); setPreprocessingScript() }}
                                                    />
                                                </Form.Item>

                                                {
                                                    preprocessingName === 'custom' &&
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                        <Divider>Custom Preprocessor Metadata</Divider>
                                                        <TextArea rows={4} placeholder="Write your preprocessor documentation description here" onChange={(e) => { setDocDescription(e.target.value) }} />
                                                        <TextArea rows={4} placeholder="Write your preprocessor description here" onChange={(e) => { setDescription(e.target.value) }} />
                                                        <Divider>Custom Preprocessor Script</Divider>
                                                        <MonacoEditor
                                                            language="javascript" // Specify the language mode (e.g., javascript)
                                                            theme='vs' // Specify the editor theme (e.g., vs)
                                                            value={preprocessingScript}
                                                            options={editorOptions}
                                                            onChange={(newCode) => setPreprocessingScript(newCode)}
                                                            height="30rem"
                                                            width="100%"
                                                            autoClosingQuotes={true}
                                                            lineNumbers={false}
                                                        />

                                                        {
                                                            preprocessingScript &&
                                                            <div>
                                                                <div style={{ display: 'flex', gap: '1rem' }}>
                                                                    <Form.Item label='Input Data'>
                                                                        <Input onChange={(e) => setHL7TestInputData(e.target.value)} />
                                                                    </Form.Item>
                                                                    <Button type='primary' onClick={() => TestPreprocessor('hl7', preprocessingScript)}>Test Preprocessor</Button>
                                                                </div>
                                                                {
                                                                    hl7TestingReponse &&
                                                                    <Descriptions title='Preprocessor Test Response' bordered column={1}>
                                                                        <Descriptions.Item label='Response'>{hl7TestingReponse['result']}</Descriptions.Item>
                                                                    </Descriptions>
                                                                }
                                                            </div>
                                                        }
                                                        <Button type='primary' htmlType='submit'>Create Preprocessor</Button>
                                                    </div>
                                                }

                                                {
                                                    hl7SelectedPreprocessor &&
                                                    <div>
                                                        <Descriptions style={{ marginBottom: '1rem' }} label='Preprocessor Metadata' bordered column={1}>
                                                            <Descriptions.Item label='Preprocessor Name'>{hl7SelectedPreprocessor['preprocessor_name']}</Descriptions.Item>
                                                            <Descriptions.Item label='Preprocessor Description'>{hl7SelectedPreprocessor['description']}</Descriptions.Item>
                                                            <Descriptions.Item label='Preprocessor Source Type'>{hl7SelectedPreprocessor['preprocessor_source_type']}</Descriptions.Item>
                                                        </Descriptions>

                                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                                            <Form.Item label='Input Data'>
                                                                <Input onChange={(e) => setHL7TestInputData(e.target.value)} />
                                                            </Form.Item>
                                                            <Button type='primary' onClick={() => TestPreprocessor('hl7', hl7SelectedPreprocessor['preprocessor_script'], hl7SelectedPreprocessor['preprocessor_name'])}>Test Preprocessor</Button>
                                                        </div>
                                                        {
                                                            hl7TestingReponse &&
                                                            <Descriptions title='Preprocessor Test Response' bordered column={1}>
                                                                <Descriptions.Item label='Response'>{hl7TestingReponse['result']}</Descriptions.Item>
                                                            </Descriptions>
                                                        }

                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
                                                            <Button type='primary' htmlType='submit'>Create Preprocessor</Button>
                                                            <Button style={{ backgroundColor: '#FFA500' }} type='primary' onClick={() => setShowModalHL7Script(true)}>Inspect Preprocessor Code</Button>
                                                        </div>


                                                        <Modal title="Preprocessing Script" open={showModalHL7Script} onOk={() => setShowModalHL7Script(false)} onCancel={() => setShowModalHL7Script(false)}>
                                                            <div>
                                                                <MonacoEditor
                                                                    language="javascript"
                                                                    theme='vs'
                                                                    options={{
                                                                        ...editorOptions,
                                                                        readOnly: true,
                                                                    }}
                                                                    height="30rem"
                                                                    width="100%"
                                                                    autoClosingQuotes={true}
                                                                    lineNumbers={false}
                                                                    value={hl7SelectedPreprocessor['preprocessor_script']}
                                                                />
                                                            </div>
                                                        </Modal>
                                                    </div>
                                                }
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
                                            <Title level={5}>It looks like there isn't any FHIR preprocessor for {attribute_name}.</Title>
                                            <Form onFinish={CreatePreprocessorFhir}>
                                                <Form.Item
                                                    label="Preset"
                                                    name="preprocessing_name">
                                                    <Select
                                                        showSearch
                                                        placeholder="Select a Preprocessor"
                                                        options={preprocessingOptionsFhir}
                                                        onChange={(value) => { HandlePreprocessorChoice(value, 'fhir'); setFHIRTestingReponse(); setPreprocessingScriptFhir() }}
                                                    />
                                                </Form.Item>

                                                {
                                                    preprocessingNameFhir === 'custom' &&
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                        <Divider>Custom Preprocessor Metadata</Divider>
                                                        <TextArea rows={4} placeholder="Write your preprocessor description here" onChange={(e) => { setDescriptionFhir(e.target.value) }} />
                                                        <TextArea rows={4} placeholder="Write your preprocessor documentation description here" onChange={(e) => { setDocDescriptionFhir(e.target.value) }} />
                                                        <Divider>Custom Preprocessor Script</Divider>
                                                        <MonacoEditor
                                                            language="javascript" // Specify the language mode (e.g., javascript)
                                                            theme='vs' // Specify the editor theme (e.g., vs)
                                                            value={preprocessingScript}
                                                            options={editorOptions}
                                                            onChange={(newCode) => setPreprocessingScriptFhir(newCode)}
                                                            height="30rem"
                                                            width="100%"
                                                            autoClosingQuotes={true}
                                                            lineNumbers={false}
                                                        />

                                                        {
                                                            preprocessingScriptFhir &&
                                                            <div>
                                                                <div style={{ display: 'flex', gap: '1rem' }}>
                                                                    <Form.Item label='Input Data'>
                                                                        <Input onChange={(e) => setFHIRTestInputData(e.target.value)} />
                                                                    </Form.Item>
                                                                    <Button type='primary' onClick={() => TestPreprocessor('fhir', preprocessingScriptFhir)}>Test Preprocessor</Button>
                                                                </div>
                                                                {
                                                                    fhirTestingReponse &&
                                                                    <Descriptions title='Preprocessor Test Response' bordered column={1}>
                                                                        <Descriptions.Item label='Response'>{fhirTestingReponse['result']}</Descriptions.Item>
                                                                    </Descriptions>
                                                                }
                                                            </div>
                                                        }
                                                        <Button type='primary' htmlType='submit'>Create Preprocessor</Button>
                                                    </div>
                                                }

                                                {
                                                    fhirSelectedPreprocessor &&
                                                    <div>
                                                        <Descriptions style={{ marginBottom: '1rem' }} label='Preprocessor Metadata' bordered column={1}>
                                                            <Descriptions.Item label='Preprocessor Name'>{fhirSelectedPreprocessor['preprocessor_name']}</Descriptions.Item>
                                                            <Descriptions.Item label='Preprocessor Description'>{fhirSelectedPreprocessor['description']}</Descriptions.Item>
                                                            <Descriptions.Item label='Preprocessor Source Type'>{fhirSelectedPreprocessor['preprocessor_source_type']}</Descriptions.Item>
                                                        </Descriptions>

                                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                                            <Form.Item label='Input Data'>
                                                                <Input onChange={(e) => setFHIRTestInputData(e.target.value)} />
                                                            </Form.Item>
                                                            <Button type='primary' onClick={() => TestPreprocessor('fhir', fhirSelectedPreprocessor['preprocessor_script'], fhirSelectedPreprocessor['preprocessor_name'])}>Test Preprocessor</Button>
                                                        </div>
                                                        {
                                                            fhirTestingReponse &&
                                                            <Descriptions title='Preprocessor Test Response' bordered column={1}>
                                                                <Descriptions.Item label='Response'>{fhirTestingReponse['result']}</Descriptions.Item>
                                                            </Descriptions>
                                                        }

                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
                                                            <Button type='primary' htmlType='submit'>Create Preprocessor</Button>
                                                            <Button style={{ backgroundColor: '#FFA500' }} type='primary' onClick={() => setShowModalFHIRScript(true)}>Inspect Preprocessor Code</Button>
                                                        </div>


                                                        <Modal title="Preprocessing Script" open={showModalFHIRScript} onOk={() => setShowModalFHIRScript(false)} onCancel={() => setShowModalFHIRScript(false)}>
                                                            <div>
                                                                <MonacoEditor
                                                                    language="javascript"
                                                                    theme='vs'
                                                                    options={{
                                                                        ...editorOptions,
                                                                        readOnly: true,
                                                                    }}
                                                                    height="30rem"
                                                                    width="100%"
                                                                    autoClosingQuotes={true}
                                                                    lineNumbers={false}
                                                                    value={fhirSelectedPreprocessor['preprocessor_script']}
                                                                />
                                                            </div>
                                                        </Modal>
                                                    </div>

                                                }
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
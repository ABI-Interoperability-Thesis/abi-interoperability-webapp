import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Typography, Button, Modal, Form, Select, Input, message, Tabs, Descriptions, Tag, InputNumber, Collapse, notification } from 'antd'
import FhirPropertyDescriptionItem from './FhirPropertyDescriptionItem'
import MonacoEditor from 'react-monaco-editor';
import 'monaco-editor/min/vs/editor/editor.main.css';
const { Title, Paragraph } = Typography
const { Panel } = Collapse;

const AttributeMappings = (props) => {
    const model_id = props.model_id
    const model = props.model
    const attribute_name = props.attribute_name
    const endpoint = props.endpoint
    const deployed = props.deployed
    const openNotification = props.openNotification
    const GetModelConfigs = props.GetModelConfigs


    const [hasDefaultMapping, setHasDefaultMapping] = useState(false)
    const [defaultMapping, setDefaultMapping] = useState({})
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [edit, setEdit] = useState(false)
    const [messageType, setMessageType] = useState()
    const [isTesting, setIsTesting] = useState(false)



    // HL7 Data
    const [hl7MessageTypes, setHl7MessageTypes] = useState([])
    const [hl7MessageTriggers, setHl7MessageTriggers] = useState([])
    const [hl7MessageSegments, setHl7MessageSegments] = useState([])
    const [hl7fields, setHl7fields] = useState()
    const [hl7Subfields, setHl7Subfields] = useState()

    // Fhir Data
    const [fhirVersions, setFhirVersions] = useState()
    const [fhirSelectedVersion, setFhirSelectedVersion] = useState()
    const [fhirResourceTypes, setFhirResourceTypes] = useState()
    const [fhirResourceDefinition, setFhirResourceDefinition] = useState()
    const [fhirResourceProperties, setFhirResourceProperties] = useState([])
    const [mappingComplete, setMappingComplete] = useState(false)
    const [testingResponse, setTestingResponse] = useState()
    const [fhirDefaultMapping, setFhirDefaultMapping] = useState()

    // Monaco Data
    const [testingObject, setTestingObject] = useState('// Write your FHIR resource here')

    // Modal
    const [modalProperties, setModalProperties] = useState()
    const [isModalVisible, setIsModalVisible] = useState(false)

    // Modal Controls
    const handleOkPropertiesModal = () => {
        setIsModalVisible(false);
        setModalProperties()
    };

    const handleCancelPropertiesModal = () => {
        setIsModalVisible(false);
        setModalProperties()
    };

    const showPropertiesModal = (reference, properties) => {
        setIsModalVisible(true)
        setModalProperties({
            reference,
            properties
        })
    }

    // Monaco Controls
    const handleEditorChange = (newCode, event) => {
        // Update the code state when the editor content changes
        setTestingObject(newCode);
    };

    const editorOptions = {
        minimap: { enabled: false },
        formatOnPaste: true, // Enable automatic formatting on paste
        formatOnType: true,  // Enable automatic formatting while typing
    }

    const CheckFhirDefaultMapping = async () => {
        setFhirDefaultMapping()
        const url = `${endpoint}/api/fhir/mappings/defaults/${model_id}/${attribute_name}`
        const method = 'get'
        const config = { method, url }

        const axios_response = await axios(config)

        if (axios_response.status === 200) {
            const parsed_data = {
                ...axios_response.data,
                mapping_docs: JSON.parse(axios_response.data['mapping_docs'])
            }
            setFhirDefaultMapping(parsed_data)
        }

    }

    const CheckDefaultMapping = async () => {
        const url = `${endpoint}/api/default-check/${model_id}/${attribute_name}`
        const response = await axios.get(url)
        if (response.data.status !== 200) {
            setHasDefaultMapping(false)
        } else {
            setHasDefaultMapping(true)

            // Parsing the mapping and message triggers
            const mapping = response.data.mapping.mapping;
            const parsed_mapping = ParseMapping(mapping)
            response.data.mapping.parsed_mapping = parsed_mapping;
            response.data.mapping.msg_triggers = JSON.parse(response.data.mapping.msg_triggers)

            setDefaultMapping(response.data.mapping)
            console.log(response.data.mapping)
            setLoading(false)
        }
    }

    const GetHL7MessageTypes = async () => {
        const url = `${endpoint}/api/hl7-types`
        const response = await axios.get(url)
        const processed_data = response.data.map((hl7_type) => {
            return {
                value: hl7_type.value,
                label: hl7_type.value
            }
        })
        setHl7MessageTypes(processed_data)
    }

    const GetHL7Triggers = async () => {
        const url = `${endpoint}/api/hl7-triggers`
        const response = await axios.get(url)
        const uniqueTriggers = [...new Set(response.data)];
        const processed_data = uniqueTriggers.map((hl7_trigger) => {
            return {
                value: hl7_trigger,
                label: hl7_trigger
            }
        })
        setHl7MessageTriggers(processed_data)
    }

    const GetHL7Segments = async () => {
        const url = `${endpoint}/api/hl7-segments`
        const response = await axios.get(url)
        const processed_data = response.data.map((hl7_segment) => {
            return {
                value: hl7_segment,
                label: hl7_segment
            }
        })
        setHl7MessageSegments(processed_data)
    }

    const UpdateDefaultMapping = async (values) => {
        console.log(values)
        const joined_mapping = `msg["${values.msg_segment}"]["${values.msg_field}"]["${values.msg_subfield}"]`
        const mapping_id = defaultMapping.mapping_id

        const req_data = {
            mapping_id,
            changes: {
                mapping: joined_mapping,
                msg_type: values.msg_type,
                msg_triggers: values.msg_triggers,
            }
        }

        const config = {
            method: 'put',
            url: `${endpoint}/api/client-mappings`,
            data: req_data
        }

        const axios_response = await axios(config)

        console.log(axios_response)
        CheckDefaultMapping()
        setEdit(false)

    }

    const CreateDefaultMapping = async (values) => {
        if (values.msg_subfield === undefined) values.msg_subfield = values.msg_field + '.1'
        const joined_mapping = `msg["${values.msg_segment}"]["${values.msg_field}"]["${values.msg_subfield}"]`
        const req_data = {
            client_id: 'Default',
            model,
            model_id,
            mappings: [
                {
                    field: attribute_name,
                    mapping: joined_mapping,
                    msg_type: values.msg_type,
                    msg_triggers: values.msg_triggers
                }
            ]
        }

        if (values.msg_type === 'ORU') req_data['mappings'][0]['mapping_id'] = values.mapping_id
        console.log(req_data)
        console.log(req_data)

        const config = {
            method: 'post',
            url: `${endpoint}/api/client-mappings`,
            data: req_data
        }

        const axios_response = await axios(config)

        console.log(axios_response)
        CheckDefaultMapping()
        GetModelConfigs()
    }

    const DeleteMapping = async () => {
        if (!deployed) {
            const config = {
                method: 'delete',
                url: `${endpoint}/api/client-mappings/${defaultMapping.mapping_id}`
            }

            await axios(config)
            CheckDefaultMapping()
            GetModelConfigs()
        } else {
            const message = 'Unable to Delete Mapping!'
            const description = 'While the model is deployed Default Mappings cannot be deleted.'
            openNotification(message, description)
        }

    }

    const ParseMapping = (mapping) => {
        // Remove the surrounding quotes, if present
        mapping = mapping.replace(/'/g, "");

        // Remove the "msg" part
        mapping = mapping.replace(/^msg\[|\]$/g, "");

        // Split the string into sections
        let sections = mapping.split("][");

        let removed_quotes = sections.map(element => element.replace(/"/g, ''));

        return removed_quotes
    }

    useEffect(() => {
        CheckFhirDefaultMapping()
        CheckDefaultMapping()
        GetHL7MessageTypes()
        GetHL7Triggers()
        GetHL7Segments()
        GetFhirVersions()
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

    const FetchHL7Data = async (comp_type, value) => {
        if (comp_type === 'hl7_segment') {
            const hl7_fields = await GetHL7Fields(value)
            setHl7fields(hl7_fields)
        }

        if (comp_type === 'hl7_segment_field') {
            const hl7_subfields = await GetHL7SubFields(value)
            if (hl7_subfields.length !== 0) {
                setHl7Subfields(hl7_subfields)
            }
        }
    }

    const GetHL7Fields = async (msg_segment) => {
        const url = `${endpoint}/api/hl7-fields/${msg_segment}`
        const response = await axios.get(url)
        let processed_data = []
        for (let i = 0; i < response.data.length; i++) {
            const element = response.data[i];
            processed_data.push({
                value: element,
                label: element
            })
        }
        return processed_data
    }

    const GetHL7SubFields = async (field) => {
        const url = `${endpoint}/api/hl7-sub-fields/${field}`
        const response = await axios.get(url)
        let processed_data = []
        for (let i = 0; i < response.data.length; i++) {
            const element = response.data[i];
            processed_data.push({
                value: element,
                label: element
            })
        }
        return processed_data
    }

    const setEditMode = async () => {
        const hl7_fields = await GetHL7Fields(defaultMapping.parsed_mapping[0]);
        setHl7fields(hl7_fields)

        const hl7_subfields = await GetHL7SubFields(defaultMapping.parsed_mapping[1]);
        setHl7Subfields(hl7_subfields)

        setEdit(true);

    }

    const GetFhirVersions = async () => {
        const url = `${endpoint}/api/fhir/versions/`
        const response = await axios.get(url)
        const processed_data = response.data.map((fhir_version) => {
            return {
                value: fhir_version,
                label: fhir_version
            }
        })
        setFhirVersions(processed_data)
    }

    const GetFhirResourceTypes = async (version) => {
        const url = `${endpoint}/api/fhir/schema/resource-types/${version}`
        const response = await axios.get(url)
        const processed_data = response.data.map((fhir_resource_type) => {
            return {
                value: fhir_resource_type,
                label: fhir_resource_type
            }
        })
        setFhirSelectedVersion(version)
        setFhirResourceTypes(processed_data)
    }

    const HandleFhirVersionSelect = (value) => {
        setMappingComplete(false)
        setIsTesting(false)
        setFhirResourceTypes()
        setFhirResourceProperties([])
        GetFhirResourceTypes(value)
    }

    const GetFhirResourceTypeDefinition = async (definition) => {
        setMappingComplete(false)
        setIsTesting(false)
        setFhirResourceProperties([])

        const url = `${endpoint}/api/fhir/schema/resource-types/definitions/${definition}/${fhirSelectedVersion}`
        const response = await axios.get(url)
        const data = response.data

        const new_property = {
            options: PreprocessFhirProperty(data.properties),
            references: data,
            previous: definition,
            final: false,
        };

        console.log(new_property)

        // Create a new array with the new item and set the state
        setFhirResourceProperties((fhirResourceProperties) => [...fhirResourceProperties, new_property]);
        setFhirResourceDefinition({
            ...data,
            previous: definition
        })
    }

    const HandleFhirResourceTypeSelection = (value) => {
        GetFhirResourceTypeDefinition(value)
    }

    const PreprocessFhirProperty = (properties) => {
        const properties_array = Object.keys(properties)
        console.log(properties_array)
        const processed_properties = properties_array.map((fhir_property) => {
            return {
                value: fhir_property,
                label: fhir_property
            }
        })

        return processed_properties
    }

    const HandleSelectProperty = async (value, fhir_property, index) => {
        setIsTesting(false)
        // cleaning the properties array
        setFhirResourceProperties((fhirResourceProperties) => fhirResourceProperties.slice(0, index + 1));

        // Searching for $ref attribute
        const property_data = fhir_property.references.properties[value]
        const ref_key = FindRefInProperty(property_data)

        const reference_name_parts = ref_key.split('/')
        const reference_name = reference_name_parts[reference_name_parts.length - 1];

        if (ref_key === 'no_ref') {
            // Updating the current item with its reference details
            const updated_property = {
                ...fhir_property,
                field_data: {
                    name: value,
                    ...property_data,
                    reference: reference_name,
                    reference_data: property_data,
                    type: property_data.type ? property_data.type : 'none'
                },
                final: true,
            }

            setMappingComplete(true);

            setFhirResourceProperties((fhirResourceProperties) =>
                fhirResourceProperties.map((item) => (item === fhir_property ? updated_property : item))
            );
            return
        }

        const url = `${endpoint}/api/fhir/schema/resource-types/definitions/${reference_name}/${fhirSelectedVersion}`
        const response = await axios.get(url)
        const data = response.data

        // Checking if the attribute is final and has a type
        if (data.properties) {
            // Updating the current item with its reference details
            const updated_property = {
                ...fhir_property,
                field_data: {
                    name: value,
                    ...property_data,
                    reference: reference_name,
                    reference_data: data,
                    type: property_data.type ? property_data.type : 'none',
                },
                final: false,
            }

            if (updated_property.field_data.type === 'array') updated_property['array_pos'] = 0

            setMappingComplete(false)
            setIsTesting(false)

            setFhirResourceProperties((fhirResourceProperties) =>
                fhirResourceProperties.map((item) => (item === fhir_property ? updated_property : item))
            );

            // Creating the next property and feeding the new properties into it
            const new_property = {
                options: PreprocessFhirProperty(data.properties),
                references: data,
                previous: value,
            };

            setFhirResourceProperties((fhirResourceProperties) => [...fhirResourceProperties, new_property]);
        } else {
            // Updating the current item with its reference details
            const updated_property = {
                ...fhir_property,
                field_data: {
                    name: value,
                    ...property_data,
                    reference: reference_name,
                    reference_data: data,
                    type: property_data.type ? property_data.type : 'none',
                },
                final: true,
                property_details: data
            }

            if (updated_property.field_data.type === 'array') updated_property['array_pos'] = 0

            setMappingComplete(true);

            setFhirResourceProperties((fhirResourceProperties) =>
                fhirResourceProperties.map((item) => (item === fhir_property ? updated_property : item))
            );
        }
    }

    const FindRefInProperty = (obj) => {
        console.log('Finding Ref')
        console.log(obj)
        if (obj === null || typeof obj !== 'object') {
            console.log('Not an Object')
            return 'no_ref';
        }

        for (const key in obj) {
            if (key === '$ref') {
                console.log('Found')
                return obj[key];
            } else if (typeof obj[key] === 'object') {
                console.log('Not Found')
                const result = FindRefInProperty(obj[key]);
                if (result !== 'no_ref') {
                    return result;
                }
            }
        }

        console.log('Not Found')
        return 'no_ref';
    };

    const CreateFhirMapping = async (values) => {
        const mapping = GenerateFhirMapping()
        const resource_type = fhirResourceDefinition.previous

        const mapping_docs = fhirResourceProperties.map((property, index) => {
            console.log(property)

            let new_doc_item = {
                field_data: property.field_data,
                final: property.final,

            }
            if ('array_pos' in property) {
                new_doc_item['is_array'] = true
                new_doc_item['array_pos'] = property['array_pos']
            }

            return new_doc_item
        })

        const data = {
            client_id: 'Default',
            model,
            model_id,
            field: attribute_name,
            mapping,
            resource_type,
            mapping_docs
        }

        const url = `${endpoint}/api/fhir/mappings`
        const method = 'post'

        const config = { method, url, data }

        const axios_response = await axios(config)

        if (axios_response.status === 200) {
            notification.success({
                message: 'Fhir Mapping Created Successfully',
                description: 'Mapping created successfully.',
            });
        } else {
            notification.error({
                message: 'There was an error creating the mapping',
                description: 'Internal server error',
            });
        }

        CheckFhirDefaultMapping()
        GetModelConfigs()
    }

    const TestMapping = async () => {
        const mapping = GenerateFhirMapping()
        const fhir_resource = JSON.parse(testingObject)

        const data = {
            mapping,
            fhir_resource
        }

        const url = `${endpoint}/api/fhir/resource/test`

        const method = 'post'
        const config = {
            method,
            url,
            data
        }

        const service_response = await axios(config)
        const test_response = service_response.data.response

        if (test_response !== 'no such mapping found') {
            setTestingResponse({
                status: 'success',
                response: test_response
            })
        } else {
            setTestingResponse({
                status: 'failed'
            })
        }
    }

    const DeleteFhirMapping = async () => {
        const url = `${endpoint}/api/fhir/mappings/defaults/${fhirDefaultMapping['mapping_id']}`
        const method = 'delete'

        const config = { method, url }

        const axios_response = await axios(config)

        if (axios_response.status === 200) {
            notification.success({
                message: 'Fhir Mapping Deleted Successfully',
                description: 'Mapping was deleted successfully.',
            });
        } else {
            notification.error({
                message: 'There was an error deleting the mapping',
                description: 'Internal server error',
            });
        }

        CheckFhirDefaultMapping()
        GetModelConfigs()
    }

    const GenerateFhirMapping = () => {
        let mapping = ''

        fhirResourceProperties.map((property, index) => {
            let mapping_piece = property.field_data.name

            if ('array_pos' in property) mapping_piece += `.${property.array_pos}`

            if (index > 0) mapping += '.'
            mapping += mapping_piece
        })

        return mapping
    }

    const HandleChangePropertyArrayIndex = (fhir_property_index, new_index) => {
        // Create a shallow copy of the original array
        const updatedItems = [...fhirResourceProperties];

        // Update the desired attribute of the element in the copied array
        updatedItems[fhir_property_index] = {
            ...updatedItems[fhir_property_index],
            array_pos: new_index,
        };

        // Update the state with the new array
        setFhirResourceProperties(updatedItems);
    }

    return (
        <>
            <Descriptions column={2} style={{ width: '15rem' }}>
                <Descriptions.Item label='HL7'>
                    {
                        hasDefaultMapping ?
                            (<Tag color='green'>OK</Tag>) : (<Tag color='red'>No Data</Tag>)
                    }
                </Descriptions.Item>

                <Descriptions.Item label='FHIR'>
                    {
                        fhirDefaultMapping ?
                            (<Tag color='green'>OK</Tag>) : (<Tag color='red'>No Data</Tag>)
                    }
                </Descriptions.Item>
            </Descriptions>
            <Tabs items={[
                {
                    key: '1',
                    label: 'HL7 Mapping',
                    children: (
                        <>
                            {!loading && hasDefaultMapping ? (
                                <>
                                    {
                                        edit ? (
                                            <>
                                                <Form onFinish={UpdateDefaultMapping} autoComplete="off">
                                                    <Form.Item
                                                        label="Message Type"
                                                        name="msg_type"
                                                        initialValue={defaultMapping.msg_type}
                                                    >
                                                        <Select
                                                            showSearch
                                                            placeholder="Select a Message Type"
                                                            optionFilterProp="children"
                                                            filterOption={(input, option) =>
                                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                            }
                                                            options={hl7MessageTypes}
                                                        />
                                                    </Form.Item>

                                                    <Form.Item label="Supported Message Triggers" name="msg_triggers" initialValue={defaultMapping.msg_triggers}>
                                                        <Select showSearch mode='multiple' options={hl7MessageTriggers} />
                                                    </Form.Item>

                                                    <Form.Item label="Mapped Message Segment" name='msg_segment' initialValue={defaultMapping.parsed_mapping[0]}>
                                                        <Select showSearch options={hl7MessageSegments} onChange={(value) => FetchHL7Data('hl7_segment', value)} />
                                                    </Form.Item>


                                                    {
                                                        hl7fields &&
                                                        <Form.Item label="Mapped Segment Field" name='msg_field' initialValue={defaultMapping.parsed_mapping[1]}>
                                                            <Select showSearch options={hl7fields} onChange={(value) => FetchHL7Data('hl7_segment_field', value)} />
                                                        </Form.Item>
                                                    }

                                                    {
                                                        hl7Subfields &&
                                                        <Form.Item label="Mapped Segment Subfield" name='msg_subfield' initialValue={defaultMapping.parsed_mapping[2]}>
                                                            <Select showSearch options={hl7Subfields} onChange={(value) => FetchHL7Data('hl7_segment_subfield', value)} />
                                                        </Form.Item>
                                                    }


                                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
                                                        <Button style={{ backgroundColor: '#F44336' }} type='primary' onClick={() => setEdit(false)}>Cancel</Button>
                                                        <Button style={{ backgroundColor: '#4CAF50' }} type='primary' htmlType='submit'>Update</Button>
                                                    </div>
                                                </Form>

                                            </>
                                        ) : (
                                            <Paragraph>
                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                    <Title style={{ margin: 0 }} level={5}>Message Type</Title>
                                                    <pre>{defaultMapping.msg_type}</pre>
                                                </div>

                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                    <Title style={{ margin: 0 }} level={5}>Message Triggers</Title>
                                                    {defaultMapping.msg_triggers.map((msg_trigger) => (<pre>{msg_trigger}</pre>))}
                                                </div>

                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                    <Title style={{ margin: 0 }} level={5}>Mapping</Title>
                                                    {defaultMapping.parsed_mapping.map((mapping_section) => (<pre>{mapping_section}</pre>))}
                                                </div>

                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
                                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                        <Button type='primary' onClick={setEditMode}>Update</Button>
                                                        <Button danger onClick={DeleteMapping}>Delete</Button>
                                                    </div>
                                                    <Button style={{ backgroundColor: '#FFA500' }} type='primary' onClick={showModal}>Inspect Generated Code</Button>
                                                </div>

                                                <Modal title="Generated Transformer Script" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                                                    <Paragraph>
                                                        <pre>{defaultMapping.transformer_script}</pre>
                                                    </Paragraph>
                                                </Modal>

                                            </Paragraph>
                                        )
                                    }
                                </>
                            ) :
                                (
                                    <>
                                        <Title level={5}>It loooks like there isn't any Default mapping for {attribute_name}.</Title>
                                        <p>Default Mappings are required for universal compatibility </p>
                                        <Form onFinish={CreateDefaultMapping} autoComplete="off">
                                            <Form.Item
                                                label="Message Type"
                                                name="msg_type">
                                                <Select
                                                    showSearch
                                                    placeholder="Select a Message Type"
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                    }
                                                    onChange={(value) => setMessageType(value)}
                                                    options={hl7MessageTypes}
                                                />
                                            </Form.Item>

                                            {
                                                messageType === 'ORU' &&
                                                <Form.Item
                                                    label="Observation ID"
                                                    name="mapping_id">
                                                    <Input />
                                                </Form.Item>
                                            }



                                            <Form.Item label="Supported Message Triggers" name="msg_triggers">
                                                <Select showSearch mode='multiple' options={hl7MessageTriggers} />
                                            </Form.Item>

                                            <Form.Item label="Mapped Message Segment" name='msg_segment'>
                                                <Select showSearch options={hl7MessageSegments} onChange={(value) => FetchHL7Data('hl7_segment', value)} />
                                            </Form.Item>

                                            {
                                                hl7fields &&
                                                <Form.Item label="Mapped Segment Field" name='msg_field'>
                                                    <Select showSearch options={hl7fields} onChange={(value) => FetchHL7Data('hl7_segment_field', value)} />
                                                </Form.Item>
                                            }

                                            {
                                                hl7Subfields &&
                                                <Form.Item label="Mapped Segment Subfield" name='msg_subfield'>
                                                    <Select showSearch options={hl7Subfields} onChange={(value) => FetchHL7Data('hl7_segment_subfield', value)} />
                                                </Form.Item>
                                            }



                                            <Button type='primary' style={{ backgroundColor: '#4CAF50' }} htmlType='submit' >Create Default Mapping</Button>
                                        </Form>
                                    </>
                                )

                            }

                        </>
                    )
                },
                {
                    key: '2',
                    label: 'FHIR Mapping',
                    children: (
                        <>
                            {
                                fhirDefaultMapping ?
                                    (
                                        <div>
                                            <Descriptions title='Mapping Metadata' bordered column={1}>
                                                <Descriptions.Item label='Model'>{fhirDefaultMapping['model']}</Descriptions.Item>
                                                <Descriptions.Item label='Model Attribute'>{fhirDefaultMapping['field']}</Descriptions.Item>
                                                <Descriptions.Item label='Fhir Resource'>{fhirDefaultMapping['fhir_resource']}</Descriptions.Item>
                                                <Descriptions.Item label='Encoded Mapping'>{fhirDefaultMapping['mapping']}</Descriptions.Item>
                                            </Descriptions>

                                            {
                                                fhirDefaultMapping['mapping_docs'].map((mapping) => (
                                                    <FhirPropertyDescriptionItem field_data={mapping.field_data} />
                                                ))
                                            }

                                            <Button danger onClick={DeleteFhirMapping}>Delete Mapping</Button>
                                        </div>
                                    ) :
                                    (
                                        <div>
                                            <Form onFinish={CreateFhirMapping}>
                                                <Form.Item label='FHIR Version' name='fhir_version'>
                                                    <Select showSearch options={fhirVersions} onChange={HandleFhirVersionSelect} />
                                                </Form.Item>

                                                {
                                                    fhirResourceTypes && fhirSelectedVersion &&
                                                    <Form.Item label='FHIR Resource Type'>
                                                        <Select showSearch options={fhirResourceTypes} onChange={HandleFhirResourceTypeSelection} />
                                                    </Form.Item>
                                                }

                                                {
                                                    fhirResourceDefinition && fhirResourceProperties.length > 0 &&
                                                    <div>
                                                        <Descriptions column={1} bordered title='Resource Type Data'>
                                                            <Descriptions.Item label='Resource Description'>{fhirResourceDefinition.description}</Descriptions.Item>
                                                            <Descriptions.Item label='Property Count'>
                                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                    {Object.keys(fhirResourceDefinition.properties).length}
                                                                    <Button type="primary" onClick={() => showPropertiesModal(fhirResourceDefinition.previous, fhirResourceDefinition.properties)}>Inspect Properties</Button>
                                                                </div>
                                                            </Descriptions.Item>
                                                            <Descriptions.Item label='Required'>{
                                                                fhirResourceDefinition.required.map((required_item) => (
                                                                    <Tag color='geekblue'>{required_item} </Tag>
                                                                ))
                                                            }</Descriptions.Item>
                                                            <Descriptions.Item label='Aditional Properties'>
                                                                <div>
                                                                    {
                                                                        fhirResourceDefinition.additionalProperties ?
                                                                            'Yes'
                                                                            :
                                                                            'No'
                                                                    }
                                                                </div>
                                                            </Descriptions.Item>
                                                        </Descriptions>

                                                        {
                                                            modalProperties &&
                                                            <Modal
                                                                title={`${modalProperties.reference} Properties`}
                                                                visible={isModalVisible}
                                                                onOk={handleOkPropertiesModal}
                                                                onCancel={handleCancelPropertiesModal}
                                                            >
                                                                <div>
                                                                    <Collapse accordion>
                                                                        {
                                                                            Object.keys(modalProperties.properties).map((property, index) => (
                                                                                <Panel header={property} key={index}>
                                                                                    {modalProperties.properties[property]['description']}
                                                                                </Panel>
                                                                            ))
                                                                        }
                                                                    </Collapse>
                                                                </div>
                                                            </Modal>
                                                        }

                                                        {fhirResourceProperties.map((fhir_property, index) => (
                                                            <div>
                                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem', marginBottom: '1rem' }}>
                                                                    <Form.Item style={{ margin: 0 }} label={`${fhir_property.previous} Property`} >
                                                                        <Select style={{ width: '10rem', margin: 0 }} showSearch options={fhir_property.options} onChange={(value) => HandleSelectProperty(value, fhir_property, index)} />
                                                                    </Form.Item>

                                                                    {
                                                                        fhir_property.field_data && fhir_property.field_data.type === 'array' &&
                                                                        <Form.Item style={{ margin: 0 }} label="Position in List" >
                                                                            <InputNumber min={0} max={100} defaultValue={0} onChange={(value) => HandleChangePropertyArrayIndex(index, value)} />
                                                                        </Form.Item>
                                                                    }
                                                                </div>

                                                                {
                                                                    fhir_property.field_data &&
                                                                    <FhirPropertyDescriptionItem field_data={fhir_property.field_data} />
                                                                }

                                                            </div>
                                                        ))}

                                                    </div>
                                                }

                                                {
                                                    mappingComplete &&
                                                    <>
                                                        {
                                                            isTesting ?
                                                                <>
                                                                    <Title level={3}>Mapping Test</Title>

                                                                    <Descriptions bordered column={1}>
                                                                        <Descriptions.Item label='Generated Mapping'>{GenerateFhirMapping()}</Descriptions.Item>
                                                                    </Descriptions>

                                                                    <Title level={4}>FHIR Resource Input</Title>
                                                                    <div style={{ marginTop: '1rem', marginBottom: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                                                                        <MonacoEditor
                                                                            language="json" // Specify the language mode (e.g., javascript)
                                                                            theme='vs' // Specify the editor theme (e.g., vs)
                                                                            value={testingObject}
                                                                            options={editorOptions}
                                                                            onChange={handleEditorChange}
                                                                            height="10rem"
                                                                            width="100%"
                                                                            autoClosingQuotes={true}
                                                                            lineNumbers={false}
                                                                        />
                                                                    </div>

                                                                    {
                                                                        testingResponse &&
                                                                        <Descriptions style={{ marginBottom: '1rem' }} bordered column={1}>
                                                                            <Descriptions.Item label='Test Status'>{testingResponse.status}</Descriptions.Item>
                                                                            {
                                                                                testingResponse.status === 'success' &&
                                                                                <Descriptions.Item label='Test Response'>{testingResponse.response}</Descriptions.Item>
                                                                            }
                                                                        </Descriptions>
                                                                    }

                                                                    {/* Buttons */}
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                                                            <Button type='primary' htmlType='submit' >Create Mapping</Button>
                                                                            <Button type='primary' style={{ backgroundColor: '#F44336' }} onClick={() => setIsTesting(false)}>Cancel</Button>
                                                                        </div>
                                                                        <Button style={{ backgroundColor: '#4caf50' }} type='primary' onClick={TestMapping} >Run Test</Button>
                                                                    </div>

                                                                </>
                                                                :
                                                                <>
                                                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                                                        <Button type='primary' htmlType='submit' >Create Mapping</Button>
                                                                        <Button type='primary' style={{ backgroundColor: '#4caf50' }} onClick={() => {
                                                                            setIsTesting(true)
                                                                            setTestingResponse()
                                                                            setTestingObject(`{
        "resourceType": "${fhirResourceDefinition.previous}"
    }`)
                                                                        }}>Test Mapping</Button>
                                                                    </div>
                                                                </>
                                                        }
                                                    </>
                                                }
                                            </Form>
                                        </div>
                                    )
                            }
                        </>
                    )
                }]} />
        </>
    )
}

export default AttributeMappings
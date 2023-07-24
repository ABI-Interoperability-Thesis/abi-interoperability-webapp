import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Typography, Button, Modal, Form, Select, Input, message } from 'antd'

const { Title, Paragraph } = Typography

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



    //HL7 Data
    const [hl7MessageTypes, setHl7MessageTypes] = useState([])
    const [hl7MessageTriggers, setHl7MessageTriggers] = useState([])
    const [hl7MessageSegments, setHl7MessageSegments] = useState([])
    const [hl7fields, setHl7fields] = useState()
    const [hl7Subfields, setHl7Subfields] = useState()


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
        }else{
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
        CheckDefaultMapping()
        GetHL7MessageTypes()
        GetHL7Triggers()
        GetHL7Segments()
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

    return (
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
}

export default AttributeMappings
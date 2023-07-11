import React, { useState, useEffect } from 'react'
import { Card, Tag, Typography, Button, Form, Select, Input, Empty } from 'antd'
import axios from 'axios'

const { Title, Paragraph } = Typography


const CustomMappingCard = (props) => {
    const model_attribute = props.model_attribute
    const client_id = props.client_id
    const mysql_endpoint = props.mysql_endpoint
    const model_name = props.model_name

    const [clientMappingType, setClientMappingType] = useState()
    const [clientMapping, setClientMapping] = useState()
    const [createMode, setCreateMode] = useState(false)
    const [messageType, setMessageType] = useState()

    //HL7 Data
    const [hl7MessageTypes, setHl7MessageTypes] = useState([])
    const [hl7MessageTriggers, setHl7MessageTriggers] = useState([])
    const [hl7MessageSegments, setHl7MessageSegments] = useState([])
    const [hl7fields, setHl7fields] = useState()
    const [hl7Subfields, setHl7Subfields] = useState()

    const GetClientMapping = async () => {
        const url = `${mysql_endpoint}/api/check-client-mappings/${model_attribute.model_id}/${client_id}/${model_attribute.name}`
        const method = 'get'
        const config = { method, url }
        const axios_response = await axios(config)
        console.log(axios_response.data)

        if (axios_response.data.mapping !== 'not found') {
            const mapping = axios_response.data.mapping.mapping;
            const parsed_mapping = ParseMapping(mapping)
            axios_response.data.mapping.parsed_mapping = parsed_mapping;
            axios_response.data.mapping.msg_triggers = JSON.parse(axios_response.data.mapping.msg_triggers)
        }

        setClientMappingType(axios_response.data.mapping_type)
        setClientMapping(axios_response.data.mapping)
    }

    const DeleteMapping = async () => {
        const config = {
            method: 'delete',
            url: `${mysql_endpoint}/api/client-mappings/${clientMapping.mapping_id}`
        }

        await axios(config)
        GetClientMapping()
    }

    useEffect(() => {
        GetClientMapping()
        GetHL7MessageTypes()
        GetHL7Triggers()
        GetHL7Segments()
    }, [])

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

    const CreateDefaultMapping = async (values) => {
        if (values.msg_subfield === undefined) values.msg_subfield = values.msg_field + '.1'
        const joined_mapping = `msg["${values.msg_segment}"]["${values.msg_field}"]["${values.msg_subfield}"]`
        const req_data = {
            client_id: client_id,
            model: model_name,
            model_id: model_attribute.model_id,
            mappings: [
                {
                    field: model_attribute.name,
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
            url: `${mysql_endpoint}/api/client-mappings`,
            data: req_data
        }

        const axios_response = await axios(config)

        console.log(axios_response)
        GetClientMapping()
        setCreateMode(false)
    }

    const GetHL7MessageTypes = async () => {
        const url = `${mysql_endpoint}/api/hl7-types`
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
        const url = `${mysql_endpoint}/api/hl7-triggers`
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
        const url = `${mysql_endpoint}/api/hl7-segments`
        const response = await axios.get(url)
        const processed_data = response.data.map((hl7_segment) => {
            return {
                value: hl7_segment,
                label: hl7_segment
            }
        })
        setHl7MessageSegments(processed_data)
    }

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
        const url = `${mysql_endpoint}/api/hl7-fields/${msg_segment}`
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
        const url = `${mysql_endpoint}/api/hl7-sub-fields/${field}`
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

    const ChangeToCreateMode = () => {
        setCreateMode(true);
        setHl7fields();
        setHl7Subfields();
    }


    return (
        <>
            {
                clientMappingType && clientMapping &&
                <Card style={{ marginTop: '1.5rem' }} title={
                    <>
                        {model_attribute.name} <Tag color={clientMappingType == 'default' ? 'gold' : 'geekblue'}>{clientMappingType}</Tag>
                    </>
                }
                >
                    {
                        createMode === true &&
                        <>
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
                    }

                    {
                        createMode === false && clientMapping &&
                        <>
                            {
                                clientMapping === 'not found' ?
                                    (
                                        <>
                                            <Empty description='There is no default mapping for this attribute' />
                                            <Button onClick={ChangeToCreateMode}>Create Custom Mapping</Button>
                                        </>
                                    )
                                    :
                                    (
                                        <Paragraph>
                                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                <Title style={{ margin: 0 }} level={5}>Message Type</Title>
                                                <pre>{clientMapping.msg_type}</pre>
                                            </div>

                                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                <Title style={{ margin: 0 }} level={5}>Message Triggers</Title>
                                                {clientMapping.msg_triggers.map((msg_trigger) => (<pre>{msg_trigger}</pre>))}
                                            </div>

                                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                <Title style={{ margin: 0 }} level={5}>Mapping</Title>
                                                {clientMapping.parsed_mapping.map((mapping_section) => (<pre>{mapping_section}</pre>))}
                                            </div>

                                            {
                                                clientMappingType == 'custom' ?
                                                    (
                                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
                                                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                                <Button type='primary' >Update</Button>
                                                                <Button danger onClick={DeleteMapping}>Delete</Button>
                                                            </div>
                                                            <Button style={{ backgroundColor: '#FFA500' }} type='primary'>Inspect Generated Code</Button>
                                                        </div>
                                                    ) : (
                                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
                                                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                                <Button type='primary' onClick={ChangeToCreateMode}>Create Custom Mapping</Button>
                                                            </div>
                                                            <Button style={{ backgroundColor: '#FFA500' }} type='primary'>Inspect Generated Code</Button>
                                                        </div>
                                                    )
                                            }

                                        </Paragraph>
                                    )
                            }
                        </>
                    }
                </Card>
            }
        </>
    )
}

export default CustomMappingCard
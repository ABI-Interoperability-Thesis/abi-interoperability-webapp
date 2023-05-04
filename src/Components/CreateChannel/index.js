import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Typography, Button, Input, InputNumber, Select, Card, notification } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import './index.css'
const { Title } = Typography

const CreateChannel = (props) => {
    const setCreateNewChannel = props.setCreateNewChannel
    const mirth_endpoint = props.mirth_endpoint
    const preprocessor_endpoint = props.preprocessor_endpoint
    const [newChannel, setNewChannel] = useState({ channel_port: 1000 })
    const [mappings, setMappings] = useState([])
    const [preprocessorOptions, setPreprocessorOptions] = useState([])
    const [notificationApi, contextHolder] = notification.useNotification();


    useEffect(() => {
        GetPreprocessorOptions()
    }, []);

    const GetPreprocessorOptions = async () => {
        const url = `${preprocessor_endpoint}/api/preprocessors`
        const config = { method: 'get', url }

        const axios_response = await axios(config)

        const prepared_data = axios_response.data.map((preprocessor)=>{
            return {
                value: preprocessor,
                value: preprocessor
            }
        })

        setPreprocessorOptions(prepared_data)
    }

    const handleChannelNameInput = (event) => {
        const current_channel = newChannel
        current_channel['channel_name'] = event.target.value
        setNewChannel(current_channel)
    }

    const handleChannelPortInput = (value) => {
        const current_channel = newChannel
        current_channel['channel_port'] = value
        setNewChannel(current_channel)
    }

    const handleModelInput = (value) => {
        const current_channel = newChannel
        current_channel['model_name'] = value
        setNewChannel(current_channel)
    }

    const handlePreprocessorInput = (value) => {
        const current_channel = newChannel
        current_channel['preprocessor'] = value
        setNewChannel(current_channel)
    }

    const CreateChannel = async () => {
        const new_channel_complete = {
            ...newChannel,
            mappings
        }

        const url = `${mirth_endpoint}/api/channels`
        const config = { method: 'post', url, data: new_channel_complete }
        console.log(new_channel_complete)
        const mirth_response = await axios(config)

        mirth_response.status === 200 ? notificationApi.success({
            message: 'Channel created successfully',
            description: 'The channel was created successfully'
        }) : notificationApi.error({
            message: 'Channel not created',
            description: 'The channel was not created. There was an error'
        })
    }

    const AddNewMapping = () => {
        const new_mapping = {
            name: ''
        }
        setMappings(mappings => [...mappings, new_mapping])
    }

    const RemoveMapping = (mapping_index) => {
        const newMappings = [...mappings];
        newMappings.splice(mapping_index, 1);
        setMappings(newMappings);
    }

    const HandleMappingInputChange = event => {
        let index = event.target.getAttribute('arr-index')
        let attribute = event.target.getAttribute('attribute')

        let newState = [...mappings]
        newState[index][attribute] = event.target.value
        setMappings(newState)
    }

    const HandleMappingInputChangeSelect = (index, value, attribute) => {
        let newState = [...mappings]
        newState[index][attribute] = value
        setMappings(newState)
    }

    const model_options = [
        {
            value: 'hospitalization_pred',
            label: 'hospitalization_pred'
        }
    ]

    const message_type_options = [
        {
            value: 'ADT',
            label: 'ADT'
        },
        {
            value: 'ORU',
            label: 'ORU'
        }
    ]

    const message_triggers_options = [
        {
            value: 'A01',
            label: 'A01'
        },
        {
            value: 'A02',
            label: 'A02'
        },
        {
            value: 'A03',
            label: 'A03'
        },
        {
            value: 'R01',
            label: 'R01'
        },
        {
            value: 'R03',
            label: 'R03'
        }
    ]

    const obersvation_id_options = [
        {
            value: '01',
            label: '01'
        },
        {
            value: '02',
            label: '02'
        }
    ]

    return (
        <div>
            {contextHolder}
            <Title level={2}>New Channel</Title>

            <Title level={4}>Channel Name</Title>
            <Input placeholder="Channel Name" onChange={handleChannelNameInput} />

            <Title level={4}>Channel Port</Title>
            <InputNumber defaultValue={1000} placeholder='Channel Port' min={1000} max={2000} onChange={handleChannelPortInput} />

            <Title level={4}>Model</Title>
            <Select showSearch placeholder="Select a model" onChange={handleModelInput} options={model_options} style={{ width: '10rem' }} />

            <Title level={4}>Preprocessor</Title>
            <Select showSearch placeholder="Select a preprocessor" onChange={handlePreprocessorInput} options={preprocessorOptions} style={{ width: '10rem' }} />

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', margin: '1.5rem 0 1.5rem 0' }}>
                <Title level={4} style={{ margin: 0 }}>Mappings</Title>
                <Button type="primary" size='small' icon={<PlusOutlined />} onClick={AddNewMapping} />
            </div>
            <div className='create-channel-mappings-container' >
                {
                    mappings.map((mapping, index) => (
                        <Card key={index} style={{ width: '100%' }}>
                            <div className='mapping-container'>
                                <div className='mapping-header'>
                                    <div className='mapping-input-label-container'>
                                        <label level={5}>Mapping Name</label>
                                        <Input value={mapping.name} arr-index={index} attribute="name" onChange={HandleMappingInputChange} placeholder='Mapping Name' />
                                    </div>
                                    <div className='mapping-input-label-container'>
                                        <label level={5}>Message Type</label>
                                        <Select value={mapping.hl7_type} onChange={(value) => HandleMappingInputChangeSelect(index, value, 'hl7_type')} placeholder='Message Type' options={message_type_options} style={{ width: '100%' }} />
                                    </div>
                                    {
                                        mapping.hl7_type === 'ORU' &&
                                        <div className='mapping-input-label-container'>
                                            <label level={5}>Observation Id</label>
                                            <Select value={mapping.mapping_id} onChange={(value) => HandleMappingInputChangeSelect(index, value, 'mapping_id')} placeholder='Observation Id' options={obersvation_id_options} style={{ width: '100%' }} />
                                        </div>
                                    }

                                    <div className='mapping-input-label-container'>
                                        <label level={5}>Message Triggers</label>
                                        <Select mode='multiple' value={mapping.hl7_triggers} onChange={(value) => HandleMappingInputChangeSelect(index, value, 'hl7_triggers')} placeholder='Message Triggers' options={message_triggers_options} style={{ width: '100%' }} />
                                    </div>
                                </div>
                                <div className='mapping-input-label-container'>
                                    <label level={5}>HL7 Mapping</label>
                                    <Input value={mapping.map_to} placeholder='HL7 Mapping' onChange={HandleMappingInputChange} arr-index={index} attribute="map_to" />
                                </div>
                            </div>
                            <div className='mapping-delete-container'>
                                <Button danger onClick={() => RemoveMapping(index)} >Delete</Button>
                            </div>
                        </Card>
                    ))
                }
            </div>

            <div className='create-channel-buttons-container'>
                <Button type='primary' style={{ backgroundColor: '#4CAF50' }} onClick={CreateChannel}>Create Channel</Button>
                <Button type='primary' style={{ backgroundColor: '#F44336' }} onClick={() => setCreateNewChannel(false)}>Cancel</Button>
            </div>
        </div>
    )
}

export default CreateChannel
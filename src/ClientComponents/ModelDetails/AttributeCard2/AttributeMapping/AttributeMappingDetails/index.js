import React, { useState } from 'react'
import { Descriptions, Tag, Modal, Typography, Button } from 'antd'
import axios from 'axios'

const { Paragraph } = Typography
const AttributeMappingDetails = (props) => {
    const data = props.data
    const source_type = props.source_type

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hl7Example, setHl7Example] = useState(false);
    const mysql_endpoint = process.env.REACT_APP_MYSQL_SERVICE_ENDPOINT

    const OpenModal = async () => {
        await GetHL7Example()
        setIsModalOpen(true)
    }

    const GetHL7Example = async () => {
        const req_data = {
            msg_type: data.msg_type,
            msg_triggers: JSON.parse(data.msg_triggers),
            mapping: ParseMapping(data.mapping),
            attribute_name: data.field
        }

        const config = {
            method: 'post',
            url: `${mysql_endpoint}/api/hl7-example`,
            data: req_data
        };

        const axios_response = await axios(config)
        const response_data = axios_response.data
        setHl7Example(response_data)
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

    return (
        <>
            {
                source_type === 'hl7' &&
                <>
                    <Descriptions bordered column={1} style={{marginBottom: '1rem'}}>
                        <Descriptions.Item label='Message Type'>{data.msg_type}</Descriptions.Item>
                        <Descriptions.Item label='Message Triggers'>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {
                                    JSON.parse(data.msg_triggers).map((trigger) => (
                                        <Tag color='geekblue'>{trigger}</Tag>
                                    ))
                                }
                            </div>
                        </Descriptions.Item>
                        <Descriptions.Item label='Message Mapping'>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {
                                    ParseMapping(data.mapping).map((mapping_section) => (
                                        <Tag color='geekblue'>{mapping_section}</Tag>
                                    ))
                                }
                            </div>
                        </Descriptions.Item>
                    </Descriptions>
                    <Button type='primary' style={{ backgroundColor: '#FFA500' }} onClick={OpenModal}>
                        Show Example Message
                    </Button>
                </>
            }

            {
                source_type === 'fhir' &&
                <Descriptions bordered column={1}>
                    <Descriptions.Item label='FHIR Resource'>{data.fhir_resource}</Descriptions.Item>
                    <Descriptions.Item label='Mapping'>{data.mapping}</Descriptions.Item>
                </Descriptions>
            }

            {/* HL7 Message Example Modal */}
            <Modal title="Generated Example Message" open={isModalOpen} onOk={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)}>
                <Paragraph>
                    <pre>{hl7Example}</pre>
                </Paragraph>
            </Modal>
        </>
    )
}

export default AttributeMappingDetails
import React, { useState } from 'react'
import { Typography, Button, Tag, Modal } from 'antd'
import { Link } from 'react-router-dom'
import axios from 'axios'

const { Title, Paragraph } = Typography

const AttributeMappings = (props) => {
  const defaultMapping = props.data
  const mysql_endpoint = props.mysql_endpoint

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hl7Example, setHl7Example] = useState();

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

  // Parsing the mapping and message triggers
  const mapping = defaultMapping.mapping;
  const parsed_mapping = ParseMapping(mapping)
  defaultMapping.parsed_mapping = parsed_mapping;

  const OpenModal = async () => {
    await GetHL7Example()
    setIsModalOpen(true)
  }

  const GetHL7Example = async () => {
    var data = {
      msg_type: defaultMapping.msg_type,
      msg_triggers: JSON.parse(defaultMapping.msg_triggers),
      mapping: defaultMapping.parsed_mapping,
      attribute_name: defaultMapping.field
    }

    var config = {
      method: 'post',
      url: `${mysql_endpoint}/api/hl7-example`,
      data: data
    };

    const axios_response = await axios(config)
    const response_data = axios_response.data
    setHl7Example(response_data)
  }

  return (
    <>
      <Paragraph>
        This is the mapping for the <b>{defaultMapping.field}</b> attribute. This is exactly where the system will look for specific information in HL7 messages.
      </Paragraph>

      <div style={{ display: "flex", gap: "1rem", alignItems: 'center', marginBottom: '1rem' }}>
        <Paragraph style={{ margin: 0 }}>
          Can't match this exact mapping within your HL7 messages?
        </Paragraph>
        <Link to={'/issues'}>
          <Button type='primary' style={{ margin: 0 }}>Request Custom Mapping</Button>
        </Link>
      </div>

      {
        defaultMapping.client_id === 'Default' ?
          (<Tag color='gold'>Default</Tag>)
          :
          (<Tag color='geekblue'>Custom</Tag>)
      }
      <Paragraph>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Title style={{ margin: 0 }} level={5}>Message Type</Title>
          <pre>{defaultMapping.msg_type}</pre>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Title style={{ margin: 0 }} level={5}>Message Triggers</Title>
          {JSON.parse(defaultMapping.msg_triggers).map((msg_trigger) => (<pre>{msg_trigger}</pre>))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Title style={{ margin: 0 }} level={5}>Mapping</Title>
          {defaultMapping.parsed_mapping.map((mapping_section) => (<pre>{mapping_section}</pre>))}
        </div>
      </Paragraph>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Button type="primary" onClick={() => window.open(`https://hl7-definition.caristix.com/v2/HL7v2.5.1/Fields/${defaultMapping.parsed_mapping[1]}`)}>
          {defaultMapping.parsed_mapping[1]} Documentation
        </Button>
        <Button type='primary' style={{ backgroundColor: '#FFA500' }} onClick={OpenModal}>
          Show Example Message
        </Button>
      </div>

      {/* HL7 Message Example Modal */}
      <Modal title="Generated Example Message" open={isModalOpen} onOk={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)}>
        <Paragraph>
          <pre>{hl7Example}</pre>
        </Paragraph>
      </Modal>
    </>
  )
}

export default AttributeMappings
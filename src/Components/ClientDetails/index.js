import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios'
import endpoints from '../config/endpoints.json'
import { Typography, Descriptions, Button, Modal, Card, Tabs } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import ClientAccessControl from './ClientAccessControl'
import ClientCustomMappings from './ClientCustomMappings'
const { Title, Paragraph } = Typography
const app_env = process.env.REACT_APP_ENV
const mysql_endpoint = endpoints['mysql-ws'][app_env]
const ClientDetails = () => {
  const navigate = useNavigate();
  const { client_id } = useParams();
  const [clientData, setClientData] = useState({})
  const [confirmVisible, setConfirmVisible] = useState(false);



  const GetClientData = async () => {
    const url = `${mysql_endpoint}/api/clients/${client_id}`
    const method = 'get'
    const config = { method, url }

    const axios_response = await axios(config)
    setClientData(axios_response.data)
  }

  useEffect(() => {
    GetClientData()
  }, [])

  const DeleteClient = async () => {
    const url = `${mysql_endpoint}/api/clients/${clientData.client_id}`
    const method = 'delete'
    const config = { method, url }
    await axios(config)

    navigate('/clients')
    setConfirmVisible(false);
  }

  const tabItems = [
    {
      key: '1',
      label: `Access Control`,
      children: (
        <ClientAccessControl endpoint={mysql_endpoint} client_id={client_id} clientData={clientData}/>
      ),
    },
    {
      key: '2',
      label: `Custom Mappings`,
      children: (
        <ClientCustomMappings endpoint={mysql_endpoint} client_id={client_id} />
      ),
    },
    {
      key: '3',
      label: `Client Requests`,
      children: (
        <>Client Requests</>
      ),
    }
  ]


  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ marginTop: '1rem', marginBottom: '1rem' }}>{clientData.name}</Title>
        <Button danger onClick={() => setConfirmVisible(true)}>Delete</Button>
      </div>
      <Descriptions layout="horizontal">
        <Descriptions.Item label="Name"><Paragraph>{clientData.name}</Paragraph></Descriptions.Item>
        <Descriptions.Item label="Contact"><Paragraph copyable>{clientData.phone}</Paragraph></Descriptions.Item>
        <Descriptions.Item label="Email"><Paragraph copyable>{clientData.email}</Paragraph></Descriptions.Item>
        <Descriptions.Item label="Live">Hangzhou, Zhejiang</Descriptions.Item>
        <Descriptions.Item label="Address" span={2}>
          No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
        </Descriptions.Item>
        <Descriptions.Item label="Remark">empty</Descriptions.Item>
      </Descriptions>

      <Title level={2}>Model Interactions</Title>
      <Tabs defaultActiveKey="1" items={tabItems} />

      <Modal
        title="Are you sure you want to delete this client?"
        visible={confirmVisible}
        onCancel={() => setConfirmVisible(false)}
        onOk={DeleteClient}
        okText="Yes"
        cancelText="No"
      >
        <p>This action is permanent you will not be able to recover this information</p>
      </Modal>
      <Link to='/clients'>
        <Button type='primary' style={{ backgroundColor: '#F44336', marginTop: '1rem' }}>Back to Clients</Button>
      </Link>
    </>
  )
}

export default ClientDetails
import React, { useState, useEffect } from 'react'
import { Typography, Button, Table, notification } from 'antd'
import endpoints from '../config/endpoints.json'
import axios from 'axios'
import { Link } from 'react-router-dom'
import CreateNewClient from './CreateNew/index'

const app_env = process.env.REACT_APP_ENV
const mysql_endpoint = endpoints['mysql-ws'][app_env]

const { Title } = Typography

const Clients = () => {
  const [data, setData] = useState([]);
  const [createNew, setCreateNew] = useState(false)
  const [notificationApi, contextHolder] = notification.useNotification();

  const GetAllClients = async () => {
    const url = `${mysql_endpoint}/api/clients`
    const response = await axios.get(url)
    setData(response.data)
  }

  useEffect(() => {
    GetAllClients()
  }, []);

  const columns = [
    { title: 'Primary Email', dataIndex: 'email', key: 'email' },
    { title: 'Client Name', dataIndex: 'name', key: 'name' },
    { title: 'Phone Number', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Actions',
      key: 'action',
      render: (text, record) => (
        <div>
          <Link to={`/clients/${record.client_id}`}>
            <Button type='primary'>
              Inspect
            </Button>
          </Link>
        </div>
      ),
    }
  ]

  return (
    <>
      {contextHolder}
      {

        createNew ?
          <CreateNewClient setCreateNew={setCreateNew} mysql_endpoint={mysql_endpoint} notificationApi={notificationApi} GetAllClients={GetAllClients}/>
          :
          <>
            <Title level={2}>Clients</Title>
            <Table dataSource={data} columns={columns} />
            <Button type='primary' style={{ backgroundColor: '#4CAF50' }} onClick={() => setCreateNew(true)}>New Client</Button>
          </>
      }

    </>
  )
}

export default Clients
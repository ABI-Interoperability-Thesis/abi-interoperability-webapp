import React, { useState, useEffect } from 'react'
import endpoints from '../config/endpoints.json'
import axios from 'axios'
import './index.css'
import CreateChannel from '../CreateChannel/index'

import { Typography, Table, Tabs, Button, notification } from 'antd'

const app_env = process.env.REACT_APP_ENV
const mirth_endpoint = endpoints['mirth-api'][app_env]
const preprocessor_endpoint = endpoints['preprocessor-ws'][app_env]
const { Title } = Typography

const Channels = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRowKeysDeploy, setSelectedRowKeysDeploy] = useState([]);
  const [channelData, setChannelData] = useState([])
  const [channelDeployData, setChannelDeployData] = useState([])
  const [createNewChannel, setCreateNewChannel] = useState(false)

  const GetAllChannels = async () => {
    const url = `${mirth_endpoint}/api/channels`
    const response = await axios.get(url)
    const prepared_data = response.data.map((channel) => {
      return {
        key: channel.id,
        ...channel
      }
    })
    setChannelData(prepared_data)
  }

  const GetAllDeployedChannels = async () => {
    const url = `${mirth_endpoint}/api/channels/deployed`
    const response = await axios.get(url)
    setChannelDeployData(response.data)
  }

  const DeployChannels = async () => {
    for (let i = 0; i < selectedRowKeys.length; i++) {
      const channel_id = selectedRowKeys[i];
      const config = {
        method: 'post',
        url: `${mirth_endpoint}/api/channels/deploy/${channel_id}`
      }
      const mirth_response = await axios(config)

      mirth_response.status === 200 ? notificationApi.success({
        message: 'Channel deployed successfully',
        description: 'The channel was deployed successfully'
      }) : notificationApi.error({
        message: 'Channel not deployed',
        description: 'The channel was not deployed. There was an error'
      })
      GetAllDeployedChannels()
      setSelectedRowKeys('')
    }
  }

  const DeleteChannels = async () => {
    for (let i = 0; i < selectedRowKeys.length; i++) {
      const channel_id = selectedRowKeys[i];
      const config = {
        method: 'delete',
        url: `${mirth_endpoint}/api/channels/${channel_id}`
      }
      const mirth_response = await axios(config)

      mirth_response.status === 200 ? notificationApi.success({
        message: 'Channel deleted successfully',
        description: 'The channel was deleted successfully'
      }) : notificationApi.error({
        message: 'Channel not deleted',
        description: 'The channel was not deleted. There was an error'
      })
      GetAllDeployedChannels()
      GetAllChannels()
      setSelectedRowKeys('')
    }
  }

  const UndeployChannels = async () => {
    for (let i = 0; i < selectedRowKeysDeploy.length; i++) {
      const channel_id = selectedRowKeysDeploy[i];
      const config = {
        method: 'post',
        url: `${mirth_endpoint}/api/channels/undeploy/${channel_id}`
      }
      const mirth_response = await axios(config)

      mirth_response.status === 200 ? notificationApi.success({
        message: 'Channel undeployed successfully',
        description: 'The channel was undeployed successfully'
      }) : notificationApi.error({
        message: 'Channel not deployed',
        description: 'The channel was not undeployed. There was an error'
      })
      GetAllDeployedChannels()
      setSelectedRowKeysDeploy([])
    }

  }

  useEffect(() => {
    GetAllChannels()
    GetAllDeployedChannels()
  }, []);

  const columns = [
    { title: 'Channel name', dataIndex: 'name', key: 'name' },
    { title: 'Channel Description', dataIndex: 'description', key: 'description' },
    { title: 'Channel Type', dataIndex: 'type', key: 'type' },
    { title: 'Version', dataIndex: 'version', key: 'version' },
    { title: 'Port', dataIndex: 'port', key: 'port' },
    { title: 'Channel Mode', dataIndex: 'channel_mode', key: 'channel_mode' },
    { title: 'Revision', dataIndex: 'revision', key: 'revision' },
  ]

  const columns_deployed = [
    { title: 'Channel Name', dataIndex: 'channel_name', key: 'channel_name' },
    { title: 'State', dataIndex: 'state', key: 'state' },
    { title: 'Deployed Revision', dataIndex: 'deployed_revision', key: 'deployed_revision' },
  ]

  const rowSelection = {
    type: 'checkbox',
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys)
    }
  };

  const rowSelectionDeployed = {
    type: 'checkbox',
    selectedRowKeysDeploy,
    onChange: (selectedRowKeysDeploy, selectedRows) => {
      setSelectedRowKeysDeploy(selectedRowKeysDeploy)
    }
  }

  const items = [
    {
      key: '1',
      label: `All Channels`,
      children: (
        <>
          <Title level={2}>Channels</Title>
          <Table rowSelection={rowSelection} dataSource={channelData} columns={columns} />
          {
            selectedRowKeys.length > 0 &&
            <div className='channel-buttons-container'>
              <Button type='primary' style={{ backgroundColor: '#2196F3' }} onClick={DeployChannels}>Deploy</Button>
              <Button type='primary' style={{ backgroundColor: '#F44336' }} onClick={DeleteChannels}>Delete</Button>
            </div>
          }
        </>
      ),
    },
    {
      key: '2',
      label: `Deployed Channels`,
      children: (
        <>
          <Title level={2}>Channels</Title>
          <Table rowSelection={rowSelectionDeployed} dataSource={channelDeployData} columns={columns_deployed} />
          {
            selectedRowKeysDeploy.length > 0 &&
            <div className='channel-buttons-container'>
              <Button type='primary' style={{ backgroundColor: '#FF9800' }} onClick={UndeployChannels}>Undeploy</Button>
            </div>
          }
        </>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      {
        !createNewChannel ?
          (<>
            <Tabs defaultActiveKey="1" items={items} />
            <Button type='primary' style={{ backgroundColor: '#4CAF50' }} onClick={() => setCreateNewChannel(true)}>New Channel</Button>
          </>)
          :
          (<CreateChannel setCreateNewChannel={setCreateNewChannel} mirth_endpoint={mirth_endpoint} preprocessor_endpoint={preprocessor_endpoint} />)

      }
    </>
  )
}

export default Channels
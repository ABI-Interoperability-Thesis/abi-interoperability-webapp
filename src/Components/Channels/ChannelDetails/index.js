import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom';
import endpoints from '../../config/endpoints.json'
import axios from 'axios'
import { Typography, Tag, Tabs, Button } from 'antd'
import ChannelSummary from './ChannelSummary'
import ChannelSource from './ChannelSource'
import ChannelDestinations from './ChannelDestinations'
import ChannelScripts from './ChannelScripts'
import ChannelStatistics from './ChannelStatistics'

const { Title, Paragraph } = Typography

const app_env = process.env.REACT_APP_ENV
const mirth_endpoint = process.env.REACT_APP_MIRTH_SERVICE_ENDPOINT

const ChannelDetails = () => {
  const { channel_id } = useParams();

  const [channelData, setChannelData] = useState();

  const GetChannelData = async () => {
    const url = `${mirth_endpoint}/api/channels/${channel_id}`
    const method = 'get'
    const config = { url, method }
    try {
      const axios_response = await axios(config)
      const channel_details = axios_response.data
      setChannelData(channel_details)
    } catch (error) {
      const error_status = error.response.status
      if (error_status === 404) {
        setChannelData('not found')
      }
    }
  }

  const DeployChannel = async () => {
    const url = `${mirth_endpoint}/api/channels/deploy/${channel_id}`
    const method = 'post'
    const config = { url, method }
    try {
      const axios_response = await axios(config)
      const channel_details = axios_response.data
      alert('channel deployed')
      GetChannelData()
    } catch (error) {
      const error_status = error.response.status
      if (error_status === 404) {
        alert('there was an error')
        GetChannelData()
      }
    }
  }

  const UndeployChannel = async () => {
    const url = `${mirth_endpoint}/api/channels/undeploy/${channel_id}`
    const method = 'post'
    const config = { url, method }
    try {
      const axios_response = await axios(config)
      const channel_details = axios_response.data
      alert('channel deployed')
      GetChannelData()
    } catch (error) {
      const error_status = error.response.status
      if (error_status === 404) {
        alert('there was an error')
        GetChannelData()
      }
    }
  }



  useEffect(() => {
    GetChannelData()
  }, [])

  const GenerateChannelTabs = () => {
    const channel_tabs = [
      {
        key: '1',
        label: `Channel Summary`,
        children: (<ChannelSummary channelData={channelData} />)
      },
      {
        key: '2',
        label: `Channel Source`,
        children: (<ChannelSource connectorData={channelData.sourceConnector} />),
      },
      {
        key: '3',
        label: `Channel Destinations`,
        children: (<ChannelDestinations destinationConnectors={channelData.destinationConnectors} />),
      },
      {
        key: '4',
        label: 'Scripts',
        children: (<ChannelScripts data={{ preprocessingScript: channelData.preprocessingScript, postprocessingScript: channelData.postprocessingScript, deployScript: channelData.deployScript, undeployScript: channelData.undeployScript }} />)
      }
    ]

    if (channelData.channel_deployed){
      channel_tabs.push({
        key: '5',
        label: 'Statistics',
        children:(<ChannelStatistics channel_stats={channelData.channel_status} />)
      })
    }

    return channel_tabs
  }

  return (
    <>
      {
        channelData &&
        <>
          <div style={{ display: "flex", alignItems: 'center', justifyContent: 'space-between' }}>
            <Title level={2}>{channelData.name}</Title>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Tag>{channelData.id}</Tag>
              {
                channelData.channel_deployed ?
                  <Tag color='success'>Deployed</Tag>
                  :
                  <Tag color='error'>Not Deployed</Tag>
              }
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            {
              channelData.channel_deployed ?
                <Button type='primary' onClick={UndeployChannel}>Undeploy</Button>
                :
                <Button type='primary' onClick={DeployChannel}>Deploy</Button>
            }
          </div>

          <Tabs defaultActiveKey="1" items={GenerateChannelTabs()} />
        </>
      }
    </>
  )
}

export default ChannelDetails
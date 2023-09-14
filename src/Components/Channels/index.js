import React, { useState, useEffect } from 'react'
import endpoints from '../config/endpoints.json'
import axios from 'axios'
import './index.css'
import { Typography } from 'antd'
import CreateRunnerChannel from './CreateRunnerChannel'
import Loading from '../../Common/Loading'

const app_env = process.env.REACT_APP_ENV
const mirth_endpoint = process.env.REACT_APP_MIRTH_SERVICE_ENDPOINT
const mysql_endpoint = process.env.REACT_APP_MYSQL_SERVICE_ENDPOINT

const { Title, Paragraph } = Typography

const Channels = () => {
  const [mirthChannels, setMirthChannels] = useState();
  const [loading, setLoading] = useState(true);

  const GetChannelIds = async () => {
    // Getting mirth channels ids
    const url = `${mysql_endpoint}/api/mirth-channels`
    const method = 'get'
    const config = { method, url }
    const axios_response = await axios(config)
    const mirth_ids = axios_response.data

    console.log(mirth_ids)
    const hl7_mapper_info = mirth_ids['hl7_mapper'] === 'not found' ? 'not found' : await GetChannelInfo(mirth_ids['hl7_mapper'])
    console.log(hl7_mapper_info)

    console.log({ hl7_mapper_info })
    setMirthChannels({ hl7_mapper_info })
    setLoading(false)

  }

  const GetChannelInfo = async (channel_id) => {
    const url = `${mirth_endpoint}/api/channels/channel-info/${channel_id}`
    const method = 'get'
    const config = { url, method }
    try {
      const axios_response = await axios(config)
      const runner_info = axios_response.data
      return runner_info
    } catch (error) {
      const error_status = error.response.status
      if (error_status === 404) {
        return 'not found'
      }
    }
  }

  useEffect(() => {
    GetChannelIds()
  }, []);

  return (
    <>
      {
        loading ?
          (<Loading />) :
          (
            <>
              <Title level={2}>Mirth Connect Channels</Title>
              {
                mirthChannels &&
                <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                  <CreateRunnerChannel GetChannelIds={GetChannelIds} channel_type='hl7_mapper' runner_info={mirthChannels.hl7_mapper_info} mirth_endpoint={mirth_endpoint} />
                </div>
              }
            </>
          )
      }
    </>
  )
}

export default Channels
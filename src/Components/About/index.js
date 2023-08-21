import React, { useState, useEffect } from 'react'
import axios from 'axios'
import endpoints from '../config/endpoints.json'
import { Descriptions, Typography, Tabs } from 'antd'
import Loading from '../../Common/Loading'

const { Title } = Typography
const app_env = process.env.REACT_APP_ENV
const mirth_endpoint = process.env.REACT_APP_MIRTH_SERVICE_ENDPOINT
const mysql_endpoint = process.env.REACT_APP_MYSQL_SERVICE_ENDPOINT
const rabbitmq_endpoint = process.env.REACT_APP_RABBITMQ_SERVICE_ENDPOINT


const About = () => {
  const [systemData, setSystemData] = useState()
  const [loading, setLoading] = useState(true)

  const GetSystemData = async () => {
    setLoading(true)
    const config = {
      url: `${mirth_endpoint}/api/channels/system-info/about`,
      method: 'get'
    }

    const axios_response = await axios(config)
    setSystemData(axios_response.data)
    setLoading(false)
  }

  useEffect(() => {
    GetSystemData()
  }, [])

  return (
    <>
      {
        loading ?
          (
            <Loading />
          )
          :
          (
            <>
              {
                systemData &&
                <>
                  <Title level={2}>About System</Title>
                  <Tabs items={[
                    {
                      key: '1',
                      label: 'ABI System',
                      children: (
                        <>
                          <Descriptions bordered column={1} title="System's Microservice Endpoints">
                            <Descriptions.Item label="Mirth Connect Handler"><a href={`${mirth_endpoint}/api-docs`}>{mirth_endpoint}</a></Descriptions.Item>
                            <Descriptions.Item label="MySQL Handler"><a href={`${mysql_endpoint}/api-docs`}>{mysql_endpoint}</a></Descriptions.Item>
                            <Descriptions.Item label="RabbitMQ Handler"><a href={`${rabbitmq_endpoint}/api-docs`}>{rabbitmq_endpoint}</a></Descriptions.Item>
                          </Descriptions>
                        </>
                      )
                    },
                    {
                      key: '2',
                      label: 'Mirth Connect',
                      children: (
                        <>
                          <Descriptions title='System Info' bordered column={1}>
                            <Descriptions.Item label="JVM Version">{systemData['system_info']['com.mirth.connect.model.SystemInfo'].jvmVersion}</Descriptions.Item>
                            <Descriptions.Item label="OS Name">{systemData['system_info']['com.mirth.connect.model.SystemInfo'].osName}</Descriptions.Item>
                            <Descriptions.Item label="OS Version">{systemData['system_info']['com.mirth.connect.model.SystemInfo'].osVersion}</Descriptions.Item>
                            <Descriptions.Item label="OS Architecture">{systemData['system_info']['com.mirth.connect.model.SystemInfo'].osArchitecture}</Descriptions.Item>
                            <Descriptions.Item label="Database Name">{systemData['system_info']['com.mirth.connect.model.SystemInfo'].dbName}</Descriptions.Item>
                            <Descriptions.Item label="Database Version">{systemData['system_info']['com.mirth.connect.model.SystemInfo'].dbVersion}</Descriptions.Item>
                          </Descriptions>

                          <Descriptions style={{ marginTop: '1rem' }} title='System Statistics' bordered column={1}>
                            <Descriptions.Item label="CPU Usasge">{systemData['system_stats']['com.mirth.connect.model.SystemStats'].cpuUsagePct.toFixed(5)} %</Descriptions.Item>
                            <Descriptions.Item label="Allocated Memory Bytes">{systemData['system_stats']['com.mirth.connect.model.SystemStats'].allocatedMemoryBytes}</Descriptions.Item>
                            <Descriptions.Item label="Free Memory Bytes">{systemData['system_stats']['com.mirth.connect.model.SystemStats'].freeMemoryBytes}</Descriptions.Item>
                            <Descriptions.Item label="Max Memory Bytes">{systemData['system_stats']['com.mirth.connect.model.SystemStats'].maxMemoryBytes}</Descriptions.Item>
                            <Descriptions.Item label="Disk Free Bytes">{systemData['system_stats']['com.mirth.connect.model.SystemStats'].diskFreeBytes}</Descriptions.Item>
                            <Descriptions.Item label="Disk Total Bytes">{systemData['system_stats']['com.mirth.connect.model.SystemStats'].diskTotalBytes}</Descriptions.Item>
                          </Descriptions>
                        </>
                      )
                    }
                  ]} />
                </>
              }
            </>
          )
      }
    </>
  )
}

export default About
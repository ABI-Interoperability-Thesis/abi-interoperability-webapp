import React from 'react'
import { Typography, Descriptions, Divider } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import DestinationProperties from './DestinationProperties'
import ChannelTasks from './ChannelTasks'

const { Title } = Typography

const DestinationDetails = (props) => {
  const connector = props.connector
  return (
    <>
      <Title level={3}>{connector.name}</Title>
      <Descriptions title='Destination Summary'>
        <Descriptions.Item label='Transport Type'>{connector.transportName}</Descriptions.Item>
        <Descriptions.Item label='Transport Mode'>{connector.mode}</Descriptions.Item>
        <Descriptions.Item label='Enabled'>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {
              connector.enabled ?
                (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} />) :
                (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />)
            }
          </div>
        </Descriptions.Item>
        <Descriptions.Item label='Wait for previous'>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {
              connector.waitForPrevious ?
                (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} />) :
                (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />)
            }
          </div>
        </Descriptions.Item>
        <Descriptions.Item label='Version'>{connector['@version']}</Descriptions.Item>

      </Descriptions>

      <Divider>Destination Properties</Divider>
      <DestinationProperties destination_type={connector.transportName} properties={connector.properties}/>
      
      <Divider>Channel Tasks</Divider>
      <ChannelTasks data={{transformers: connector.transformer,responses: connector.responseTransformer,filters: connector.filter}} />



    </>
  )
}

export default DestinationDetails
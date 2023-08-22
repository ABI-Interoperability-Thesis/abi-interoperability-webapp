import React from 'react'
import { Typography, Tag, Tabs, Descriptions } from 'antd'

const { Title, Paragraph } = Typography

const ChannelSummary = (props) => {
  const channelData = props.channelData
  return (
    <>
      <Descriptions title="Channel Summary" bordered column={1}>
        <Descriptions.Item label="Channel Name">{channelData.name}</Descriptions.Item>
        <Descriptions.Item label="Channel Description">{channelData['description']}</Descriptions.Item>
        <Descriptions.Item label="Revisions">{channelData['revision']}</Descriptions.Item>
        <Descriptions.Item label="Channel Storage">{channelData['properties']['messageStorageMode']}</Descriptions.Item>
        <Descriptions.Item label="Last Modified">{channelData.exportData.metadata.lastModified.time}</Descriptions.Item>
        <Descriptions.Item label="Version">{channelData['@version']}</Descriptions.Item>
      </Descriptions>

    </>
  )
}

export default ChannelSummary
import React from 'react'
import { Typography, Tabs } from 'antd'

const { Title, Paragraph } = Typography

const ChannelScripts = (props) => {
  const data = props.data
  return (
    <>
    <Tabs tabPosition='left' defaultActiveKey="1" items={[
            {
              key: '1',
              label: `Preprocessing Script`,
              children: (
                <Paragraph>
                  <pre>{data.preprocessingScript}</pre>
                </Paragraph>
              )
            },
            {
              key: '2',
              label: `Postprocessing Script`,
              children: (
                <Paragraph>
                  <pre>{data.postprocessingScript}</pre>
                </Paragraph>
              )
            },
            {
              key: '3',
              label: `Deployment Script`,
              children: (
                <Paragraph>
                  <pre>{data.deployScript}</pre>
                </Paragraph>
              )
            },
            {
              key: '4',
              label: 'Undeployment Script',
              children: (
                <Paragraph>
                  <pre>{data.undeployScript}</pre>
                </Paragraph>
              )
            }
          ]} />
    </>
  )
}

export default ChannelScripts
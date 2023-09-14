import React from 'react'
import { Tabs } from 'antd'
import DestinationDetails from './DestinationDetails'

const ChannelDestinations = (props) => {
  const destinationConnectors = props.destinationConnectors

  let items = []
  if (!Array.isArray(destinationConnectors.connector)) {
    items.push({
      key: 0,
      label: destinationConnectors.connector.name,
      children: (<DestinationDetails connector={destinationConnectors.connector} />),
    })
  } else {

    items = destinationConnectors.connector.map((connector, index) => {
      return {
        key: index,
        label: connector.name,
        children: (<DestinationDetails connector={connector} />),
      }
    })
  }

  return (
    <div>
      <Tabs tabPosition='left' items={items} defaultActiveKey='1' />
    </div>
  )
}

export default ChannelDestinations
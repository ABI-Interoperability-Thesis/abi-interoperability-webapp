import React from 'react'
import { Typography, Divider, Tabs, Empty, Card, Descriptions } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography;

const ChannelSource = (props) => {
    const connectorData = props.connectorData
    return (
        <>
            <Descriptions style={{ marginTop: '1rem' }} title='Source Connector Summary'>
                <Descriptions.Item label='Name'>{connectorData.name}</Descriptions.Item>
                <Descriptions.Item label='Transport Type'>{connectorData.transportName}</Descriptions.Item>
                <Descriptions.Item label='Transport Mode'>{connectorData.mode}</Descriptions.Item>
                <Descriptions.Item label='Enabled'>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {
                            connectorData.enabled ?
                                (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} />) :
                                (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />)
                        }
                    </div>
                </Descriptions.Item>
                <Descriptions.Item label='Wait for previous'>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {
                            connectorData.waitForPrevious ?
                                (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} />) :
                                (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />)
                        }
                    </div>
                </Descriptions.Item>
                <Descriptions.Item label='Version'>{connectorData['@version']}</Descriptions.Item>
            </Descriptions>

            <Descriptions style={{ marginTop: '1rem' }} title='Listener Connector Properties' bordered column={1}>
                <Descriptions.Item label='Listener Host'>{connectorData.properties.listenerConnectorProperties.host}</Descriptions.Item>
                <Descriptions.Item label='Listener Port'>{connectorData.properties.listenerConnectorProperties.port}</Descriptions.Item>
            </Descriptions>

            <Descriptions style={{ marginTop: '1rem' }} title='Plugin Properties' bordered column={1}>
                <Descriptions.Item label='Auth'>{connectorData.properties.pluginProperties['com.mirth.connect.plugins.httpauth.basic.BasicHttpAuthProperties'].authType}</Descriptions.Item>
            </Descriptions>

            <Descriptions style={{ marginTop: '1rem' }} title='Source Connector Properties' bordered column={1}>
                <Descriptions.Item label='Response Destination'>{connectorData.properties.sourceConnectorProperties.responseVariable}</Descriptions.Item>

                <Descriptions.Item label="Respond After Processing">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {
                            connectorData.properties.sourceConnectorProperties.respondAfterProcessing ?
                                (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} />) :
                                (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />)
                        }
                    </div>
                </Descriptions.Item>

                <Descriptions.Item label="Process Batch">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {
                            connectorData.properties.sourceConnectorProperties.processBatch ?
                                (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} />) :
                                (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />)
                        }
                    </div>
                </Descriptions.Item>

                <Descriptions.Item label="First Response">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {
                            connectorData.properties.sourceConnectorProperties.firstResponse ?
                                (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} />) :
                                (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />)
                        }
                    </div>
                </Descriptions.Item>

                <Descriptions.Item label="Processing Threads">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {
                            connectorData.properties.sourceConnectorProperties.processingThreads ?
                                (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} />) :
                                (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />)
                        }
                    </div>
                </Descriptions.Item>

                <Descriptions.Item label="Queue Buffer Size">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {
                            connectorData.properties.sourceConnectorProperties.queueBufferSize ?
                                (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} />) :
                                (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />)
                        }
                    </div>
                </Descriptions.Item>
            </Descriptions>

            <Descriptions style={{ marginTop: '1rem' }} title='Properties' bordered column={1}>
                <Descriptions.Item label='Binary MimeTypes'>{connectorData.properties.binaryMimeTypes}</Descriptions.Item>
                <Descriptions.Item label='Binary MimeTypes'>{connectorData.properties.charset}</Descriptions.Item>
                <Descriptions.Item label='Binary MimeTypes'>{connectorData.properties.timeout}</Descriptions.Item>
                <Descriptions.Item label='Version'>{connectorData.properties['@version']}</Descriptions.Item>
                <Descriptions.Item label="Xml Body">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {
                            connectorData.properties.xmlBody ?
                                (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} />) :
                                (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />)
                        }
                    </div>
                </Descriptions.Item>
                <Descriptions.Item label="Parse MultiPart">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {
                            connectorData.properties.parseMultipart ?
                                (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} />) :
                                (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />)
                        }
                    </div>
                </Descriptions.Item>
                <Descriptions.Item label="Include Metadata">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {
                            connectorData.properties.includeMetadata ?
                                (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} />) :
                                (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />)
                        }
                    </div>
                </Descriptions.Item>
                <Descriptions.Item label="Binary MimeTypes Regex">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {
                            connectorData.properties.binaryMimeTypesRegex ?
                                (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} />) :
                                (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />)
                        }
                    </div>
                </Descriptions.Item>
                <Descriptions.Item label="Response DataType Binary">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {
                            connectorData.properties.responseDataTypeBinary ?
                                (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} />) :
                                (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />)
                        }
                    </div>
                </Descriptions.Item>

                <Descriptions.Item label="Use Response Headers Variable">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {
                            connectorData.properties.useResponseHeadersVariable ?
                                (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} />) :
                                (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />)
                        }
                    </div>
                </Descriptions.Item>
            </Descriptions>

            <Divider>Channel Tasks</Divider>
            <Tabs items={[
                {
                    key: '1',
                    label: 'Filters',
                    children: (
                        <>
                            <Empty description='There are no filters setup for this channel' />
                        </>
                    )
                },
                {
                    key: '2',
                    label: 'Transformers',
                    children: (
                        <>
                            {
                                !Array.isArray(connectorData.transformer.elements['com.mirth.connect.plugins.mapper.MapperStep']) ?
                                    <Descriptions title={connectorData.transformer.elements['com.mirth.connect.plugins.mapper.MapperStep'].name}>
                                        <Descriptions.Item label='Variable'>{connectorData.transformer.elements['com.mirth.connect.plugins.mapper.MapperStep'].variable}</Descriptions.Item>
                                        <Descriptions.Item label='Mapping'>{connectorData.transformer.elements['com.mirth.connect.plugins.mapper.MapperStep'].mapping}</Descriptions.Item>
                                        <Descriptions.Item label='Scope'>{connectorData.transformer.elements['com.mirth.connect.plugins.mapper.MapperStep'].scope}</Descriptions.Item>
                                        <Descriptions.Item label='Version'>{connectorData.transformer.elements['com.mirth.connect.plugins.mapper.MapperStep']['@version']}</Descriptions.Item>
                                        <Descriptions.Item label='Enabled'>
                                            {
                                                connectorData.transformer.elements['com.mirth.connect.plugins.mapper.MapperStep'].enabled ?
                                                    (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} />) :
                                                    (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />)
                                            }
                                        </Descriptions.Item>
                                    </Descriptions>
                                    :
                                    <>
                                        {
                                            connectorData.transformer.elements['com.mirth.connect.plugins.mapper.MapperStep'].map((transformer) => (
                                                <Descriptions title={transformer.name}>
                                                    <Descriptions.Item label='Variable'>{transformer.variable}</Descriptions.Item>
                                                    <Descriptions.Item label='Mapping'>{transformer.mapping}</Descriptions.Item>
                                                    <Descriptions.Item label='Scope'>{transformer.scope}</Descriptions.Item>
                                                    <Descriptions.Item label='Version'>{transformer['@version']}</Descriptions.Item>
                                                    <Descriptions.Item label='Enabled'>
                                                        {
                                                            transformer.enabled ?
                                                                (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} />) :
                                                                (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />)
                                                        }
                                                    </Descriptions.Item>
                                                </Descriptions>
                                            ))
                                        }
                                    </>
                            }
                        </>
                    )
                }
            ]} />
        </>
    )
}

export default ChannelSource
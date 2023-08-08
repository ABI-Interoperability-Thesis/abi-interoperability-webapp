import React from 'react'
import { Typography, Descriptions, Divider, Empty } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
const { Title, Paragraph } = Typography

const DestinationProperties = (props) => {
    const destination_type = props.destination_type
    const properties = props.properties

    return (
        <>
            {
                destination_type === 'HTTP Sender' ?
                    (
                        <>
                            <Descriptions column={1} bordered>
                                <Descriptions.Item label="Endpoint">{properties.host}</Descriptions.Item>
                                <Descriptions.Item label="Method">{properties.method}</Descriptions.Item>
                                <Descriptions.Item label="Response Binary MimeTypes">{properties.responseBinaryMimeTypes}</Descriptions.Item>
                                <Descriptions.Item label="Authentication Type">{properties.authenticationType}</Descriptions.Item>
                                <Descriptions.Item label="Content Type">{properties.contentType}</Descriptions.Item>
                                <Descriptions.Item label="Charset">{properties.charset}</Descriptions.Item>
                                <Descriptions.Item label="Socket Timeout">{properties.socketTimeout}</Descriptions.Item>
                                <Descriptions.Item label="Use Proxy Server">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {
                                            properties.useProxyServer ?
                                                (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} />) :
                                                (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />)
                                        }
                                    </div>
                                </Descriptions.Item>
                                <Descriptions.Item label="Use Headers Variable">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {
                                            properties.useHeadersVariable ?
                                                (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} />) :
                                                (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />)
                                        }
                                    </div>
                                </Descriptions.Item>
                                <Descriptions.Item label="Use Parameters Variable">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {
                                            properties.useParametersVariable ?
                                                (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} />) :
                                                (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />)
                                        }
                                    </div>
                                </Descriptions.Item>
                                <Descriptions.Item label="Response Xml Body">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {
                                            properties.responseXmlBody ?
                                                (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} />) :
                                                (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />)
                                        }
                                    </div>
                                </Descriptions.Item>
                                <Descriptions.Item label="Response Parse Multipart">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {
                                            properties.responseParseMultipart ?
                                                (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} />) :
                                                (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />)
                                        }
                                    </div>
                                </Descriptions.Item>
                                <Descriptions.Item label="Response Includes Metadata">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {
                                            properties.responseIncludeMetadata ?
                                                (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} />) :
                                                (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />)
                                        }
                                    </div>
                                </Descriptions.Item>
                                <Descriptions.Item label="Multipart">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {
                                            properties.multipart ?
                                                (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} />) :
                                                (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />)
                                        }
                                    </div>
                                </Descriptions.Item>
                                <Descriptions.Item label="Use Authentication">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {
                                            properties.useAuthentication ?
                                                (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} />) :
                                                (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />)
                                        }
                                    </div>
                                </Descriptions.Item>
                                <Descriptions.Item label="Version">{properties['@version']}</Descriptions.Item>
                            </Descriptions>

                            <Divider>Headers</Divider>
                            {
                                properties.headers.entry ?
                                    (
                                        <Descriptions column={1} bordered>
                                            <Descriptions.Item label={properties.headers.entry.string}>{properties.headers.entry.list.string}</Descriptions.Item>
                                        </Descriptions>
                                    ) :
                                    (<Empty description='This Destination does not have any configured headers' />)
                            }
                        </>
                    ) :
                    (
                        <>
                            <Descriptions column={1} bordered>
                                <Descriptions.Item label="Queue Buffer Size">{properties.destinationConnectorProperties['queueBufferSize']}</Descriptions.Item>
                                <Descriptions.Item label="Thread Count">{properties.destinationConnectorProperties['threadCount']}</Descriptions.Item>
                                <Descriptions.Item label="Retry Count">{properties.destinationConnectorProperties['retryCount']}</Descriptions.Item>
                                <Descriptions.Item label="Retry Interval">{properties.destinationConnectorProperties['retryIntervalMillis']}</Descriptions.Item>
                                <Descriptions.Item label="Queue Enabled">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {
                                            properties.destinationConnectorProperties.queueEnabled ?
                                                (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} />) :
                                                (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />)
                                        }
                                    </div>
                                </Descriptions.Item>
                                <Descriptions.Item label="Send First">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {
                                            properties.destinationConnectorProperties.sendFirst ?
                                                (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} />) :
                                                (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />)
                                        }
                                    </div>
                                </Descriptions.Item>
                                <Descriptions.Item label="Regenerate Template">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {
                                            properties.destinationConnectorProperties.regenerateTemplate ?
                                                (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} />) :
                                                (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />)
                                        }
                                    </div>
                                </Descriptions.Item>
                                <Descriptions.Item label="Rotate">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {
                                            properties.destinationConnectorProperties.rotate ?
                                                (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} />) :
                                                (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />)
                                        }
                                    </div>
                                </Descriptions.Item>
                                <Descriptions.Item label="Include Filter Transformer">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {
                                            properties.destinationConnectorProperties.includeFilterTransformer ?
                                                (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} />) :
                                                (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />)
                                        }
                                    </div>
                                </Descriptions.Item>
                                <Descriptions.Item label="Validate Response">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {
                                            properties.destinationConnectorProperties.validateResponse ?
                                                (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} />) :
                                                (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />)
                                        }
                                    </div>
                                </Descriptions.Item>
                                <Descriptions.Item label="Reattach Attachments">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {
                                            properties.destinationConnectorProperties.reattachAttachments ?
                                                (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50' }} />) :
                                                (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800' }} />)
                                        }
                                    </div>
                                </Descriptions.Item>
                                <Descriptions.Item label="Version">{properties.destinationConnectorProperties['@version']}</Descriptions.Item>
                            </Descriptions>

                            <Title level={3}>Destination Script</Title>
                            <Paragraph>
                                <pre>{properties.script}</pre>
                            </Paragraph>
                        </>
                    )
            }
        </>
    )
}

export default DestinationProperties
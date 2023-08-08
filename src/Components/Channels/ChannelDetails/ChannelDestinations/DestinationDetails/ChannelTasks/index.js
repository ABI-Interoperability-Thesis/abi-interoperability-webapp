import React from 'react'
import { Tabs, Empty, Descriptions, Typography } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography


const ChannelTasks = (props) => {
    const data = props.data

    return (
        <>
            <Tabs defaultActiveKey="1" items={[
                {
                    key: '1',
                    label: `Filters`,
                    children: (
                        <>
                            {
                                data.filters.elements === null ?
                                    (<Empty description='There are no filters defined for the source connector' />) : (
                                        <>
                                            {
                                                Array.isArray(data.filters.elements['com.mirth.connect.plugins.rulebuilder.RuleBuilderRule']) ?
                                                    (
                                                        <>
                                                            {
                                                                data.filters.elements['com.mirth.connect.plugins.rulebuilder.RuleBuilderRule'].map((filter) => (
                                                                    <Descriptions title={filter.name} column={3}>
                                                                        <Descriptions.Item label='Field'>{filter.field}</Descriptions.Item>
                                                                        <Descriptions.Item label='Condition'>{filter.condition}</Descriptions.Item>
                                                                        <Descriptions.Item label='Value'>{filter.values.string.toString()}</Descriptions.Item>
                                                                    </Descriptions>
                                                                ))
                                                            }
                                                        </>
                                                    ) :
                                                    (
                                                        <>
                                                            {
                                                                [data.filters.elements['com.mirth.connect.plugins.rulebuilder.RuleBuilderRule']].map((filter) => (
                                                                    <Descriptions title={filter.name} column={3}>
                                                                        <Descriptions.Item label='Field'>{filter.field}</Descriptions.Item>
                                                                        <Descriptions.Item label='Condition'>{filter.condition}</Descriptions.Item>
                                                                        <Descriptions.Item label='Value'>{filter.values.string.toString()}</Descriptions.Item>
                                                                    </Descriptions>
                                                                ))
                                                            }
                                                        </>
                                                    )
                                            }
                                        </>
                                    )
                            }
                        </>
                    )
                },
                {
                    key: '2',
                    label: `Transformers`,
                    children: (
                        <>
                            {
                                data.transformers.elements === null ?
                                    (<Empty description='There are no filters defined for the source connector' />) : (
                                        <>
                                            {
                                                [data.transformers.elements['com.mirth.connect.plugins.javascriptstep.JavaScriptStep']].map((transformer) => (
                                                    <>
                                                        <div style={{ display: "flex", alignItems: 'center', gap: '1rem' }}>
                                                            <Title style={{ margin: 0 }} level={4}>Tranformer Name</Title>
                                                            <Paragraph style={{ margin: 0 }} >
                                                                <pre>{transformer.name}</pre>
                                                            </Paragraph>
                                                        </div>

                                                        <div style={{ display: "flex", alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                                            <Title style={{ margin: 0 }} level={4}>Enabled</Title>
                                                            {
                                                                transformer.enabled ?
                                                                    (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50', margin: 0 }} />) :
                                                                    (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800', margin: 0 }} />)
                                                            }
                                                        </div>

                                                        <Title style={{ margin: 0 }} level={4}>Tranformer Script</Title>
                                                        <Paragraph style={{ margin: 0 }} >
                                                            <pre>{transformer.script}</pre>
                                                        </Paragraph>
                                                    </>
                                                ))
                                            }
                                        </>
                                    )
                            }
                        </>
                    )
                },
                {
                    key: '3',
                    label: `Responses`,
                    children: (
                        <>
                            {
                                data.responses.elements === null ?
                                    (<Empty description='There are no filters defined for the source connector' />) : (
                                        <>
                                            {
                                                <>
                                                    {
                                                        Array.isArray(data.responses.elements['com.mirth.connect.plugins.mapper.MapperStep']) ?
                                                            (
                                                                <>
                                                                    {
                                                                        data.responses.elements['com.mirth.connect.plugins.mapper.MapperStep'].map((response) => (
                                                                            <Descriptions title={response.name} column={3}>
                                                                                <Descriptions.Item label='Variabe'>{response.variable}</Descriptions.Item>
                                                                                <Descriptions.Item label='Mapping'>{response.mapping}</Descriptions.Item>
                                                                                <Descriptions.Item label='Default Value'>{response.defaultValue}</Descriptions.Item>
                                                                                <Descriptions.Item label='Scope'>{response.scope}</Descriptions.Item>
                                                                                <Descriptions.Item label='Enabled'>
                                                                                    <div style={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
                                                                                        {
                                                                                            response.enabled ?
                                                                                                (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50', margin: 0 }} />) :
                                                                                                (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800', margin: 0 }} />)
                                                                                        }
                                                                                    </div>
                                                                                </Descriptions.Item>
                                                                            </Descriptions>
                                                                        ))
                                                                    }
                                                                </>
                                                            ) :
                                                            (<>
                                                                {
                                                                    [data.responses.elements['com.mirth.connect.plugins.mapper.MapperStep']].map((response) => (
                                                                        <Descriptions title={response.name} column={3}>
                                                                            <Descriptions.Item label='Variabe'>{response.variable}</Descriptions.Item>
                                                                            <Descriptions.Item label='Mapping'>{response.mapping}</Descriptions.Item>
                                                                            <Descriptions.Item label='Default Value'>{response.defaultValue}</Descriptions.Item>
                                                                            <Descriptions.Item label='Scope'>{response.scope}</Descriptions.Item>
                                                                            <Descriptions.Item label='Enabled'>
                                                                                <div style={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
                                                                                    {
                                                                                        response.enabled ?
                                                                                            (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50', margin: 0 }} />) :
                                                                                            (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800', margin: 0 }} />)
                                                                                    }
                                                                                </div>
                                                                            </Descriptions.Item>
                                                                        </Descriptions>
                                                                    ))
                                                                }
                                                            </>)
                                                    }
                                                    {
                                                       data.responses.elements['com.mirth.connect.plugins.javascriptstep.JavaScriptStep'] && [data.responses.elements['com.mirth.connect.plugins.javascriptstep.JavaScriptStep']].map((response) => (
                                                            <>
                                                                <div style={{ display: "flex", alignItems: 'center', gap: '1rem' }}>
                                                                    <Title style={{ margin: 0 }} level={4}>Response Name</Title>
                                                                    <Paragraph style={{ margin: 0 }} >
                                                                        <pre>{response.name}</pre>
                                                                    </Paragraph>
                                                                </div>

                                                                <div style={{ display: "flex", alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                                                    <Title style={{ margin: 0 }} level={4}>Enabled</Title>
                                                                    {
                                                                        response.enabled ?
                                                                            (<CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#4CAF50', margin: 0 }} />) :
                                                                            (<CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#FF9800', margin: 0 }} />)
                                                                    }
                                                                </div>

                                                                <Title style={{ margin: 0 }} level={4}>Response Script</Title>
                                                                <Paragraph style={{ margin: 0 }} >
                                                                    <pre>{response.script}</pre>
                                                                </Paragraph>
                                                            </>
                                                        ))
                                                    }
                                                </>
                                            }
                                        </>
                                    )
                            }
                        </>
                    )
                },
            ]} />
        </>
    )
}

export default ChannelTasks
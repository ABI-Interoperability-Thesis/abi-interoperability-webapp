import React from 'react'
import { Typography } from 'antd'
import { AreaChartOutlined, PieChartOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

const AttributeDetails = (props) => {
    const data = props.data
    return (
        <Paragraph>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', margin: 0 }}>
                <Title style={{ margin: 0 }} level={5}>Attribute Description -</Title>
                <pre>
                    {data.description}
                </pre>
            </div>
            {
                data.type === 'continuous' ?
                    (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <AreaChartOutlined style={{ fontSize: '2rem' }} />
                            <div style={{ alignSelf: 'center' }}>Continuous Variable</div>
                        </div>
                    ) :
                    (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <PieChartOutlined style={{ fontSize: '2rem' }} />
                            <div style={{ alignSelf: 'center' }}>Categorical Variable</div>
                        </div>
                    )
            }
        </Paragraph>
    )
}

export default AttributeDetails
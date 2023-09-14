import React from 'react'
import { Card, Descriptions, Divider, Tabs } from 'antd'
import AttributeMapping from './AttributeMapping'
import AttributeValidation from './AttributeValidation'

const AttributeCard2 = (props) => {
    const attribute = props.attribute
    return (
        <Card title={attribute.name}>
            <Descriptions column={1} bordered>
                <Descriptions.Item label='Attribute Description'>{attribute.description}</Descriptions.Item>
                <Descriptions.Item label='Attribute Type'>{attribute.type}</Descriptions.Item>
            </Descriptions>
            <Tabs items={[
                {
                    key: '1',
                    label: 'Attribute Mapping',
                    children: <AttributeMapping attribute_mapping={attribute.attribute_mapping} />
                },
                {
                    key: '2',
                    label: 'Attribute Validation',
                    children: <AttributeValidation attribute_validator={attribute.attribute_validator} />
                }
            ]} />
        </Card>
    )
}

export default AttributeCard2
import React from 'react'
import { Descriptions } from 'antd'

const AttributeValidationDetails = (props) => {
  const data = props.data
  return (
    <Descriptions bordered column={1}>
      <Descriptions.Item label='Validation Description'>{data['doc_description']}</Descriptions.Item>
      <Descriptions.Item label='Validation Pattern'>{data['validation_expression']}</Descriptions.Item>
    </Descriptions>
  )
}

export default AttributeValidationDetails
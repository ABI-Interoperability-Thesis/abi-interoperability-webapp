import React from 'react'
import { Typography } from 'antd'
const { Title, Paragraph } = Typography

const AttributeValidator = (props) => {
    const data = props.data
  return (
    <Paragraph>
        <pre>{data.doc_description}</pre>
    </Paragraph>
  )
}

export default AttributeValidator
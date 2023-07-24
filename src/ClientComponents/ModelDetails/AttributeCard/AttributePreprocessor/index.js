import React from 'react'
import { Typography, Button } from 'antd'
import { Link } from 'react-router-dom'
const { Title, Paragraph } = Typography

const AttributePreprocessor = (props) => {
    const data = props.data
    return (
        <Paragraph>
            <pre>{data.doc_description}</pre>

            {
                data.preprocessor_name === 'db-lookup' &&
                <Link to={`/attribute-mappings/${data.model_name}/${data.field}`}>
                    <Button type='primary'>Check Mappings</Button>
                </Link>
            }
        </Paragraph>
    )
}

export default AttributePreprocessor
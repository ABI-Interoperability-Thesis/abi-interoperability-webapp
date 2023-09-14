import React from 'react'
import { Tabs } from 'antd'
import AttributeValidationDetails from './AttributeValidationDetails'
const AttributeValidation = (props) => {
    const attribute_validator = props.attribute_validator

    const GenerateTabs = () => {
        let tabs = []
        if (attribute_validator['hl7_mapping'] !== null) {
            tabs.push({
                key: 1,
                label: 'HL7',
                children: <AttributeValidationDetails data={attribute_validator['hl7_mapping']} />
            })
        }

        if (attribute_validator['fhir_mapping'] !== null) {
            tabs.push({
                key: 2,
                label: 'FHIR',
                children: <AttributeValidationDetails data={attribute_validator['fhir_mapping']} />
            })
        }

        return tabs
    }

    return (
        <div>
            <Tabs items={GenerateTabs()} />
        </div>
    )
}

export default AttributeValidation
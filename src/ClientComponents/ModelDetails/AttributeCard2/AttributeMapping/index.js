import React from 'react'
import { Tabs } from 'antd'
import AttributeMappingDetails from './AttributeMappingDetails'
const AttributeMapping = (props) => {
    const attribute_mapping = props.attribute_mapping

    const GenerateTabs = () => {
        let tabs = []
        if (attribute_mapping['hl7_mapping'] !== null) {
            tabs.push({
                key: 1,
                label: 'HL7',
                children: <AttributeMappingDetails data={attribute_mapping['hl7_mapping']} source_type='hl7'/>
            })
        }

        if (attribute_mapping['fhir_mapping'] !== null) {
            tabs.push({
                key: 2,
                label: 'FHIR',
                children: <AttributeMappingDetails data={attribute_mapping['fhir_mapping']} source_type='fhir'/>
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

export default AttributeMapping
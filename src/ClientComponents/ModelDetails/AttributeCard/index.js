import React, {useState} from 'react'
import { Card, Typography } from 'antd'
import AttributeDetails from './AttributeDetails'
import AttributeMappings from './AttributeMappings'
import AttributeValidator from './AttributeValidator'
import AttributePreprocessor from './AttributePreprocessor'

const AttributeCard = (props) => {
  const data = props.data
  const mysql_endpoint = props.mysql_endpoint
  
  const [activeTabKey1, setActiveTabKey1] = useState('Details');

  const tabList = [
    {
      key: 'Details',
      tab: 'Details',
    },
    {
      key: 'Attribute Mapping',
      tab: 'Attribute Mapping',
    },
    {
      key: 'Validator',
      tab: 'Validator',
    },
    {
      key: 'Preprocessor',
      tab: 'Preprocessor',
    },
  ];

  const contentList = {
    Details: <AttributeDetails data={data} />,
    "Attribute Mapping": <AttributeMappings mysql_endpoint={mysql_endpoint} data={data.attribute_mapping} />,
    Preprocessor: <AttributePreprocessor data={data.attribute_preprocessor} />,
    Validator: <AttributeValidator data={data.attribute_validator} />
  };

  const onTab1Change = (key) => {
    setActiveTabKey1(key);
};

  return (
    <Card
      style={{ width: '100%' }}
      title={data.name}
      tabList={tabList}
      activeTabKey={activeTabKey1}
      onTabChange={onTab1Change}
    >{contentList[activeTabKey1]}</Card>
  )
}

export default AttributeCard
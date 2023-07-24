import React, { useState, useEffect } from 'react'
import { Card, Typography, Input, Form, Select, Button, notification } from 'antd'
import AttributeDetails from './AttributeDetails'
import AttributeMappings from './AttributeMappings'
import AttributePreprocessor from './AttributePreprocessor'
import AttributeValidator from './AttributeValidator'
import axios from 'axios'

const AttributeCard = (props) => {
    const data = props.data
    const endpoint = props.endpoint
    const model_id = props.model_id
    const model = props.model
    const deployed = props.deployed
    const GetModelConfigs = props.GetModelConfigs

    const [api, contextHolder] = notification.useNotification();

    const openNotification = (message, description) => {
        api.warning({ message, description });
    };

    const tabList = [
        {
            key: 'Details',
            tab: 'Details',
        },
        {
            key: 'Default Mapping',
            tab: 'Default Mapping',
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
        "Default Mapping": <AttributeMappings GetModelConfigs={GetModelConfigs} openNotification={openNotification} deployed={deployed} model={model} endpoint={endpoint} model_id={model_id} attribute_name={data.name} />,
        Preprocessor: <AttributePreprocessor GetModelConfigs={GetModelConfigs} openNotification={openNotification} deployed={deployed} model={model} endpoint={endpoint} model_id={model_id} attribute_name={data.name} />,
        Validator: <AttributeValidator GetModelConfigs={GetModelConfigs} openNotification={openNotification} deployed={deployed} model={model} endpoint={endpoint} model_id={model_id} attribute_name={data.name} />
    };

    const [activeTabKey1, setActiveTabKey1] = useState('Details');
    const onTab1Change = (key) => {
        setActiveTabKey1(key);
    };

    return (
        <>
            {contextHolder}
            <Card
                style={{ width: '100%' }}
                title={data.name}
                tabList={tabList}
                activeTabKey={activeTabKey1}
                onTabChange={onTab1Change}
            >{contentList[activeTabKey1]}</Card>
        </>
    )
}

export default AttributeCard
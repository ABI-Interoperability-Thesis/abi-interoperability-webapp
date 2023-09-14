import React, { useState, useEffect } from 'react'
import { Typography } from 'antd'
import endpoints from '../../config/endpoints.json'
import AttributeCard from './AttributeCard'
import axios from 'axios'

const { Title } = Typography
const app_env = process.env.REACT_APP_ENV
const mysql_endpoint = process.env.REACT_APP_MYSQL_SERVICE_ENDPOINT

const ModelFeatures = (props) => {
    const model_id = props.model_id
    const model = props.model
    const deployed = props.deployed
    const GetModelConfigs = props.GetModelConfigs

    const [modelAttributes, setModelAttributes] = useState([]);

    const GetModelAttributes = async () => {
        const url = `${mysql_endpoint}/api/model-attributes/${model_id}`
        const response = await axios.get(url)
        setModelAttributes(response.data)
    }

    useEffect(() => {
        GetModelAttributes()
    }, [])

    return (
        <>
            <Title level={3}>Model Attributes</Title>
            <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
                {
                    modelAttributes.map((item) => (
                        <AttributeCard GetModelConfigs={GetModelConfigs} deployed={deployed} model={model} model_id={model_id} endpoint={mysql_endpoint} data={item} />
                    ))
                }
            </div>
        </>
    )
}

export default ModelFeatures
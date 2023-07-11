import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Select, Card, Button, Empty } from 'antd'
import CustomMappingCard from './CustomMappingCard'

const ClientCustomMappings = (props) => {
    const mysql_endpoint = props.endpoint
    const client_id = props.client_id

    const [models, setModels] = useState([])
    const [modelAttributes, setModelAttributes] = useState()
    const [selectedModelName, setSelectedModelName] = useState()

    const GetModelAttributes = async (value) => {
        const url = `${mysql_endpoint}/api/model-attributes/${value.value}`
        const method = 'get'

        const config = { method, url }

        const axios_response = await axios(config)

        const res_data = axios_response.data

        console.log(res_data)
        setSelectedModelName()
        setSelectedModelName(value.label)
        setModelAttributes(res_data)
    }

    const GetAllModels = async () => {
        const url = `${mysql_endpoint}/api/models`
        const response = await axios.get(url)

        const processedData = response.data.map((model) => {
            return {
                label: model.model_name,
                value: model.model_id,
            }
        })
        setModels(processedData)
    }

    useEffect(() => {
        GetAllModels()
    }, [])


    return (
        <>
            <Select placeholder='model' options={models} style={{ width: '100%' }} labelInValue onChange={(value) => GetModelAttributes(value)} />
            {
                modelAttributes &&
                modelAttributes.map((model_attribute) => (
                    <CustomMappingCard model_attribute={model_attribute} client_id={client_id} mysql_endpoint={mysql_endpoint} model_name={selectedModelName}/>
                ))
            }
        </>
    )
}

export default ClientCustomMappings
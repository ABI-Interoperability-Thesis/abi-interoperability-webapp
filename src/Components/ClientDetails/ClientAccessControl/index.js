import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {Card, Typography, Button} from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'

const {Title} = Typography

const ClientAccessControl = (props) => {
    const mysql_endpoint = props.endpoint
    const client_id = props.client_id
    const clientData = props.clientData
    const [clientPermData, setClientPermData] = useState([])

    const CreateClientPermission = async (model_id, model_name) => {
        const url = `${mysql_endpoint}/api/client-models`
        const method = 'post'
        const data = {
            client_id,
            client_name: clientData.name,
            model_id,
            model_name
        }
        const config = { method, url, data }
        await axios(config)
        GetClientModelPermissions()
    }

    const DeleteClientModelPermission = async (rel_id) => {
        const url = `${mysql_endpoint}/api/client-models/${rel_id}`
        const method = 'delete'
        const config = { method, url }

        await axios(config)
        GetClientModelPermissions()
    }

    const GetClientModelPermissions = async () => {
        const url = `${mysql_endpoint}/api/client-models/${client_id}`
        const method = 'get'
        const config = { method, url }

        const axios_response = await axios(config)
        console.log(axios_response.data)
        setClientPermData(axios_response.data)
    }

    useEffect(() => {
        GetClientModelPermissions()
    }, [])


    return (
        <>
            {
                clientPermData.map((modelPermission) => (
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <Card style={{ width: '20rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Title style={{ margin: 0 }} level={5}>{modelPermission.model_name}</Title>
                                {modelPermission.access === 'ok' ?
                                    <CheckCircleOutlined style={{ alignSelf: 'center', fontSize: '1.5rem' }} />
                                    :
                                    <CloseCircleOutlined style={{ alignSelf: 'center', fontSize: '1.5rem' }} />
                                }
                            </div>
                        </Card>
                        {
                            modelPermission.access !== 'ok' ?
                                <Button type='primary' onClick={() => CreateClientPermission(modelPermission.model_id, modelPermission.model_name)}>Grant Permission</Button>
                                :
                                <Button type='primary' onClick={() => DeleteClientModelPermission(modelPermission.rel_id)}>Revoke Permission</Button>
                        }
                    </div>
                ))
            }
        </>
    )
}

export default ClientAccessControl
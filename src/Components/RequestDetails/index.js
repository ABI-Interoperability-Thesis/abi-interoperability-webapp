import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom';
import endpoints from '../config/endpoints.json'
import { Button, Typography, Descriptions } from 'antd'

const { Title, Paragraph } = Typography

const app_env = process.env.REACT_APP_ENV
const mysql_endpoint = endpoints['mysql-ws'][app_env]


const RequestDetails = () => {
  const [requestInfo, setRequestInfo] = useState({})
  const [requestLiteralInfo, setRequestLiteralInfo] = useState({})
  const [requestProcessedInfo, setRequestProcessedInfo] = useState({})

  const GetRequestDetails = async () => {
    const url = `${mysql_endpoint}/api/requests/${req_id}`
    const method = 'get'
    const config = { method, url }
    const axios_response = await axios(config)
    const data = axios_response.data
    console.log(data)
    setRequestInfo(data.client_request)
    setRequestLiteralInfo(data.find_request_literal)
    setRequestProcessedInfo(data.find_request_pre_proc)
  }

  useEffect(() => {
    GetRequestDetails()
  }, [])

  const { req_id } = useParams();
  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Title style={{ margin: 0 }} level={3}>Requested Model</Title>
        <Paragraph style={{ margin: 0 }}>
          <pre>{requestInfo.request_type}</pre>
        </Paragraph>

        <Title style={{ margin: 0 }} level={3}>State</Title>
        <Paragraph style={{ margin: 0 }}>
          <pre style={{ backgroundColor: requestInfo.answered ? '#4CAF50' : '#F44336', color: "#ffffff" }}>{requestInfo.answered ? 'Answered' : 'Not Answered'}</pre>
        </Paragraph>

        <Title style={{ margin: 0 }} level={3}>Answer</Title>
        <Paragraph style={{ margin: 0 }}>
          <pre>{requestInfo.answer}</pre>
        </Paragraph>
      </div>


      <Descriptions title="Literal Request" bordered style={{ marginBottom: '2rem', marginTop: '1rem' }}>
        {
          Object.keys(requestLiteralInfo).map((json_key) => (
            <>
              {
                json_key !== 'req_id' &&
                <Descriptions.Item label={json_key}>{requestLiteralInfo[json_key]}</Descriptions.Item>
              }
            </>
          ))
        }
      </Descriptions>

      <Descriptions title="Preprocessed Request" bordered>
        {
          Object.keys(requestProcessedInfo).map((json_key) => (
            <>
              {
                json_key !== 'req_id' &&
                <Descriptions.Item label={json_key}>{requestProcessedInfo[json_key]}</Descriptions.Item>
              }
            </>
          ))
        }
      </Descriptions>

      <Link to='/requests'>
        <Button type='primary' style={{ backgroundColor: '#F44336', marginTop: '1rem' }}>Back to Requests</Button>
      </Link>
    </div>
  )
}

export default RequestDetails
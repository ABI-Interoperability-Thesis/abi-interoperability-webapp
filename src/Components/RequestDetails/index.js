import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom';
import endpoints from '../config/endpoints.json'
import { Button, Typography, Descriptions, Modal } from 'antd'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

const app_env = process.env.REACT_APP_ENV
const mysql_endpoint = process.env.REACT_APP_MYSQL_SERVICE_ENDPOINT


const RequestDetails = () => {
  const [requestInfo, setRequestInfo] = useState({})
  const [requestLiteralInfo, setRequestLiteralInfo] = useState({})
  const [requestProcessedInfo, setRequestProcessedInfo] = useState({})

  // Modal Data
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  // Type Inference Data
  const stringConstructor = "test".constructor;
  const arrayConstructor = [].constructor;
  const objectConstructor = ({}).constructor;

  return (
    <>
      {
        requestInfo && requestLiteralInfo && requestProcessedInfo &&
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


          <Descriptions column={1} title="Literal Request" bordered style={{ marginBottom: '2rem', marginTop: '1rem' }}>
            {
              Object.keys(requestLiteralInfo).map((json_key) => (
                <>
                  {
                    json_key !== 'req_id' &&
                    <Descriptions.Item label={json_key}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {requestLiteralInfo[json_key]}
                        <ArrowRightOutlined />
                        {requestProcessedInfo[json_key]}
                      </div>
                    </Descriptions.Item>
                  }
                </>
              ))
            }
          </Descriptions>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <Link to='/requests'>
              <Button type='primary' style={{ backgroundColor: '#F44336' }}>Back to Requests</Button>
            </Link>

            <Button style={{ backgroundColor: '#FFA500' }} type='primary' onClick={() => setIsModalOpen(true)}>Show Request Resources</Button>
          </div>

          {/* Request Messages Modal */}
          <Modal title="Generated Example Message" open={isModalOpen} onOk={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)}>
            <>
              {
                requestInfo['request_messages'] &&
                <>
                  {
                    JSON.parse(requestInfo['request_messages']).map((message) => (
                      <Paragraph>
                        {
                          message.constructor === objectConstructor &&
                          <pre>{JSON.stringify(message, null, 2)}</pre>
                        }

                        {
                          message.constructor === stringConstructor &&
                          <pre>{message}</pre>
                        }
                      </Paragraph>
                    ))
                  }
                </>
              }
            </>
          </Modal>
        </div>
      }
    </>
  )
}

export default RequestDetails
import React, { useState } from 'react'
import { Typography, Select, Form, Input, Button, Space, Divider, Descriptions, message, Upload, Tabs } from 'antd'
import { PlusOutlined, ArrowRightOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons'
import MonacoEditor from 'react-monaco-editor';
import axios from 'axios';
import { GenerateRequestCode } from './utils'
const { Dragger } = Upload;

const { Title, Paragraph } = Typography
const { TextArea } = Input

const TestModel = (props) => {
  const editorOptions = {
    minimap: { enabled: false },
    formatOnPaste: true, // Enable automatic formatting on paste
    formatOnType: true,  // Enable automatic formatting while typing
  }

  const model_name = props.model_name
  const endpoint = props.endpoint
  const hl7_support = props.hl7_support
  const fhir_support = props.fhir_support

  const [chosenSource, setChosenSource] = useState()
  const [fileType, setChosenFileType] = useState('json')
  const [generatedCodeLang, setGeneratedCodeLang] = useState('js')
  const [serverResponse, setServerResponse] = useState()
  const [httpRequestData, setHttpRequestData] = useState()
  const [httpGeneratedCode, setHttpGeneratedCode] = useState()

  let source_type_options = []
  if (hl7_support) source_type_options.push({ label: 'HL7', value: 'hl7' })
  if (fhir_support) source_type_options.push({ label: 'FHIR', value: 'fhir' })

  const sendFileUploadRequest = async () => {
    let messages = fileContents
    if (fileType === 'json' && chosenSource === 'fhir') {
      // Initialize an empty array to store the parsed JSON objects
      const parsedJsonArray = [];

      // Loop through the stringified JSON elements and parse them
      for (const jsonString of fileContents) {
        try {
          const parsedJson = JSON.parse(jsonString);
          parsedJsonArray.push(parsedJson);
        } catch (error) {
          console.error(`Error parsing JSON: ${error.message}`);
        }
      }

      messages = parsedJsonArray
    }

    const data = {
      messages,
      source_type: chosenSource,
      model_name: model_name
    }

    console.log(data)

    const url = `${endpoint}/api/run-model-interoperability?test=true`
    const method = 'post'
    const headers = {
      'session-token': localStorage.getItem('session-token'),
      'Content-Type': 'application/json'
    }

    const config = { method, url, data, headers }
    console.log(config)

    setHttpRequestData(data)

    try {
      const axios_reponse = await axios(config)
      console.log(axios_reponse.data)
      setServerResponse({
        message: 'Ready to run',
        ...axios_reponse.data
      })
    } catch (error) {
      console.log(error.response.data)
      setServerResponse(error.response.data)
    }
  }
  const SendRequest = async (values) => {
    const url = `${endpoint}/api/run-model-interoperability?test=true`
    const method = 'post'
    const data = {
      messages: chosenSource === 'hl7' ? values.hl7_mappings.map((mapping) => { return mapping.resource_content }) : values.fhir_mappings.map((mapping) => { return JSON.parse(mapping.resource_content) }),
      source_type: chosenSource,
      model_name: model_name
    }
    console.log(data)

    const headers = {
      'session-token': localStorage.getItem('session-token'),
      'Content-Type': 'application/json'
    }

    const config = { method, url, data, headers }
    console.log(config)
    setHttpRequestData(data)

    try {
      const axios_reponse = await axios(config)
      console.log(axios_reponse.data)
      setServerResponse({
        message: 'Ready to run',
        ...axios_reponse.data
      })
    } catch (error) {
      console.log(error.response.data)
      setServerResponse(error.response.data)
    }
  }

  // Handle the file upload
  const [fileList, setFileList] = useState([]);
  const [fileContents, setFileContents] = useState([]);

  const handleBeforeUpload = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileContent = e.target.result;
      setFileContents((prevContents) => [...prevContents, fileContent]);
    };

    reader.readAsText(file);

    // Add the file to the fileList
    setFileList((prevList) => [...prevList, file]);

    // Return false to prevent the actual upload
    return false;
  };

  const handleRemove = (file) => {
    const index = fileList.indexOf(file);
    if (index !== -1) {
      const newFileList = [...fileList];
      const newFileContents = [...fileContents];
      newFileList.splice(index, 1);
      newFileContents.splice(index, 1);
      setFileList(newFileList);
      setFileContents(newFileContents);
    }
  };

  const uploadButton = (
    <div>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag file to this area to upload</p>
    </div>
  );

  const file_type_options_fhir = [
    {
      label: "JSON",
      value: "json"
    }
  ]

  const generated_code_lang_options = [
    {
      label: "JavaScript",
      value: "js"
    },
    {
      label: "Python",
      value: "python"
    },
    {
      label: "Java",
      value: "java"
    },
    {
      label: "C#",
      value: "csharp"
    },
    {
      label: "C",
      value: "c"
    },
    {
      label: "cURL",
      value: "cURL"
    },
    {
      label: "Go",
      value: "go"
    }, {
      label: "PHP",
      value: "php"
    }
  ]

  const GenerateRequestCodeController = async () => {
    const lang = generatedCodeLang
    console.log(lang)
    console.log(httpRequestData)
    const generated_code = await GenerateRequestCode(lang, httpRequestData)
    setHttpGeneratedCode(generated_code)
  }




  return (
    <div>
      <Title level={3}>Model Testing</Title>
      <Form onFinish={SendRequest}>
        <Form.Item label='Message Source Type'>
          <Select placeholder='Source Type' options={source_type_options} onChange={(value) => setChosenSource(value)} />
        </Form.Item>

        {
          chosenSource &&
          <Tabs items={[
            {
              key: '1',
              label: 'Resource Upload',
              children: (
                <div>
                  {
                    chosenSource === 'fhir' &&
                    <Form.Item label='File Type'>
                      <Select placeholder='File Type' value={fileType} options={file_type_options_fhir} onChange={(value) => setChosenFileType(value)} />
                    </Form.Item>
                  }
                  <Dragger
                    beforeUpload={handleBeforeUpload}
                    fileList={fileList}
                    onRemove={handleRemove}
                    showUploadList={{
                      showRemoveIcon: true,
                    }}
                    multiple
                  >
                    {uploadButton}
                  </Dragger>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
                    {
                      fileType &&
                      <Button onClick={sendFileUploadRequest} type='primary'>Send Request</Button>
                    }
                    {
                      serverResponse &&
                      <Button type='primary' onClick={() => setServerResponse()}>Clear Response</Button>
                    }
                  </div>
                </div>
              )
            },
            {
              key: '2',
              label: 'Resource Input',
              children: (
                <>
                  {
                    chosenSource === 'hl7' &&
                    <>
                      <Title level={4}>Message Resources</Title>
                      <Form.List name="hl7_mappings">
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map(({ key, name, ...restField }) => (
                              <Space
                                key={key}
                                style={{
                                  display: 'block',
                                  marginBottom: 8,
                                }}
                                align="baseline"
                              >
                                <Divider />
                                <Form.Item
                                  {...restField}
                                  name={[name, 'resource_content']}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Do not leave the resource empty!',
                                    },
                                  ]}
                                >
                                  <TextArea style={{ minHeight: '10rem' }} placeholder="HL7 Resource" />
                                </Form.Item>
                                <Button style={{ width: '100%' }} danger onClick={() => remove(name)}>Remove</Button>
                              </Space>
                            ))}
                            <Form.Item>
                              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Add Resource
                              </Button>
                            </Form.Item>
                          </>
                        )}
                      </Form.List>
                    </>
                  }

                  {
                    chosenSource === 'fhir' &&
                    <>
                      <Title level={4}>Message Resources</Title>
                      <Form.List name="fhir_mappings">
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map(({ key, name, ...restField }) => (
                              <Space
                                key={key}
                                style={{
                                  display: 'block',
                                  marginBottom: 8,
                                }}
                                align="baseline"
                              >
                                <Divider />
                                <Form.Item
                                  {...restField}
                                  name={[name, 'resource_content']}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Do not leave the resource empty!',
                                    },
                                  ]}
                                >
                                  <MonacoEditor
                                    language="json" // Specify the language mode (e.g., javascript)
                                    theme='vs' // Specify the editor theme (e.g., vs)
                                    options={editorOptions}
                                    height="10rem"
                                    width="100%"
                                    autoClosingQuotes={true}
                                    lineNumbers={false}
                                  />
                                </Form.Item>
                                <Button style={{ width: '100%' }} danger onClick={() => remove(name)}>Remove</Button>
                              </Space>
                            ))}
                            <Form.Item>
                              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Add Resource
                              </Button>
                            </Form.Item>
                          </>
                        )}
                      </Form.List>
                    </>
                  }
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Button htmlType='submit' type='primary'>Send Message</Button>
                    {
                      serverResponse &&
                      <Button type='primary' onClick={() => setServerResponse()}>Clear Response</Button>
                    }
                  </div>
                </>
              )
            }
          ]} />

        }
      </Form>

      {
        serverResponse &&
        <div>
          <Descriptions bordered column={1} title="Server Response" style={{ marginTop: '1rem' }}>
            <Descriptions.Item label='Response Message'>{serverResponse.message}</Descriptions.Item>
          </Descriptions>

          {
            serverResponse['extracted_fields'] &&
            <Descriptions bordered column={1} title="Extracted Fields" style={{ marginTop: '1rem' }}>
              {
                Object.keys(serverResponse['extracted_fields']).map((field) => (
                  <Descriptions.Item label={field}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      {
                        serverResponse['extracted_fields'][field]['matched'] ?
                          (
                            <div>
                              <div>Matched: {JSON.stringify(serverResponse['extracted_fields'][field]['matched'])}</div>
                              <div>Match: {serverResponse['extracted_fields'][field]['match']}</div>
                            </div>
                          )
                          :
                          (<div>
                            {
                              serverResponse['source_type'] === 'hl7' ?
                                <div>
                                  <div>matched: {JSON.stringify(serverResponse['extracted_fields'][field]['matched'])}</div>
                                  <div>Message Type: {serverResponse['extracted_fields'][field]['msg_type']}</div>
                                  <div>Message Triggers: {serverResponse['extracted_fields'][field]['msg_triggers']}</div>
                                  <div>HL7 Mapping: {serverResponse['extracted_fields'][field]['mapping']}</div>
                                </div>
                                :
                                <div>
                                  <div>matched: {JSON.stringify(serverResponse['extracted_fields'][field]['matched'])}</div>
                                  <div>FHIR Resource Type: {serverResponse['extracted_fields'][field]['resource_type']}</div>
                                  <div>FHIR Mapping: {serverResponse['extracted_fields'][field]['mapping']}</div>
                                </div>
                            }
                          </div>)
                      }

                    </div>
                  </Descriptions.Item>
                ))
              }
            </Descriptions>
          }

          {
            serverResponse['validated_fields'] &&
            <Descriptions title="Validated Fields" column={1} bordered style={{ marginTop: '1rem' }}>
              <Descriptions.Item label="Valid Request">{JSON.stringify(serverResponse['validated_fields']['is_valid'])}</Descriptions.Item>
              {
                Object.keys(serverResponse['validated_fields']['validated_obj']).map((validated_field) => (
                  <Descriptions.Item label={validated_field}>
                    <div>Valid: {JSON.stringify(serverResponse['validated_fields']['validated_obj'][validated_field]['validation_response'])}</div>
                    <div>Description: {serverResponse['validated_fields']['validated_obj'][validated_field]['description']}</div>
                    <div>Pattern: {serverResponse['validated_fields']['validated_obj'][validated_field]['regex']}</div>
                  </Descriptions.Item>
                ))
              }
            </Descriptions>
          }

          {
            serverResponse['preprocessed_fields'] &&
            <Descriptions title="Processed Fields" column={1} bordered style={{ marginTop: '1rem' }}>
              {
                Object.keys(serverResponse['preprocessed_fields']).map((preprocessed_field) => (
                  <Descriptions.Item label={preprocessed_field}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div>{JSON.stringify(serverResponse['literal_fields'][preprocessed_field])}</div>
                      <div><ArrowRightOutlined /></div>
                      <div>{JSON.stringify(serverResponse['preprocessed_fields'][preprocessed_field])}</div>
                    </div>
                  </Descriptions.Item>
                ))
              }
            </Descriptions>
          }
          <Title level={3}>Want to Integrate this Model?</Title>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <Button type='primary' onClick={GenerateRequestCodeController}>Generate {generatedCodeLang} Request Code</Button>
            <Select options={generated_code_lang_options} value={generatedCodeLang} onChange={(value) => setGeneratedCodeLang(value)} />
          </div>
          {
            httpGeneratedCode &&
            <MonacoEditor
              language="javascript" // Specify the language mode (e.g., javascript)
              theme='vs' // Specify the editor theme (e.g., vs)
              options={{
                ...editorOptions,
                readOnly: true, // Set this option to make the editor read-only
              }}
              height="30rem"
              width="100%"
              autoClosingQuotes={true}
              lineNumbers={false}
              value={httpGeneratedCode}
            />
          }
        </div>
      }
    </div>
  )
}

export default TestModel
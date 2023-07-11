import React, { useState } from 'react'
import { Card, Typography, Input, Form, Select, Button } from 'antd'
import { AreaChartOutlined, PieChartOutlined } from '@ant-design/icons'

const { Paragraph, Title } = Typography

const AttributeDetails = (props) => {
    const data = props.data

    const [edit, setEdit] = useState(false)

    const UpdateValues = async (values) => {
        console.log(values)
    }
    return (
        <>
            {edit ?
                (
                    <Form onFinish={UpdateValues} autoComplete="off">
                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input the feature description',
                                },
                            ]}
                            initialValue={data.description}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Type"
                            name="type"
                            initialValue={data.type}
                        >
                            <Select
                                showSearch
                                placeholder="Select a person"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={[
                                    {
                                        value: 'continuous',
                                        label: 'continuous',
                                    },
                                    {
                                        value: 'categorical',
                                        label: 'categorical',
                                    }
                                ]}
                            />
                        </Form.Item>

                        <Button type="primary" htmlType="submit">
                            Update
                        </Button>

                        <Button type='primary' style={{ backgroundColor: '#F44336', marginLeft: '1rem' }} onClick={()=>setEdit(false)}>Cancel</Button>


                    </Form>
                ) :
                (
                    (
                        <Paragraph>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', margin: 0 }}>
                                <Title style={{ margin: 0 }} level={5}>Attribute Description -</Title>
                                <pre>
                                    {data.description}
                                </pre>
                            </div>
                            {
                                data.type === 'continuous' ?
                                    (
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <AreaChartOutlined style={{ fontSize: '2rem' }} />
                                            <div style={{ alignSelf: 'center' }}>Continuous Variable</div>
                                        </div>
                                    ) :
                                    (
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <PieChartOutlined style={{ fontSize: '2rem' }} />
                                            <div style={{ alignSelf: 'center' }}>Categorical Variable</div>
                                        </div>
                                    )
                            }
                            <Button style={{marginTop: '1rem'}} type='primary' onClick={()=>setEdit(true)}>Update</Button>
                        </Paragraph>
                    )
                )
            }
        </>
    )
}

export default AttributeDetails
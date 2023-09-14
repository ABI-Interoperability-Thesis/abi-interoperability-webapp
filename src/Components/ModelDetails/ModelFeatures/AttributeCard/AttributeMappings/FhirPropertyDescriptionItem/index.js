import React, { useState } from 'react'
import { Descriptions, Typography, Tag, Button, Modal, Collapse } from 'antd'

const { Paragraph } = Typography
const { Panel } = Collapse;

const FhirPropertyDescriptionItem = (props) => {
    const field_data = props.field_data

    const [openedReference, setOpenedReference] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [modalProperties, setModalProperties] = useState()

    // Modal Controls
    const handleOk = () => {
        setIsModalVisible(false);
        setModalProperties()
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setModalProperties()
    };

    const showModal = (reference, properties) => {
        setIsModalVisible(true)
        setModalProperties({
            reference,
            properties
        })
    }

    return (
        <div style={{ marginBottom: '1rem' }}>
            <Descriptions title='Property Details' bordered column={1}>
                {
                    Object.keys(field_data).map((field_details) => (
                        <>
                            {
                                field_details !== 'items' && field_details !== 'reference_data' &&
                                <>
                                    {
                                        (field_details === 'name' || field_details === 'description' || field_details === 'type' || field_details === 'reference') &&
                                        <Descriptions.Item label={field_details}>{field_data[field_details]}</Descriptions.Item>
                                    }
                                </>
                            }

                        </>
                    ))
                }
            </Descriptions>

            {
                modalProperties &&
                <Modal
                    title={`${modalProperties.reference} Properties`}
                    visible={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                >
                    <div>
                        <Collapse accordion>
                            {
                                Object.keys(modalProperties.properties).map((property, index) => (
                                    <Panel header={property} key={index}>
                                        {modalProperties.properties[property]['description']}
                                    </Panel>
                                ))
                            }
                        </Collapse>
                    </div>
                </Modal>
            }

            {
                openedReference ?
                    (
                        <div>
                            <Descriptions title='Reference Details' bordered column={1}>
                                <>
                                    <Descriptions.Item label='Property Reference'>{field_data['reference']}</Descriptions.Item>
                                    {
                                        Object.keys(field_data.reference_data).map((field_details) => (
                                            <>
                                                {
                                                    (field_details === 'description' || field_details === 'pattern' || field_details === 'type') &&
                                                    <Descriptions.Item label={field_details}>{field_data.reference_data[field_details]}</Descriptions.Item>
                                                }

                                                {
                                                    field_details === 'additionalProperties' &&
                                                    <Descriptions.Item label={field_details}><Tag color='geekblue'>{JSON.stringify(field_data.reference_data[field_details])}</Tag></Descriptions.Item>
                                                }

                                                {
                                                    field_details === 'properties' &&
                                                    <>
                                                        <Descriptions.Item label={field_details}>
                                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                {Object.keys(field_data.reference_data[field_details]).length}
                                                                <Button type="primary" onClick={() => showModal(field_data.reference, field_data.reference_data[field_details])}>Inspect Properties</Button>
                                                            </div>
                                                        </Descriptions.Item>
                                                    </>
                                                }

                                                {
                                                    field_details === 'enum' &&
                                                    <Descriptions.Item label={field_details}>
                                                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                                            {
                                                                field_data.reference_data[field_details].map((enum_element) => (
                                                                    <Tag color='geekblue'>{enum_element}</Tag>
                                                                ))
                                                            }
                                                        </div>
                                                    </Descriptions.Item>
                                                }
                                            </>
                                        ))
                                    }
                                </>
                            </Descriptions>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button style={{ marginTop: '1rem' }} type='primary' onClick={() => setOpenedReference(false)}>Hide Reference</Button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button style={{ marginTop: '1rem', backgroundColor: '#FFA500' }} type='primary' onClick={() => setOpenedReference(true)}>Reference Details</Button>
                        </div>
                    )
            }
        </div>
    )
}

export default FhirPropertyDescriptionItem
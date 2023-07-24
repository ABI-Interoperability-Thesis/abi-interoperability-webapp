import React from 'react'
import { LoadingOutlined } from '@ant-design/icons'

const Loading = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <LoadingOutlined
                style={{
                    fontSize: 40,
                }}
                spin
            />
        </div>
    )
}

export default Loading
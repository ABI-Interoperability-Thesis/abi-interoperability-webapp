import React from 'react'

const ChannelStatistics = (props) => {
    const channel_stats = props.channel_stats
    return (
        <div>
            <div>ChannelStatistics</div>
            <div>{JSON.stringify(channel_stats)}</div>
        </div>
    )
}

export default ChannelStatistics
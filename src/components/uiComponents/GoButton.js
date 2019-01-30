import React from 'react'

const GoButton = props => {

    const contentStyle = {
        margin: '0 auto',
        textAlign: 'center',
        color: '#154463',
    }
    
        return (
            <div className='go-button' style={props.style}>
                <div style={contentStyle}>{props.children}</div>
            </div>
            
        )
}

export default GoButton
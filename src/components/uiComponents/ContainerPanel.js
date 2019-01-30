import React from 'react'

const ContainerPanel = props => {
    
        return (
            <div className='panel' style={props.style}>
                {props.children}
            </div>
            
        )
}

export default ContainerPanel
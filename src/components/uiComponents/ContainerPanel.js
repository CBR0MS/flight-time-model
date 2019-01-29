import React from 'react'

const ContainerPanel = props => {
        console.log('drawn')
        return (
            <div className='panel' style={props.style}>
                {props.children}
            </div>
            
        )
}

export default ContainerPanel
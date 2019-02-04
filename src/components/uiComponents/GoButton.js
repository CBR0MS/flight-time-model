import React from 'react'

import style from './style/style'

const GoButton = props => {
        
        const joinedStyles = Object.assign({}, style.goButton)
        if (props.centered) {
            joinedStyles.margin = '0 auto'
        }
        return (
            <div style={joinedStyles}>
                <div style={style.goButtonInterior}>{props.children}</div>
            </div>
            
        )
}

export default GoButton
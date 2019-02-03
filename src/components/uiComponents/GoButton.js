import React from 'react'

import style from './style/style'

const GoButton = props => {

        return (
            <div style={style.goButton}>
                <div style={style.goButtonInterior}>{props.children}</div>
            </div>
            
        )
}

export default GoButton
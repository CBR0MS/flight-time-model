import React from 'react'
import styles from './style/style'

const GoButton = props => {
        
        const joinedStyles = Object.assign({}, styles.goButton)
        const joinedStylesInterior = Object.assign({}, styles.goButtonInterior)
        if (props.centered) {
            joinedStyles.marginLeft = 'auto'
            joinedStyles.marginRight = 'auto'
        } else {
            joinedStyles.display = 'inline-block'
            joinedStyles.margin = '10px 20px 10px 10px'
        }

        if (!props.shadow){
            joinedStyles.boxShadow = 'none'
        }

        if (props.outlined) {
            joinedStyles.border = '2px solid ' +  props.interiorColor
        }
        joinedStyles.backgroundColor = props.color
        joinedStylesInterior.color = props.interiorColor

        return (

            <div style={joinedStyles} onClick={props.onClick}>
                <div style={joinedStylesInterior}>{props.children}</div>
            </div>
            
        )
}

export default GoButton
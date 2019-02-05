import React from 'react'
import { Link } from 'react-router-dom'
import styles from './style/style'

const GoButton = props => {
        
        const joinedStyles = Object.assign({}, styles.goButton)
        if (props.centered) {
            joinedStyles.marginLeft = 'auto'
            joinedStyles.marginRight = 'auto'
        }

        return (

            <div style={joinedStyles}>
                <Link to={props.link}>
                    <div style={styles.goButtonInterior}>{props.children}</div>
                </Link>
            </div>
            
        )
}

export default GoButton
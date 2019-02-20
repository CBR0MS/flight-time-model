import React from 'react'
import styles from './style/style'

const AirlinePicker = props => {
    return (
        <div style={styles.allAirlineContentWrapper}>
            {props.children}
        </div>
    )
}

export default AirlinePicker
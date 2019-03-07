
import React from 'react'

import styles from './style/style'

const ContentWrapper = props => {
    return (
        
        <div style={styles.navDummyStyle}>
            <div style={styles.interiorGradient}>
                {props.children}
            </div>

        </div>

    )
}

export default ContentWrapper
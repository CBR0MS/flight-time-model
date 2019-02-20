import React from 'react'
import styles from './style/style'

const LoadingScreen= props => {
    return (
        <div style={styles.loading}>
            <div className='lds-ellipsis'>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}

export default LoadingScreen
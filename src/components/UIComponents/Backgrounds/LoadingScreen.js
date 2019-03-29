import React from 'react'
import styles from '../../Style/style'

const LoadingScreen= props => {
    
    let text = (<h4 style={styles.loadingText}>{props.text}</h4>)

    if (props.children !== undefined) {
        text = props.children
    }
    return (
        <div style={styles.loading}>
            {text}
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
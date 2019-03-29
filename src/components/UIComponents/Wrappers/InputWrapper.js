import React from 'react'
import styles from '../../Style/style'

const InputWrapper = props => {
    return (
        <div style={styles.inputWrapper}>
            <h5 style={styles.inputWrapperTitle}>{props.title}</h5>
            {props.children}
        </div>
    )
}

export default InputWrapper
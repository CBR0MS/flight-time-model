import React from 'react'
import styles from './style/style'
import { Link } from 'react-router-dom'

const Footer = props => {
    return (
        <div style={styles.footer}>
            <a href="https://github.com/CBR0MS">&copy; 2019 Christian Broms &nbsp;</a>
            <Link to={'/about'}>
                About &nbsp;
            </Link>
            <Link to={'/about'}>
                Support
            </Link>
        </div>
    )
}

export default Footer
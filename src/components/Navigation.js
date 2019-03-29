import React from 'react'
import { Link } from 'react-router-dom';

import Menu from './UIComponents/Backgrounds/Menu'
import style from './Style/style'

class Navigation extends React.Component {

    render() {
        
        return (

            <nav style={style.navWrapperStyle} >
                <ul>
                  <li style={style.logoStyle}>
                    <Link to="/">
                        <div >FlyGenius</div>
                    </Link>
                  </li>

                  <li className='nav-item'>

                    <Menu>
                        <Link to="/">
                            <div style={style.menuText}>Home</div>
                        </Link>
                        <Link to="/check">
                            <div style={style.menuText}>Check a Flight</div>
                        </Link>
                        <Link to="/about">
                            <div style={style.menuText}>How it Works</div>
                        </Link>
                        <a href="https://api.flygeni.us/docs">
                            <div style={style.menuText}>FlyGenius API</div>
                        </a>

                    </Menu>
                  </li>
                  
                </ul>
            </nav>
            
        )
    }
}

export default Navigation
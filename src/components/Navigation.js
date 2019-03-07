import React from 'react'
import { Link } from 'react-router-dom';
import { withBreakpoints } from 'react-breakpoints'

import Menu from './uiComponents/Menu'
import style from './uiComponents/style/style'

class Navigation extends React.Component {

    render() {

        const { breakpoints, currentBreakpoint } = this.props

        let newLogoStyle = Object.assign({}, style.logoStyle)

        if (breakpoints[currentBreakpoint] > breakpoints.tablet){
                newLogoStyle.fontSize= '50px'
                newLogoStyle.left = '40px'
                newLogoStyle.top = 0
        }
        
        return (
            <div>
                <div style={style.navWrapperStyle} >
                    <nav>
                        <ul>
                          <li style={newLogoStyle}>
                            <Link to="/">
                                <div >FlyGenius</div>
                            </Link>
                          </li>
                          <li className='nav-item'>
        
                            <Menu >
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
                </div>
                
               
            </div>
            
        )
    }
}

export default withBreakpoints(Navigation)
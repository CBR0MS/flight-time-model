import React from 'react'
import { Link } from 'react-router-dom';
import { withBreakpoints } from 'react-breakpoints'

import Menu from './uiComponents/Menu'
import style from './uiComponents/style/style'

class Navigation extends React.Component {

    render() {

        let logoStyle = {
            fontSize: '40px',
            left: '20px',
            top: '10px',
            fontFamily: 'PanAm',
            position: 'absolute',
            zIndex: 100
        }
        const { breakpoints, currentBreakpoint } = this.props

        if (breakpoints[currentBreakpoint] > breakpoints.tablet){
            logoStyle = {
                fontSize: '50px',
                left: '40px',
                top: '20px',
                fontFamily: 'PanAm',
                position: 'absolute',
                zIndex: 100
            }
        }
        
        return (
            <div>
                <nav>
                    <ul>
                      <li style={logoStyle}>
                        <Link to="/">
                            <div >FlyGenius</div>
                        </Link>
                      </li>
                      <li className='nav-item'>
    
                        <Menu >
                            <Link to="/">
                                <div style={style.menuText}>Home</div>
                            </Link>
                            <Link to="/predict">
                                <div style={style.menuText}>Check a Flight</div>
                            </Link>
                            <Link to="/about">
                                <div style={style.menuText}>How it Works</div>
                            </Link>

                        </Menu>

                      </li>
                    </ul>
                    
                </nav>
            </div>
            
        )
    }
}

export default withBreakpoints(Navigation)
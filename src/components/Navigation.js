import React from 'react'
import { Link } from 'react-router-dom';
import { withBreakpoints } from 'react-breakpoints'

import Menu from './uiComponents/Menu'

class Navigation extends React.Component {

    render() {

        let logoStyle = {
            fontSize: '40px',
            left: '20px',
            top: '10px'
        }
        const { breakpoints, currentBreakpoint } = this.props

        if (breakpoints[currentBreakpoint] > breakpoints.tablet){
            logoStyle = {
              fontSize: '50px',
              left: '40px',
              top: '20px'
            }
        }
        
        return (
            <div>
                <nav>
                    <ul>
                      <li className='nav-logo' style={logoStyle}>
                        <Link to="/">
                            <div >FlyGenius</div>
                        </Link>
                      </li>
                      <li className='nav-item'>
    
                        <Menu >
                            <Link to="/">
                                <div className='menu-text'>Home</div>
                            </Link>
                            <Link to="/predict">
                                <div className='menu-text'>Check a Flight</div>
                            </Link>
                            <Link to="/about">
                                <div className='menu-text'>How it Works</div>
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
import React from 'react'
import { Link } from 'react-router-dom';

class Navigation extends React.Component {

    render() {

        return (
            <div>
                <nav>
                    <ul>
                      <li className='nav-logo'>
                        <Link to="/">
                            <div >FlyGenius</div>
                        </Link>
                      </li>
                      <li className='nav-item'>
                        <Link to="/">
                            <div >Check a Flight</div>
                        </Link>
                      </li>
                      <li className='nav-item'>
                        <Link to="/about">
                            <div>How it Works</div>
                        </Link>
                      </li>
                    </ul>
                </nav>
            </div>
            
        )
    }
}

export default Navigation
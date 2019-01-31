import React from 'react'
import { Spring, Transition } from 'react-spring'

class Menu extends React.Component {

     constructor(props) {
        super(props);
        this.state = {
            open: false
        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {

        const curState = this.state.open

        this.setState({
            open: !curState
        });
    }

    render() {

            return (
                <div>
                    <div onClick={this.handleChange}>
                        <HamburgerIcon open={!this.state.open}/>
                    </div>
                    <div className='menu-items'>
                        <Transition
                            items={this.state.open}
                            from={{ opacity: 0 }}
                            enter={{ opacity: 1 }}
                            leave={{ opacity: 0 }}>
                            {show =>
                              show && (props =>
                                <div className='menu-full' style={props} onClick={this.handleChange}>
                                    <div className='menu-contents'>
                                        {this.props.children}
                                    </div>
                                </div>
                            )
                          }
                        </Transition>

                    </div>
                </div>
            )
    }
}

export default Menu



// the menus icon 
const HamburgerIcon = props => {

    const iconStyle = {
        width: '50px',
        height: '50px',
        position: 'absolute',
        right: '20px',
        zIndex: '1000',
        cursor: 'pointer',
        top: '40px'
    }
    
    if (props.open) {
        return (
            <div style={iconStyle}>
                <Spring from={{ width: '30px' }} to={{ width: '40px'}}>
                    {props => <div className='icon-bar' style={props}></div>}
                </Spring>
                <Spring from={{ width: '40px' }} to={{ width: '30px'}}>
                    {props => <div className='icon-bar' style={props}></div>}
                </Spring>
                <Spring from={{ width: '40px' }} to={{ width: '30px'}}>
                    {props => <div className='icon-bar' style={props}></div>}
                </Spring>
            </div>
        )
    } else {
        return (
        <div style={iconStyle}>
                <Spring from={{ width: '40px' }} to={{ width: '30px'}}>
                    {props => <div className='icon-bar' style={props}></div>}
                </Spring>
                <Spring from={{ width: '30px' }} to={{ width: '40px'}}>
                    {props => <div className='icon-bar' style={props}></div>}
                </Spring>
                <Spring from={{ width: '30px' }} to={{ width: '40px'}}>
                    {props => <div className='icon-bar' style={props}></div>}
                </Spring>
            </div>
        )

    }
}








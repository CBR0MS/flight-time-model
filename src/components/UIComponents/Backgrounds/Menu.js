import React from 'react'
import { Spring, Transition } from 'react-spring/renderprops'
import { config } from 'react-spring'

import styles from '../../Style/style'

class Menu extends React.Component {

     constructor(props) {
        super(props);
        this.state = {
            open: false
        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {

        function preventDefault(e) {
            e = e || window.event;
            if (e.preventDefault)
            e.preventDefault();
            e.returnValue = false;  
        }

        const curState = this.state.open
        if (curState) {
            window.ontouchmove = preventDefault;
        } else {
            window.ontouchmove = null;
        }
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
                <Transition
                    items={this.state.open}
                    from={{ opacity: 0 }}
                    enter={{ opacity: 1 }}
                    leave={{ opacity: 0 }}
                    config={config.default}>
                    {show =>
                      show && (props => {
                        let styleNew = Object.assign({}, styles.menuBackground)
                        styleNew.opacity = props.opacity
                        return (
                        <div style={ styleNew } onClick={this.handleChange}>
                            <div style={styles.menuContents}>
                                {this.props.children}
                            </div>
                        </div>
                        )
                    }
                    )
                  }
                </Transition>
            </div>
        )
    }
}

export default Menu

// the menus icon 
const HamburgerIcon = props => {

    if (props.open) {
        return (
            <div style={styles.hamburgerStyle}>
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
        <div style={styles.hamburgerStyle}>
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








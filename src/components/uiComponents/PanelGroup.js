import React from 'react'
import { Transition, animated, Spring } from 'react-spring/renderprops'


import styles from './style/style'

const uuidv1 = require('uuid/v1');

class PanelGroup extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            messages: [],
            badgeDuration: 7000,
        }
        this.removeAlert = this.removeAlert.bind(this)
        this.updateMessages = this.updateMessages.bind(this)
    }

    updateMessages() {
         const content = this.props.values.filter((value) => {
            return !this.state.messages.some(e => e.content === value)
         })

        if (content.length > 0){

            const newContent = content.map((value, index)=>{

                if (this.props.fadeOut){
                    // set a timeout to remove the content
                    const timeoutName = 'timeout_' + index.toString()
                    this[timeoutName] = setTimeout(()=>{
                        const newContent = this.state.messages.filter((value1) => value.content === value1.content)
                        this.props.removeValue(value)
                        this.setState({messages: newContent})
                    }, this.state.badgeDuration)
                }
                
                return {content: value, key: uuidv1()}
            })
            this.setState({
                messages: this.state.messages.concat(newContent)
            })
        }   
    }

    removeAlert(object){

        const newContent = this.state.messages.filter((value, index, arr) => {
            return value.key !== object.item.key
        })

        this.props.removeValue(object.item.content)
        this.setState({
            messages: newContent
        })

    }

    render() {

        if (this.props.values.length > this.state.messages.length){
            this.updateMessages()
        }

        let revisedContainerStyle = Object.assign({}, this.props.containerStyle)

        if (this.state.messages.length <= 0){
            revisedContainerStyle.zIndex = 150
        }
        revisedContainerStyle.paddingTop = 15

        let loading = (<div></div>)
    
        if (this.props.fadeOut) {
            loading = (
                <Spring
                  from={{ width: 25 }}
                   to={{ width: parseInt(this.props.badgeStyle.width) }}
                   config={{duration: this.state.badgeDuration}}
                  >
                  {props => 
                    <div style={Object.assign(props, styles.loadingBar)}></div>}
                </Spring>
            )
        }

        let badgeStyle = Object.assign({}, this.props.badgeStyle)

        badgeStyle.position = 'relative'

        return (  
            <div style={revisedContainerStyle}>

                <Transition
                  items={this.state.messages}
                  keys={item => item.key}
                  from={{ marginTop: -1 * (this.props.badgeStyle.height + 40), opacity: 0 }}
                  leave={{ marginTop: -1 * (this.props.badgeStyle.height + 40), opacity: 0 }}
                  enter={{ marginTop: 0, opacity: 1 }}
                  trail={300}>
                  {item => props => 
                        <animated.div style={Object.assign(props, badgeStyle)}>

                            {this.props.showValue(item.content)}
                            <span 
                                style={styles.airlineDeleteButton}
                                onClick={() => this.removeAlert({item})}>
                                &times;
                            </span>

                            {loading}
                            
                        </animated.div>}
                    </Transition>
            </div>
        )
        
    }
}

export default PanelGroup


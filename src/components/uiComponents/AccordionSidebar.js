import React from 'react'
import { Transition } from 'react-spring/renderprops'
import { useSpring, animated } from 'react-spring'

import styles from './style/style'

const AccordionPanel = props => {

  const { x } = useSpring({ from: { x: 85 }, x: props.show ? 400 : 85, config: { duration: 300 } })
  const interiorOpacity = useSpring({ from: {height: 'none', opacity: 0, overflow: 'hidden'}, 
                                    opacity: props.show ? 1 : 0,
                                    height: props.show ? 300 : 0,
                                     config: {duration: 300 } })
  const topOpacity = useSpring({ from: {opacity: 1}, 
                                opacity: props.show ? 0 : 1, 
                                height: props.show ? 0 : 30,
                                config: {duration: 300 } })

  const top = (
    <animated.div style={topOpacity}>
            {props.content.prompt}
        </animated.div>
        )

  const interior = (
      <animated.div style={interiorOpacity}>
         {props.content.content}
      </animated.div>
  )

  let accordionStyles = Object.assign({}, styles.accordionPanel)

  if (props.color !== undefined) {
    accordionStyles.backgroundColor = props.color
  }

  return (
    <div onClick={props.toggle} style={accordionStyles}>
      <animated.div
        style={{ height: x }}>
        {props.content.title}
        {top}
        {interior}
      </animated.div>
    </div>
  )
}


class AccordionSidebar extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            modules: [],
        }
        this.handleToggle = this.handleToggle.bind(this)
    }

    componentDidMount() {
        this.setState({
            modules: this.props.content
        })
    }

    handleToggle(content) {
        const updatedValues = this.state.modules.map((value) => {
            let newValue = value
            if (value.key === content.item.key){
                newValue.open = !newValue.open
                return newValue
            } else {
                newValue.open = false
                return newValue
            }
        })
        this.setState({
            modules: updatedValues
        })
    }

    render(){
        if (this.state.modules.length > 0){
            return (
                <div>
                    <Transition
                      items={this.state.modules}
                      keys={item => item.key}
                      from={{ marginTop: -1 * (100 + 40), opacity: 0 }}
                      leave={{ marginTop: -1 * (100 + 40), opacity: 0 }}
                      enter={{ marginTop: 15, opacity: 1 }}
                      trail={300}>
                      {item => props => 
                            <animated.div style={props}>
                                <AccordionPanel
                                    color={item.color}
                                    show={item.open}
                                    toggle={() => this.handleToggle({item})}
                                    content={item.content}
                                    />
                            </animated.div>}
                        </Transition>


                </div>
            )
        }
        return (<div></div>)
    }

}


export default AccordionSidebar
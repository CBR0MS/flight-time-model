import React from "react";
import { Transition } from "react-spring/renderprops";
import { useSpring, animated, config } from "react-spring";

import styles from "../../Style/style";

const AccordionPanel = props => {
  const { x } = useSpring({
    from: { x: 85 },
    x: props.show ? props.height : 85,
    config: config.default
  });
  const interiorOpacity = useSpring({
    from: { height: "none", opacity: 0, overflow: "hidden" },
    opacity: props.show ? 1 : 0,
    height: props.show ? props.height : 0,
    config: config.default
  });
  const topOpacity = useSpring({
    from: { opacity: 1 },
    opacity: props.show ? 0 : 1,
    height: props.show ? 0 : 30,
    config: config.default
  });

  const top = (
    <animated.div style={topOpacity}>{props.content.prompt}</animated.div>
  );

  const interior = (
    <animated.div style={interiorOpacity}>{props.content.content}</animated.div>
  );

  let accordionStyles = Object.assign({}, styles.accordionPanel);

  if (props.color !== undefined) {
    accordionStyles.backgroundColor = props.color;
    if (props.color === styles.orange) {
      accordionStyles.color = styles.darkBlue;
    }
  }

  return (
    <div
      onClick={props.toggle}
      className={`accordionPanel ${props.class}`}
      style={accordionStyles}
    >
      <animated.div style={{ minHeight: x, minWidth: 325 }}>
        {props.content.title}
        {top}
        {interior}
      </animated.div>
    </div>
  );
};

class AccordionSidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modules: []
    };
    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidMount() {
    this.setState({
      modules: this.props.content
    });
  }

  handleToggle(content) {
    const updatedValues = this.state.modules.map(value => {
      let newValue = value;
      if (value.key === content.item.key) {
        newValue.open = !newValue.open;
        return newValue;
      } else {
        newValue.open = false;
        return newValue;
      }
    });
    this.setState({
      modules: updatedValues
    });
  }

  render() {
    if (this.state.modules.length > 0) {
      return (
        <div style={this.props.sticky !== undefined ? {position: 'sticky', top: 35} : {}}>
          <Transition
            items={this.state.modules}
            keys={item => item.key}
            from={{ marginTop: -1 * (100 + 40), opacity: 0 }}
            leave={{ marginTop: -1 * (100 + 40), opacity: 0 }}
            enter={{ marginTop: 15, opacity: 1 }}
            congig={config.default}
            trail={300}
          >
            {item => props => (
              <animated.div style={props}>
                <AccordionPanel
                  height={this.props.height}
                  color={item.color}
                  class={
                    item.color === styles.lightBlue
                      ? "panelBlue"
                      : item.color === styles.veryLightBlue
                      ? "panelLightBlue"
                      : "panelOrange"
                  }
                  show={item.open}
                  toggle={() => this.handleToggle({ item })}
                  content={item.content}
                />
              </animated.div>
            )}
          </Transition>
        </div>
      );
    }
    return <div />;
  }
}

export default AccordionSidebar;

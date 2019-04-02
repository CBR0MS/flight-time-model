import React from "react";
import Autocomplete from "react-autocomplete";

import styles from "../../Style/style";

class InputAutocompleteField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loc: props.val,
      userEnteredInfo: false
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const text = event.target.value;
    this.props.onChange(this.props.id, text);
    this.setState({
      loc: event.target.value,
      userEnteredInfo: true
    });
  }

  componentDidUpdate() {
    if (this.props.focus) {
      this.input.focus();
    }
  }

  render() {
    let val = "";
    if (this.state.userEnteredInfo) {
      val = this.state.loc;
    } else {
      val = this.props.val;
    }

    let change = value => {
      this.props.onChange(this.props.id, value);
      this.setState({
        loc: value,
        userEnteredInfo: true
      });
    };

    let placeholder = "";
    if (this.props.placeholder !== undefined) {
      placeholder = this.props.placeholder;
    }

    if (this.props.noChange) {
      change = value => {
        this.props.onChange(this.props.id, value);
      };
    }
    return (
      <Autocomplete
        items={this.props.autocompleteValues}
        ref={el => (this.input = el)}
        shouldItemRender={(item, value) =>
          item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
        }
        getItemValue={item => item.label}
        inputProps={{ placeholder: placeholder }}
        renderItem={(item, highlighted) => (
          <div
            key={item.key}
            style={{
              paddingLeft: "5px",
              cursor: "pointer",
              backgroundColor: highlighted ? styles.lightBlue : "transparent"
            }}
          >
            {item.label}
          </div>
        )}
        menuStyle={styles.autocompleteStyle}
        value={val}
        onChange={this.handleChange}
        onSelect={change}
        wrapperStyle={this.props.inStyle}
      />
    );
  }
}

export default InputAutocompleteField;

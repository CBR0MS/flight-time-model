import React from 'react'
import  Autocomplete  from 'react-autocomplete'

class LandingHeadingInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loc: props.val,
            userEnteredInfo: false
        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        const text = event.target.value;
        this.props.onChange(this.props.id, text)
        this.setState({
            loc: event.target.value,
            userEnteredInfo: true
        });
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     return !this.state.userEnteredInfo || nextState !== this.state
    // }


    render() {

        let val = ''
        if (this.state.userEnteredInfo) {
            val = this.state.loc
        } else { val = this.props.val}

        const menuStyle = {
            top: 'unset',
            left: 'unset',
            borderRadius: '3px',
            color: 'rgba(255, 255, 255, 0.8)',
            background: '#19547B',
            position: 'fixed',
            overflow: 'auto',
            maxHeight: '75%',
            fontSize: '1.3rem',
            minWidth: '300px',
            width: '300px'
        }

        return (
            <Autocomplete
                items={[
                  { id: 'foo', label: 'foo' },
                  { id: 'bar', label: 'bar' },
                  { id: 'baz', label: 'baz' },
                ]}
                shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
                getItemValue={item => item.label}
                renderItem={(item, highlighted) =>
                  <div
                    key={item.id}
                    style={{ backgroundColor: highlighted ? 'rgb(21, 68, 99)' : 'transparent'}}
                  >
                    {item.label}
                  </div>
                }
                menuStyle={menuStyle}
                value={val}
                onChange={this.handleChange}
                onSelect={value => {
                    this.props.onChange(this.props.id, value)
                    this.setState({
                        loc: value,
                        userEnteredInfo: true
                    })} }
                style={this.props.inStyle}
            />
            
        )
    }
}

export default LandingHeadingInput


import React from 'react'

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

        return (
            <input type="text" value={val} onChange={this.handleChange} style={this.props.style} />
            
        )
    }
}

export default LandingHeadingInput


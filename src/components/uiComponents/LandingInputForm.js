import React from 'react'

import GoButton from './GoButton'
import LandingHeadingInput from './LandingHeadingInput'

class LandingInputForm extends React.Component {

     constructor(props) {
        super(props)
        this.handleForm = this.handleForm.bind(this)
        this.submitForm = this.submitForm.bind(this)
        this.state = {
            firstVal: '',
            secondVal: ''
        }
    }

    handleForm(fieldId, value) {
        this.setState({ [fieldId]: value });
    }

    submitForm() {
        console.log(this.state.firstVal)
        console.log(this.state.secondVal)
    }

    render() {

        const headingStyle = {
            lineHeight: '60px',
            color: '#154463',
            fontWeight: '700',
            fontStyle: 'italic',  
            fontFamily: 'nimbus-sans-extended',
        }

        const inputStyle = {
            backgroundColor: 'transparent',
            border: 'none',
            // borderBottom: '3px solid #19547B',
            marginRight: '10px',
            color: '#19547B',
            width: '300px',
            height: '50px',
            fontWeight: '700',
            fontStyle: 'italic', 
            borderRadius: '5px'
        }
        /*value={this.state['firstVal']}*/
  
        return (
            <div>
                <h1 style={headingStyle}>
                    <span style={{paddingRight: '10px'}}>I'm flying from</span>
                    <LandingHeadingInput 
                        val={this.props.firstInputValue} 
                        inStyle={inputStyle}
                        key='firstVal'
                        id='firstVal'
                        onChange={this.handleForm}
                        
                        />
                    <span style={{paddingRight: '10px'}}>to</span>
                    <LandingHeadingInput 
                        val={this.props.secondInputValue} 
                        inStyle={inputStyle}
                        key='secondVal'
                        id='secondVal'
                        onChange={this.handleForm}
                    />
                </h1>
                <Subtitle />        
                <div onClick={this.submitForm}>
                    <GoButton >
                        Check my flight &rarr;
                    </GoButton>
                </div>
            </div>
        )
    }
}

export default LandingInputForm



const Subtitle = props => { 

    const subStyle = {
        margin: '40px 0',
        color: '#154463',
        maxWidth: '500px'
    }

    return (
       <h4 style={subStyle}>
           Compare Airlines and departure dates. Everything you need to know about your flight.
       </h4>
   )
}


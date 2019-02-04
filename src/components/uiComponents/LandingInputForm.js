import React from 'react'
import { Link } from 'react-router-dom'

import styles from './style/style'
import GoButton from './GoButton'
import InputAutocompleteField from './InputAutocompleteField'

class LandingInputForm extends React.Component {

     constructor(props) {
        super(props)
        this.handleForm = this.handleForm.bind(this)
    
        this.state = {
            firstVal: '',
            secondVal: ''
        }
    }

    handleForm(fieldId, value) {
        this.setState({ [fieldId]: value });
    }

    render() {

        return (
            <div>
                <h1 style={styles.landingHeadingStyle}>
                    <span style={{paddingRight: '10px'}}>I'm flying from</span>
                    <InputAutocompleteField 
                        val={this.props.firstInputValue} 
                        inStyle={styles.landingInputStyle}
                        key='firstVal'
                        id='firstVal'
                        onChange={this.handleForm}
                        autocompleteValues={this.props.firstAutocompleteValues}
                        />
                    <span style={{paddingRight: '10px'}}>to</span>
                    <InputAutocompleteField 
                        val={this.props.secondInputValue} 
                        inStyle={styles.landingInputStyle}
                        key='secondVal'
                        id='secondVal'
                        onChange={this.handleForm}
                        autocompleteValues={this.props.secondAutocompleteValues}
                    />
                </h1>
                <Subtitle />        
                <Link to={`/check?origin=${this.state.firstVal}&dest=${this.state.secondVal}`}>
                    <GoButton >
                        Check my flight &rarr;
                    </GoButton>
                </Link>
            </div>
        )
    }
}

export default LandingInputForm



const Subtitle = props => { 

    return (
       <h4 style={styles.landingSubStyle}>
           Compare Airlines and departure dates. Everything you need to know about your flight.
       </h4>
   )
}


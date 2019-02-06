import React from 'react'

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
        
                <GoButton link={`/check?origin=${this.state.firstVal}&dest=${this.state.secondVal}`}>
                        <span style={styles.goButtonInterior}>Check my flight &rarr;</span>
                    
                </GoButton>
                
            </div>
        )
    }
}

export default LandingInputForm



const Subtitle = props => { 

    return (
       <h4 style={styles.landingSubStyle}>
           Compare airlines and get accurate route and delay times. Enter your origin and destination to get started.
       </h4>
   )
}


import React from 'react'
import { Link } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import stringSimilarity from 'string-similarity'

import styles from './style/style'
import GoButton from './GoButton'
import InputAutocompleteField from './InputAutocompleteField'
import LandingBackground from './LandingBackground'

import 'react-datepicker/dist/react-datepicker.css'

class CheckInputForm extends React.Component {

     constructor(props) {
        super(props)
        this.handleForm = this.handleForm.bind(this)
        this.handleDateChange = this.handleDateChange.bind(this)
        this.findMostSimilarInput = this.findMostSimilarInput.bind(this)
        this.state = {
            origin: 'Los Angeles',
            destination: 'Houston',
            airlines: [],
            allAirlines: false,
            date: new Date()
        }
    }

    handleForm(fieldId, value) {
        this.setState({ [fieldId]: value });
    }

    handleDateChange(newDate) {
        this.setState({date: newDate})
    }

    findMostSimilarInput(target, choices) {
        return stringSimilarity.findBestMatch(target, choices).bestMatch.target
    }

    componentDidMount() {
        console.log(this.props.params)
        const passedOrigin = this.props.params.origin !== undefined && this.props.params.origin.length > 0
                                ? this.props.params.origin
                                : this.state.origin
        const passedDest = this.props.params.dest !== undefined && this.props.params.dest.length > 0
                                ? this.props.params.dest 
                                : this.state.destination
        

        this.locations = this.props.locations

        const newOrigin = this.findMostSimilarInput(passedOrigin, this.locations)
        const newDest = this.findMostSimilarInput(passedDest, this.locations)

        this.setState({
            origin: newOrigin,
            destination: newDest
        })
    }

    render() {

        return (
            <div>
                <LandingBackground opacity={1}/>
                <div style={styles.checkStyleOuter}>

                    <div style={styles.checkStyle}>
                        <div style={styles.panelWrapper}>
                        <InputAutocompleteField 
                            val={this.state.origin} 
                            inStyle={styles.checkInputBoxStyle}
                            key='origin'
                            id='origin'
                            onChange={this.handleForm}
                            autocompleteValues={this.props.autocompleteDataLocations}
                            />
                        <InputAutocompleteField 
                            val={this.state.destination} 
                            inStyle={styles.checkInputBoxStyle}
                            key='destination'
                            id='destination'
                            onChange={this.handleForm}
                            autocompleteValues={this.props.autocompleteDataLocations}
                        />
                        <DatePicker
                            selected={this.state.date}
                            onChange={this.handleDateChange}
                        />

                        
                            <GoButton centered={true}>
                                <Link to={`/predict?origin=${this.state.origin}`
                                      +`&dest=${this.state.destination}`
                                      +`&airlines=${this.state.airlines}`
                                      +`&date=${this.state.date !== null 
                                        ? this.state.date.toISOString()
                                        : 0 }`} >
                                <span style={styles.goButtonInterior}>Check my flight &rarr;</span>
                                </Link>
                            </GoButton>
                        </div>
                    </div>
                </div>     
                
            </div>
        )
    }
}

export default CheckInputForm
import React from 'react'
import DatePicker from 'react-datepicker'
import stringSimilarity from 'string-similarity'
import { Link } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import styles from './style/style'
import GoButton from './GoButton'
import InputAutocompleteField from './InputAutocompleteField'
import InputWrapper from './InputWrapper'
import AirlinePicker from './AirlinePicker'


import 'react-datepicker/dist/react-datepicker.css'

class CheckInputForm extends React.Component {

     constructor(props) {
        super(props)
        this.handleForm = this.handleForm.bind(this)
        this.handleDateChange = this.handleDateChange.bind(this)
        this.findMostSimilarInput = this.findMostSimilarInput.bind(this)
        this.handleAllAirlinesButton = this.handleAllAirlinesButton.bind(this)
        this.handleAirlineSelect = this.handleAirlineSelect.bind(this)
        this.removeAirline = this.removeAirline.bind(this)

        this.state = {
            origin: '',
            destination: '',
            dest_id: '',
            org_id: '',
            airline: '',
            airlines: [],
            airlinesIDs: [],
            allAirlines: true,
            selectAirlines: false,
            date: new Date()
        }
    }

    handleForm(fieldId, value) {
        if ((fieldId === 'org_id' || fieldId === 'dest_id') && (value.includes('(') && value.includes(')'))){
            value = value.split(' (')[1]
            value = value.split(')')[0]
        }
        this.setState({ [fieldId]: value });
    }

    handleDateChange(newDate) {
        this.setState({date: newDate})
    }

    handleAllAirlinesButton(e){
        this.setState({allAirlines: !this.state.allAirlines})
    }

    handleAirlineSelect(id, value) {
        if (value.includes('(') && value.includes(')')) {
            let airlines = this.state.airlines
            let airlinesIDs = this.state.airlinesIDs
            airlines.push(value)
            value = value.split(' (')[1]
            value = value.split(')')[0]
            airlinesIDs.push(value)

            this.setState({
                airlines: airlines,
                airlinesIDs: airlinesIDs,
            })
        }
    }

    removeAirline(valueToRemove) {
        const name = valueToRemove.airline
        let id = name.split(' (')[1]
        id = id.split(')')[0]
        const oldAirlines = this.state.airlines
        const oldAirlineIds = this.state.airlinesIDs
        const newAirlines = oldAirlines.filter(function(value, index, arr){
            return value !== name;
        })
        const newAirlineIds = oldAirlineIds.filter(function(value, index, arr){
            return value !== id;
        })
        this.setState({
            airlines: newAirlines,
            airlinesIDs: newAirlineIds,
        })
    }

    findMostSimilarInput(target, choices) {
        return stringSimilarity.findBestMatch(target, choices).bestMatch.target
    }

    componentDidMount() {
        console.log(this.props.params)
        this.locations = this.props.locations

        const passedOrigin = this.props.params.origin !== undefined && this.props.params.origin.length > 0
                                ? this.findMostSimilarInput(this.props.params.origin, this.locations)
                                : this.state.origin
        const passedDest = this.props.params.dest !== undefined && this.props.params.dest.length > 0
                                ? this.findMostSimilarInput(this.props.params.dest, this.locations) 
                                : this.state.destination
        
        this.setState({
            origin: passedOrigin,
            destination: passedDest
        })
        this.handleForm('dest_id', passedDest)
        this.handleForm('org_id', passedOrigin)
    }

    render() {
        
        let revisedHeadingStyle = Object.assign({}, styles.landingHeadingStyle)

        revisedHeadingStyle.color = styles.white    
        revisedHeadingStyle.paddingLeft = '15px'
        revisedHeadingStyle.marginBottom = '25px'
        revisedHeadingStyle.marginTop = '25px'

        let allOutlined = true
        let airlinePicker = (<div></div>)
        if (!this.state.allAirlines) {
            allOutlined = false
            const listItems = (
            <TransitionGroup >
            {this.state.airlines.map((airline, index) =>
                <CSSTransition
                    key={index}
                    timeout={250}
                    classNames='fade'
                >
                <div key={index} style={styles.airlineBar}>
                    {airline} 
                    <span 
                        style={styles.airlineDeleteButton}
                        onClick={() => this.removeAirline({airline})}>
                        &times;
                    </span>
                </div>
                </CSSTransition>
            )} 
            </TransitionGroup>
            )


            airlinePicker = (
                <AirlinePicker>
                    <div style={styles.airlineInputWrapper}>
                        <h5 style={styles.inputWrapperTitle}>Airlines</h5>
                      <InputAutocompleteField 
                            val={this.state.airline} 
                            inStyle={styles.checkInputBoxStyle}
                            key='airline'
                            id='airline'
                            placeholder='Select an airline'
                            noChange={true}
                            onChange={this.handleAirlineSelect}
                            autocompleteValues={this.props.autocompleteDataAirlines}
                        />
                    </div>
                    <div style={styles.airlinesSection}>
                        {listItems}
                    </div>
                </AirlinePicker>
            )
        }

        return (
                <div style={styles.checkStyleOuter}>
                   
                    <div style={styles.checkStyle}>

                        <div style={styles.panelWrapper}>

                            <h1 style={revisedHeadingStyle}>Check a Flight</h1>
                            <InputWrapper title='Origin'>
                                <InputAutocompleteField 
                                val={this.state.origin} 
                                inStyle={styles.checkInputBoxStyle}
                                key='origin'
                                id='org_id'
                                onChange={this.handleForm}
                                autocompleteValues={this.props.autocompleteDataLocations}
                                />
                            </InputWrapper>

                            <InputWrapper title='Destination'>
                                <InputAutocompleteField 
                                    val={this.state.destination} 
                                    inStyle={styles.checkInputBoxStyle}
                                    key='destination'
                                    id='dest_id'
                                    onChange={this.handleForm}
                                    autocompleteValues={this.props.autocompleteDataLocations}
                                />
                            </InputWrapper>

                            <InputWrapper title='Date'>
                                <div style={styles.checkInputBoxStyle}>
                                    <DatePicker
                                        selected={this.state.date}
                                        onChange={this.handleDateChange}
                                    />
                                </div>
                            </InputWrapper>
                            <div> 
                                <GoButton 
                                    outlined={allOutlined}
                                    onClick={this.handleAllAirlinesButton}
                                    centered={false} 
                                    color={styles.darkBlue}
                                    interiorColor={styles.adaptiveWhite}>
                                    <span>Compare All Airlines</span>
                                </GoButton>

                                <GoButton 
                                    outlined={!allOutlined}
                                    onClick={this.handleAllAirlinesButton}
                                    centered={false} 
                                    color={styles.darkBlue}
                                    interiorColor={styles.adaptiveWhite}>
                                    <span>Select Airlines</span>
                                </GoButton>
                            </div>
                            {airlinePicker}
                            <GoButton 
                                centered={true} 
                                color={styles.orange}
                                interiorColor={styles.darkBlue}
                                shadow={true}>   
                                <Link to={`/predict?origin=${this.state.org_id}`
                                      +`&dest=${this.state.dest_id}`
                                      +`&airlines=${this.state.airlinesIDs}`
                                      +`&allAirlines=${this.state.allAirlines}`
                                      +`&date=${this.state.date !== null 
                                        ? this.state.date.toISOString()
                                        : 0 }`}>
                                    <span style={{color: styles.darkBlue}}>Check my flight &rarr;</span>
                                </Link>    
                                
                            </GoButton>
                        </div>
                    </div>
                </div>     
        )
    }
}

export default CheckInputForm
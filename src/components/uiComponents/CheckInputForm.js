import React from 'react'
import DatePicker from 'react-datepicker'
import stringSimilarity from 'string-similarity'

import styles from './style/style'
import GoButton from './GoButton'
import InputAutocompleteField from './InputAutocompleteField'
import InputWrapper from './InputWrapper'
import AirlinePicker from './AirlinePicker'
import PanelGroup from './PanelGroup'
import ContentWrapper from './ContentWrapper'


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
        this.removeAlert = this.removeAlert.bind(this)

        this.state = {
            origin: '',
            destination: '',
            dest_id: '',
            org_id: '',
            airline: '',
            airlines: [],
            alerts: [],
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

    handleAirlineSelect(id, airline) {
        const reducedArr = this.props.autocompleteDataAirlines.filter((value, index, arr)=> {
            return airline === value.label
        })
        if (reducedArr.length > 0) {
            const id = reducedArr[0].value
            let airlines = this.state.airlines
            airlines.push(id)
            this.setState({
                airlines: airlines
            })
        }
    }

    removeAirline(valueToRemove) {
        const id = valueToRemove
        const oldAirlines = this.state.airlines
        const newAirlines = oldAirlines.filter((value, index, arr) => {
            return value !== id;
        })
        this.setState({
            airlines: newAirlines,
        })
    }

    removeAlert(valueToRemove) {
        const id = valueToRemove
        const oldAlerts = this.state.alerts
        const newAlerts = oldAlerts.filter((value, index, arr) => {
            return value !== id;
        })
        this.setState({
            alerts: newAlerts,
        })
    }

    findMostSimilarInput(target, choices) {
        return stringSimilarity.findBestMatch(target, choices).bestMatch.target
    }

    componentDidMount() {
        this.locations = this.props.locations

        const passedOrigin = this.props.params.origin !== undefined && this.props.params.origin.length > 0
                                ? this.findMostSimilarInput(this.props.params.origin, this.locations)
                                : this.state.origin
        const passedDest = this.props.params.dest !== undefined && this.props.params.dest.length > 0
                                ? this.findMostSimilarInput(this.props.params.dest, this.locations) 
                                : this.state.destination

        const passedAirlines = this.props.params.airlines !== undefined && this.props.params.airlines.length > 0
                                ? this.props.params.airlines.split(',')
                                : []
        // const passedAirlinesSelect = this.props.params.allAirlines !== undefined 
        //                             ? !(this.props.params.allAirlines === 'false')
        //                             : true
        const passedDate = this.props.params.date !== undefined 
                            ? new Date(this.props.params.date)
                            : new Date()

        this.setState({
            origin: passedOrigin,
            destination: passedDest,
            airlines: passedAirlines,
            date: passedDate,
        })
        this.handleForm('dest_id', passedDest)
        this.handleForm('org_id', passedOrigin)

        let alerts = this.state.alerts
        if (this.props.params.error === 'emptyPlaces'){
            alerts.push('Be sure to include a valid origin and destination for your flight')
        }
        if (this.props.params.error === 'emptyDate') {
            alerts.push('Be sure to include a date for your flight')
        } 
        if (this.props.params.error === 'badRoute') {
            alerts.push('The flight route you entered does not exist')
        }
        this.setState({alerts: alerts})
        //this.setState({allAirlines: passedAirlinesSelect})
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
            const airlineValues = this.state.airlines

            const listItems = (

                <PanelGroup 
                    badgeStyle={styles.airlineBar}
                    fadeOut={false} 
                    removeValue={this.removeAirline}
                    showValue={(airline) => {
                        return (
                        this.props.autocompleteDataAirlines.filter((value, index, arr) => {
                            return airline === value.value
                        })[0].label)}}
                    values={airlineValues}>
                </PanelGroup>

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

        let alerts = (<div></div>)

        if (this.state.alert !== ''){
            alerts = (
                <PanelGroup 
                containerStyle={styles.alertBox}
                badgeStyle={styles.alertBar}
                fadeOut={true}
                removeValue={this.removeAlert}
                showValue={(alert) => alert}
                values={this.state.alerts}>
                </PanelGroup>
            )
        }


        return (
            <div> 
                {alerts}

                <ContentWrapper>
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
                                        <span>Compare Selected Airlines</span>
                                    </GoButton>
                                </div>
                                {airlinePicker}
                                <GoButton 
                                    centered={true} 
                                    color={styles.orange}
                                    interiorColor={styles.darkBlue}
                                    shadow={true}
                                    link={`/predict?origin=${this.state.org_id}`
                                          +`&dest=${this.state.dest_id}`
                                          +`&airlines=${this.state.airlines}`
                                          +`&allAirlines=${this.state.allAirlines}`
                                          +`&date=${this.state.date !== null 
                                            ? this.state.date.toISOString()
                                            : 0 }`}>
                                        <span style={{color: styles.darkBlue}}>Check my flight &rarr;</span>   
                                    
                                </GoButton>
                            </div>
                        </div>
                    </div> 
                    

                </ContentWrapper>
                
            </div>     
        )
    }
}

export default CheckInputForm
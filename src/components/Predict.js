import React from 'react'
import queryString from 'query-string'
import { Redirect } from 'react-router-dom'

import LoadingScreen from './uiComponents/LoadingScreen'
import LandingBackground from './uiComponents/LandingBackground'
import styles from './uiComponents/style/style'
import PanelGroup from './uiComponents/PanelGroup'
import AccordionSidebar from './uiComponents/AccordionSidebar'

const uuidv1 = require('uuid/v1')

const FlexTable = props => {
  return (
    <div style={styles.flexTable}>
    {props.children}
    </div>
  )
}
const NumberGroup = props => {
  return (
    <div style={styles.inlineWrapper}>
      {props.children}
    </div>
    )
}

class Predict extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      couldNotCalcAllAirlines: false,
      redirectLoc: '',
      loadedSucessfully: false,
      airlines: [],
      origin: '',
      destination: '',
      alerts: [],
    }
    this.removeAlert = this.removeAlert.bind(this)
    this.setSidebarContent = this.setSidebarContent.bind(this)
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

  componentDidMount(){

    const params = queryString.parse(this.props.location.search)
    // check if basic info is missing and redirect
    if (params.dest === '' || params.orgin === '') {
      this.setState({ redirectLoc: `/check${this.props.location.search}&error=emptyPlaces`})
    } else if (params.date === ''){
      this.setState({ redirectLoc: `/check${this.props.location.search}&error=emptyDate`})
    } else {
      // if we have the info, proceed to verify it 
      const route = params.origin + '_' + params.dest
      // get the route 
      fetch(`https://api.flygeni.us/routes/${route}/?use_rc_ids=True`, {
        headers: {'Authorization': 'Token 62cfb7c66a3ac717a98d9b9d9eb16cdd4b7d15ba'}
      })
        .then(res => res.json())
        .then(data => {
            if (data.detail === 'Not found.'){
              this.setState({ redirectLoc: `/check${this.props.location.search}&error=badRoute`})
            } else {
              const passedAirlines = params.airlines.split(',')
              const airlinesInData = data.route_airlines.filter((value, index, arr) =>{
                  return passedAirlines.includes(value)
              })


              if (params.allAirlines || airlinesInData.length >= 1) {
                console.log('good!')
                console.log(airlinesInData)
              } 
              let alerts = this.state.alerts
              if (airlinesInData.length !== passedAirlines.length && params.allAirlines === 'false') {
                  alerts.push('Some airlines you selected do not fly the route you entered')
              }
              fetch(`https://api.flygeni.us/airports/${data.route_origin_airport}/`, {
                headers: {'Authorization': 'Token 62cfb7c66a3ac717a98d9b9d9eb16cdd4b7d15ba'}
              }).then(res => res.json()).then(originData => {

                fetch(`https://api.flygeni.us/airports/${data.route_destination_airport}/`, {
                  headers: {'Authorization': 'Token 62cfb7c66a3ac717a98d9b9d9eb16cdd4b7d15ba'}
                }).then(res => res.json()).then(destinationData => {

                  this.setState({
                    alerts: alerts,
                    routeObject: data,
                    originObject: originData,
                    destinationObject: destinationData,
                  })

                  this.setSidebarContent()
                  this.setState({loadedSucessfully: true})
                  
                })
              })
            }
        })
    }
  }

  setSidebarContent() {

    //https://stackoverflow.com/a/13627586
    function ordinalSuffixOf(i) {
      let j = i % 10,
          k = i % 100;
      if (j === 1 && k !== 11) {
          return 'st';
      }
      if (j === 2 && k !== 12) {
          return 'nd';
      }
      if (j === 3 && k !== 13) {
          return 'rd';
      }
      return 'th';
    }
    const formatTime = (n) => `${n / 60 ^ 0}:` + n % 60

    let firstContent = {}
    firstContent.title = ( <div>
      <h6>Origin Airport</h6>
      <h4>{this.state.originObject.airport_city + ', ' + this.state.originObject.airport_state + 
           ' (' + this.state.originObject.airport_id + ')'}</h4>
           </div>
    )
    firstContent.prompt = (
      <h6>{this.state.originObject.airport_id + '\'s flight statistics →'}</h6>
    )
    firstContent.content = (
      <div> 
        <FlexTable>
          <NumberGroup>
            <h1 style={styles.inlineWrapperNoMargin}>{this.state.originObject.airport_flight_volume_rank.toLocaleString()}</h1>
            <p style={styles.inlineWrapperNoMargin}>{ordinalSuffixOf(this.state.originObject.airport_flight_volume_rank)}</p>
            <p>busiest in U.S.</p>
          </NumberGroup>  
          <NumberGroup>
            <h1 style={styles.inlineWrapperNoMargin}>{this.state.originObject.airport_percent_ontime_departure}</h1>
            <p style={styles.inlineWrapperNoMargin}>%</p>
            <p>ontime departures</p>
          </NumberGroup> 
          <NumberGroup>
            <h1 style={styles.inlineWrapperNoMargin}>{this.state.originObject.airport_ontime_departure_rank.toLocaleString()}</h1>
            <p style={styles.inlineWrapperNoMargin}>{ordinalSuffixOf(this.state.originObject.airport_ontime_departure_rank)}</p>
            <p>most punctual in U.S.</p>
          </NumberGroup>  
          <NumberGroup>
            <h1 style={styles.inlineWrapperNoMargin}>{this.state.originObject.airport_departure_delay}</h1>
            <p style={styles.inlineWrapperNoMargin}>min</p>
            <p>average delay</p>
          </NumberGroup>  
        </FlexTable>
      </div>
    )
    let secondContent = {}
    secondContent.title = (<div>
      <h6>Route</h6>
      <h4>{this.state.originObject.airport_id + ' → ' +this.state.destinationObject.airport_id}</h4> </div>
    )
    secondContent.prompt = (
      <h6>This route's statistics →</h6>
    )
    secondContent.content = (
      <FlexTable>
          <NumberGroup>
            <h1 style={styles.inlineWrapperNoMargin}>{this.state.routeObject.route_flight_volume_rank.toLocaleString()}</h1>
            <p style={styles.inlineWrapperNoMargin}>{ordinalSuffixOf(this.state.routeObject.route_flight_volume_rank)}</p>
            <p>busiest in U.S.</p>
          </NumberGroup>  
          <NumberGroup>
            <h1 style={styles.inlineWrapperNoMargin}>{formatTime(this.state.routeObject.route_time)}</h1>
            <p>average flight time</p>
          </NumberGroup> 
          <NumberGroup>
            <h1 style={styles.inlineWrapperNoMargin}>{this.state.routeObject.route_airlines.length}</h1>
            <p style={styles.inlineWrapperNoMargin}>airlines</p>
            <p>fly this route</p>
          </NumberGroup> 
          <NumberGroup>
            <h1 style={styles.inlineWrapperNoMargin}>{this.state.routeObject.route_flights_per_year.toLocaleString()}</h1>
            <p>flights per year</p>
          </NumberGroup> 
        </FlexTable>
    )

    let thirdContent = {}
    thirdContent.title = (<div>
      <h6>Destination Airport</h6>
      <h4>{this.state.destinationObject.airport_city + ', ' + this.state.destinationObject.airport_state + 
           ' (' + this.state.destinationObject.airport_id + ')'}</h4> </div>
    )
    thirdContent.prompt = (
      <h6>{this.state.destinationObject.airport_id + '\'s flight statistics →'}</h6>
    )
    thirdContent.content = (
      <FlexTable>
          <NumberGroup>
            <h1 style={styles.inlineWrapperNoMargin}>{this.state.destinationObject.airport_flight_volume_rank.toLocaleString()}</h1>
            <p style={styles.inlineWrapperNoMargin}>{ordinalSuffixOf(this.state.destinationObject.airport_flight_volume_rank)}</p>
            <p>busiest in U.S.</p>
          </NumberGroup>  
          <NumberGroup>
            <h1 style={styles.inlineWrapperNoMargin}>{this.state.destinationObject.airport_percent_ontime_departure}</h1>
            <p style={styles.inlineWrapperNoMargin}>%</p>
            <p>ontime departures</p>
          </NumberGroup> 
          <NumberGroup>
            <h1 style={styles.inlineWrapperNoMargin}>{this.state.destinationObject.airport_ontime_departure_rank.toLocaleString()}</h1>
            <p style={styles.inlineWrapperNoMargin}>{ordinalSuffixOf(this.state.destinationObject.airport_ontime_departure_rank)}</p>
            <p>most punctual in U.S.</p>
          </NumberGroup>  
          <NumberGroup>
            <h1 style={styles.inlineWrapperNoMargin}>{this.state.destinationObject.airport_departure_delay}</h1>
            <p style={styles.inlineWrapperNoMargin}>min</p>
            <p>average delay</p>
          </NumberGroup>  
        </FlexTable>
    )

    let newData = [{content: firstContent, key: uuidv1(), open: false }]
    newData.push({content: secondContent, key: uuidv1(), open: true })
    newData.push({content: thirdContent, key: uuidv1(), open: false })

    this.setState({ sidebarContent: newData })
  }
 
  render() {

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
    
    if (this.state.redirectLoc !== ''){
      return (
        <Redirect to={ this.state.redirectLoc } push />
      )
    }

    if (!this.state.loadedSucessfully) {
      return (
        <div>
          <LandingBackground opacity={1}/>
          <LoadingScreen/>
        </div>
      )
    }

    return (
      <div>
          <LandingBackground opacity={1}/>
          {alerts}
          <div style= {styles.predictionWrapper}>
            <div style={styles.sidebarWrapper}>
              <AccordionSidebar
                content={this.state.sidebarContent}/>
            </div> 
            <div style={styles.contentWrapper}>
              <AccordionSidebar
                content={this.state.sidebarContent}/>
            </div> 
          </div>

        </div>
    )
  }

}

export default Predict
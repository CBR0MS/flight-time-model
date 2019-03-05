import React from 'react'
import queryString from 'query-string'
import { Redirect } from 'react-router-dom'

import LoadingScreen from './uiComponents/LoadingScreen'
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
      <h1 style={styles.inlineWrapperNoMargin}>{props.title}</h1>
      {props.suffix !== undefined ? (<p style={styles.inlineWrapperNoMargin}>{props.suffix}</p>) : null}
      <p>{props.caption}</p>
    </div>
    )
}

const DataCollection = props => {
  return (
  <FlexTable>
    <NumberGroup
      title={props.topLeft}
      suffix={props.topLeftSuffix}
      caption={props.topLeftCaption}
    /> 
    <NumberGroup
      title={props.topRight}
      suffix={props.topRightSuffix}
      caption={props.topRightCaption}
    /> 
    <NumberGroup
      title={props.bottomLeft}
      suffix={props.bottomLeftSuffix}
      caption={props.bottomLeftCaption}
    />
    <NumberGroup
      title={props.bottomRight}
      suffix={props.bottomRightSuffix}
      caption={props.bottomRightCaption}
    />
  </FlexTable>
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
      loadingText: ''
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

    document.title =  params.origin + ' to ' + params.dest + ' - FlyGenius'

    // check if basic info is missing and redirect
    if (params.dest === '' || params.orgin === '') {
      this.setState({ redirectLoc: `/check${this.props.location.search}&error=emptyPlaces`})
    } else if (params.date === ''){
      this.setState({ redirectLoc: `/check${this.props.location.search}&error=emptyDate`})
    } else {
      this.setState({loadingText: 'Checking route'})
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

              this.setState({loadingText: 'Checking airports'})

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
    const formatTime = (n) => `${n / 60 ^ 0}:` + ('0' + n % 60).slice(-2)


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
      <DataCollection
        topLeft={this.state.originObject.airport_flight_volume_rank.toLocaleString()}
        topLeftSuffix={ordinalSuffixOf(this.state.originObject.airport_flight_volume_rank)}
        topLeftCaption={'busiest in U.S.'}
        topRight={this.state.originObject.airport_percent_ontime_departure}
        topRightSuffix={'%'}
        topRightCaption={'ontime departures'}
        bottomLeft={this.state.originObject.airport_ontime_departure_rank.toLocaleString()}
        bottomLeftSuffix={ordinalSuffixOf(this.state.originObject.airport_ontime_departure_rank)}
        bottomLeftCaption={'most punctual in U.S.'}
        bottomRight={this.state.originObject.airport_departure_delay}
        bottomRightSuffix={'min'}
        bottomRightCaption={'average delay'}/>
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
      <DataCollection
        topRight={this.state.routeObject.route_flight_volume_rank.toLocaleString()}
        topRightSuffix={ordinalSuffixOf(this.state.routeObject.route_flight_volume_rank)}
        topRightCaption={'busiest in U.S.'}
        topLeft={formatTime(this.state.routeObject.route_time)}
        topLeftCaption={'average flight time'}
        bottomLeft={this.state.routeObject.route_airlines.length}
        bottomLeftSuffix={'airlines'}
        bottomLeftCaption={'fly this route'}
        bottomRight={this.state.routeObject.route_flights_per_year.toLocaleString()}
        bottomRightCaption={'flights per year'}/>
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
       <DataCollection
        topLeft={this.state.destinationObject.airport_flight_volume_rank.toLocaleString()}
        topLeftSuffix={ordinalSuffixOf(this.state.destinationObject.airport_flight_volume_rank)}
        topLeftCaption={'busiest in U.S.'}
        topRight={this.state.destinationObject.airport_percent_ontime_departure}
        topRightSuffix={'%'}
        topRightCaption={'ontime departures'}
        bottomLeft={this.state.destinationObject.airport_ontime_departure_rank.toLocaleString()}
        bottomLeftSuffix={ordinalSuffixOf(this.state.destinationObject.airport_ontime_departure_rank)}
        bottomLeftCaption={'most punctual in U.S.'}
        bottomRight={this.state.destinationObject.airport_departure_delay}
        bottomRightSuffix={'min'}
        bottomRightCaption={'average delay'}/>
    )

    let newData = [{content: firstContent, key: uuidv1(), open: false }]
    newData.push({content: secondContent, key: uuidv1(), open: false })
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
          <LoadingScreen text={this.state.loadingText}/>
        </div>
      )
    }

    return (
      <div>
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
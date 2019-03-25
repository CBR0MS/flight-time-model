import React from 'react'
import queryString from 'query-string'
import { Redirect } from 'react-router-dom'
import { Spring } from 'react-spring/renderprops'

import * as tf from '@tensorflow/tfjs'

import LoadingScreen from './uiComponents/LoadingScreen'
import styles from './uiComponents/style/style'
import PanelGroup from './uiComponents/PanelGroup'
import AccordionSidebar from './uiComponents/AccordionSidebar'
import ContentWrapper from './uiComponents/ContentWrapper'
import Footer from './uiComponents/Footer'
import DataCollection from './uiComponents/DataCollection'
import PredictionsPanel from './uiComponents/PredictionsPanel'

const uuidv1 = require('uuid/v1')

const formatTime = (n) => `${n / 60 ^ 0}:` + ('0' + n % 60).slice(-2)

//https://stackoverflow.com/a/13627586
const ordinalSuffixOf = (i) => {
  let j = i % 10, k = i % 100;
  if (j === 1 && k !== 11) {
    return 'st'
  }
  if (j === 2 && k !== 12) {
    return 'nd'
  }
  if (j === 3 && k !== 13) {
    return 'rd'
  }
  return 'th'
}

const getDataFromAPI = async (resource, loc) => {

  const responseData = await fetch(`https://api.flygeni.us/${resource}/${loc}/?use_rc_ids=True`)
                            .then(res => res.json())
                            .then(data => data)
  if (responseData.detail === 'Not found.') {
    return Promise.reject('badRoute')
  } else if (responseData.database_id === undefined) {
    // response should be {"detail":"Request was throttled. Expected available in 81909 seconds."}
    return Promise.reject('tooManyRequests')
  }
  return Promise.resolve(responseData)
}

class Predict extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      couldNotCalcAllAirlines: false,
      loadedSucessfully: false,
      apiError: false,
      airlines: [],
      alerts: [],
      origin: '',
      destination: '',
      redirectLoc: '',
      loadingText: '',
    }
    this.removeAlert = this.removeAlert.bind(this)
    this.setPageError = this.setPageError.bind(this)
    this.setRedirectError = this.setRedirectError.bind(this)
  }

  removeAlert(valueToRemove) {
    const newAlerts = this.state.alerts.filter((value) => value !== valueToRemove)
    this.setState({
        alerts: newAlerts,
    })
  }

  setPageError(error) {
    let alerts = this.state.alerts
    alerts.push(error)
    this.setState({
      alerts: alerts,
      apiError: true,
    })
  }

  setRedirectError(error) {
    this.setState({ redirectLoc: `/check${this.props.location.search}&error=${error}`})
  }

  // should be safe to make this async based on https://stackoverflow.com/a/47970822
  async componentDidMount(): Promise<void> {

    let params = queryString.parse(this.props.location.search)
    // query string can't parse booleans to the correct type
    params.connections = !(params.connections === 'false')
    params.allAirlines = !(params.allAirlines === 'false')

    document.title =  params.origin + ' to ' + params.dest + ' - FlyGenius'

    // check if basic info is missing and redirect
    if (params.dest === '' || params.orgin === '') {
      this.setRedirectError('emptyPlaces')
    } else if (params.date === ''){
      this.setRedirectError('emptyDate')
    } else {

      // info is good, let's get the data from the API
      this.setState({loadingText: 'Checking route'})
      
      const route = params.origin + '_' + params.dest
      
      let firstLeg, secondLeg = ''

      if (params.connections){
        firstLeg = params.origin + '_' + params.conn
        secondLeg = params.conn + '_' + params.dest
      }

      // try getting the data 
      try {

        let newData = {}
        
        if (!params.connections){
          newData[1] = await getDataFromAPI('routes', route)
        } else {
          newData[1] = await getDataFromAPI('routes', firstLeg)
          newData[3] = await getDataFromAPI('routes', secondLeg)
        }

        this.setState({loadingText: 'Checking airports'})
        const origin =  await getDataFromAPI('airports', params.origin)
        newData[0] = origin

        if (!params.connections){
          newData[2] = await getDataFromAPI('airports', params.dest)
        } else {
          newData[2] = await getDataFromAPI('airports', params.conn)
          newData[4] = await getDataFromAPI('airports', params.dest)
        }

        this.setState({loadingText: 'Making predictions'})
        
        // now we load the models 
        const arrivalModel = await tf.loadLayersModel('/model/model.json')
        const usrDate = new Date(params.date)
        const month = usrDate.getMonth() + 1
        const dayOfWeek = usrDate.getUTCDay() + 1
       

        // now we check if the user's selected airlines match available airlines 
        const passedAirlines = params.airlines.split(',')
        let airlinesInData = newData[1].route_airlines
        let airlinesInData2 = []
        if (params.connections) {airlinesInData2 = newData[3].route_airlines}

        // reducing the list of all airlines if the user enters a specific set to try
        if (!params.allAirlines && passedAirlines.length > 0){
          airlinesInData = newData[1].route_airlines.filter((value) => passedAirlines.includes(value))
          if (params.connections){
            airlinesInData2 = newData[3].route_airlines.filter((value) => passedAirlines.includes(value))
          }
        }

        let completeAirlinesList = airlinesInData

        // if we have two flights, create a set of airlines that fly both
        if (params.allAirlines && params.connections) {
          if (airlinesInData2.length > airlinesInData.length) {
            completeAirlinesList = airlinesInData2.filter((value) => airlinesInData.includes(value))
          } else { completeAirlinesList = airlinesInData.filter((value) => airlinesInData2.includes(value)) }
        }
        
        console.log(airlinesInData)
        console.log(airlinesInData2)
        console.log(completeAirlinesList)

        if (((params.connections && 
              airlinesInData.length !== passedAirlines.length && 
              airlinesInData2.length !== passedAirlines.length) || 
            (!params.connections && 
              airlinesInData.length !== passedAirlines.length)) && 
              !params.allAirlines) {

            let alerts = this.state.alerts
            alerts.push('Some airlines you selected do not fly the route you entered')
            this.setState({alerts: alerts})
        }

        // const testAirline = await getDataFromAPI('airlines', passedAirlines[0]) 
        // const input = tf.tensor([[month, dayOfWeek, testAirline.airline_percent_ontime_arrival, origin.airport_percent_ontime_departure, 0 ]])
        // const predictionDep = Array.from(arrivalModel.predict(input).dataSync())
        // console.log(predictionDep)

        
        // this.setState({
        //   dataObjects: newData,
        // })
        
        let sidebarData = []
      
        // now we can construct the sidebar objects 
        for (const index in newData){
          
          const data = newData[index]
          let content = {}
          let color = styles.lightBlue

          if (data.airport_id !== undefined){

            content.title = ( <div>
              <h6>Airport</h6>
              <h4>{data.airport_city + ', ' + data.airport_state + 
                   ' (' + data.airport_id + ')'}</h4>
                   </div>
            )
            content.prompt = (
              <h6>{data.airport_id + '\'s flight statistics →'}</h6>
            )
            content.content = (
              <DataCollection
                topLeft={data.airport_flight_volume_rank.toLocaleString()}
                topLeftSuffix={ordinalSuffixOf(data.airport_flight_volume_rank)}
                topLeftCaption={'busiest in U.S.'}
                topRight={data.airport_percent_ontime_departure}
                topRightSuffix={'%'}
                topRightCaption={'ontime departures'}
                bottomLeft={data.airport_ontime_departure_rank.toLocaleString()}
                bottomLeftSuffix={ordinalSuffixOf(data.airport_ontime_departure_rank)}
                bottomLeftCaption={'most punctual in U.S.'}
                bottomRight={data.airport_departure_delay}
                bottomRightSuffix={'min'}
                bottomRightCaption={'average delay'}/>
            )
          } else {
            content.title = (<div>
              <h6>Route</h6>
              <h4>{data.route_origin_airport + ' → ' + data.route_destination_airport}</h4> </div>
            )
            content.prompt = (
              <h6>This route's statistics →</h6>
            )
            content.content = (
              <DataCollection
                topRight={data.route_flight_volume_rank.toLocaleString()}
                topRightSuffix={ordinalSuffixOf(data.route_flight_volume_rank)}
                topRightCaption={'busiest in U.S.'}
                topLeft={formatTime(data.route_time)}
                topLeftCaption={'average flight time'}
                bottomLeft={data.route_airlines.length}
                bottomLeftSuffix={'airlines'}
                bottomLeftCaption={'fly this route'}
                bottomRight={data.route_flights_per_year.toLocaleString()}
                bottomRightCaption={'flights per year'}/>
            )
            color = styles.veryLightBlue
          }
          sidebarData.push({content: content, key: uuidv1(), open: false, color: color })
        } 

        this.setState({
          loadedSucessfully: true,
          sidebarContent: sidebarData,
        })

      } catch(err) {
        console.log(err)
        // errors from API calls 
        switch (err){
          case 'badRoute':
            this.setRedirectError('badRoute')
            break

          case 'tooManyRequests':
            this.setPageError('You\'ve made too many requests. Please try again later!')
            break

          default: 
            this.setPageError('An unknown error ocurred. Please try again later!')
            break
        }
      }
    }

    return Promise.resolve();
}

  render() {
    
    // if there are any alerts, populate their container 
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
    
    // if we need to redirect, to that now
    if (this.state.redirectLoc !== ''){
      return (
        <Redirect to={ this.state.redirectLoc } push />
      )
    }

    // if there's an API error, show the message and redirect on close 
    if (this.state.apiError){
      return (
        <div>
          <PanelGroup 
            containerStyle={styles.alertBox}
            badgeStyle={styles.alertBar}
            fadeOut={false}
            removeValue={() => {
              this.removeAlert()
              this.setState({
                redirectLoc: '/'
              })
            }}
            showValue={(alert) => alert}
            values={this.state.alerts}>
            </PanelGroup>
        </div>
      )
    }
    
    // while loading, show the loading text only 
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
        <ContentWrapper>
          <div style= {styles.predictionWrapper}>
            <div style={styles.sidebarWrapper}>
              <AccordionSidebar
                content={this.state.sidebarContent}/>
            </div> 
            <div style={styles.contentWrapper}>
            <Spring
              config={{duration: 1000}}
              from={{ opacity: 0 }}
               to={{ opacity: 1 }}>
              {props => 
                <div style={props}>
                  <PredictionsPanel/>
                </div>}
              </Spring>
            </div> 
          </div>
          <Footer/>

        </ContentWrapper>
        
      
      </div>
    )
  }

}

export default Predict
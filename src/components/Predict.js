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

// helpers 
import { formatTime, ordinalSuffixOf } from './helpers/Assorted'
import { getDataFromAPI, makePredictions, filterListOfAirlinesWithAirports } from './helpers/Predict'

const uuidv1 = require('uuid/v1')

const constructSidebar = newData => {

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
  return sidebarData
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
    // query string can't parse booleans to the correct type, so let's convert
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

      // try getting the data, model, and making predictions
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
        
        // now we gather the data used to make the prediction and load the model
        const usrDate = new Date(params.date)

        const meta = {
          date: usrDate,
          month: usrDate.getMonth() + 1,
          dayOfWeek: usrDate.getUTCDay() + 1,
          arrivalModel: await tf.loadLayersModel('/model/model.json')
        }
       
        // filter the list of airlines to test based on the airports entered by the user
        let airlinesLists = filterListOfAirlinesWithAirports(params, newData)
       
        const passedAirlines = params.airlines.split(',')
        
         // now we check if the user's selected airlines match available airlines 
        if (((params.connections && 
              airlinesLists.airlinesInData.length !== passedAirlines.length && 
              airlinesLists.airlinesInData2.length !== passedAirlines.length) || 
            (!params.connections && 
              airlinesLists.airlinesInData.length !== passedAirlines.length)) && 
              !params.allAirlines) {

            let alerts = this.state.alerts
            
            
            // if the user entered all bad airlines, try again with all airlines
            if (airlinesLists.completeAirlinesList.length === 0) {
                alerts.push('No airlines you entered fly this route. Comparing all airlines instead.')
                params.allAirlines = true
                airlinesLists = filterListOfAirlinesWithAirports(params, newData)
            } else {
              alerts.push('Some airlines you selected do not fly the route you entered.')
            }

            this.setState({alerts: alerts})
        }

        // fetch the airline data from the API and make predictions
        const predictions = await makePredictions(newData, airlinesLists.completeAirlinesList, meta)
        
        console.log(predictions)

        // create the sidebar jsx 
        const sidebarData = constructSidebar(newData)
      

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
      return ( <Redirect to={ this.state.redirectLoc } push /> )
    }

    // while loading, show the loading text only 
    if (!this.state.loadedSucessfully) {
      return (<LoadingScreen text={this.state.loadingText}/>)
    }

    // if there's an API error, show the message and redirect on close 
    if (this.state.apiError){
      return (
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
                <AccordionSidebar
                content={this.state.sidebarContent}/>
                 
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
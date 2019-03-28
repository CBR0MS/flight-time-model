import React from 'react'
import queryString from 'query-string'
import { Redirect } from 'react-router-dom'

import * as tf from '@tensorflow/tfjs'

import LoadingScreen from './uiComponents/LoadingScreen'
import styles from './uiComponents/style/style'
import PanelGroup from './uiComponents/PanelGroup'
import AccordionSidebar from './uiComponents/AccordionSidebar'
import ContentWrapper from './uiComponents/ContentWrapper'
import Footer from './uiComponents/Footer'

import { getDataFromAPI, makePredictions, filterListOfAirlinesWithAirports, 
        constructSidebar, constructMain } from './helpers/Predict'


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

  setPageError(error, update) {
    let alerts = this.state.alerts
    // if update, we are updating a previous message rather than adding a new one
    // the component knows to do this since the message is an object rather than a string
    if (update) {
      alerts[alerts.length - 1] = {val: error, index: alerts.length - 1}
    } else {
       alerts.push(error)
    }

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
        const mainData = constructMain(predictions)

        this.setState({
          loadedSucessfully: true,
          sidebarContent: sidebarData,
          mainContent: mainData,
        })

      } catch(err) {
        console.log(err)
        // errors from API calls 
        switch (err.err){
          case 'badRoute':
            this.setRedirectError('badRoute')
            break

          case 'tooManyRequests':
            let seconds = err.time
            this.setPageError(`You've made too many requests. Please try again in ${seconds} seconds.`, false)
            // set an interval to count down the number of seconds until timeout is over
            this.tryAgainInterval = setInterval(() => {
              seconds -= 1
              if (seconds <= 0){
                clearInterval(this.tryAgainInterval)
                this.setState({ redirectLoc: `/check`})
              } else {
                this.setPageError(`You've made too many requests. Please try again in ${seconds} seconds.`, true)
              }
            }, 1000)
            break

          default: 
            this.setPageError('An unknown error ocurred. Please try again later!', false)
            break
        }
      }
    }

    return Promise.resolve();
}

componentWillUnmount() {
  if (this.tryAgainInterval !== undefined) {
    clearInterval(this.tryAgainInterval)
  }
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
    if (!this.state.loadedSucessfully && !this.state.apiError) {
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
              <AccordionSidebar
                content={this.state.mainContent}/>
            </div> 
          </div>
          <Footer/>
        </ContentWrapper>
      </div>
    )
  }

}

export default Predict
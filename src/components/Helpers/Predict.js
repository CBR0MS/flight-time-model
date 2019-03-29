import * as tf from '@tensorflow/tfjs'
import React from 'react'

import {DataCollection, NumberGroup } from '../UIComponents/Wrappers/DataCollection'
import styles from '../Style/style'

import { formatTime, ordinalSuffixOf } from './Assorted'

const uuidv1 = require('uuid/v1')

// get data from the FlyGenius API for a given resource and location
// see https://api.flygeni.us/docs/#flygenius-api-documentation-resources-in-the-api
// for all the possible resources 
export const getDataFromAPI = async (resource, loc) => {

  const responseData = await fetch(`https://api.flygeni.us/${resource}/${loc}/?use_rc_ids=True`)
                            .then(res => res.json())
                            .then(data => data)
  if (responseData.detail === 'Not found.') {
    return Promise.reject({err: 'badRoute'})
  } else if (responseData.database_id === undefined) {
    // response should be {"detail":"Request was throttled. Expected available in 89 seconds."}
    return Promise.reject({err: 'tooManyRequests', time: parseInt(responseData['detail'].match(/\d+/)[0])})
  }
  return Promise.resolve(responseData)
}

// get the airline data and use it to make predictions with a given model and input
// features passed in meta
export const makePredictions = async (newData, completeAirlinesList, meta) => {
  // load the airline data from the API
  let airportData = []
  for (const i in completeAirlinesList) {
    airportData.push(await getDataFromAPI('airlines', completeAirlinesList[i]) )
  }
  
  // create the predictions
  let predictions = []
  for (const i in airportData) {
    const inputOntime = tf.tensor([[meta.month, meta.dayOfWeek, 
                                    airportData[i].airline_percent_ontime_arrival, 
                                    newData[0].airport_percent_ontime_departure, 0]])
    const inputDelayed = tf.tensor([[meta.month, meta.dayOfWeek, 
                                    airportData[i].airline_percent_ontime_arrival, 
                                    newData[0].airport_percent_ontime_departure, 1]])
    const predGivenOtime = Array.from(meta.arrivalModel.predict(inputOntime).dataSync())
    const predGivenDelayed = Array.from(meta.arrivalModel.predict(inputDelayed).dataSync())

    const overallOntime = airportData[i].airline_percent_ontime_arrival/100 * predGivenOtime[0] +
                          airportData[i].airline_percent_ontime_arrival/100 * predGivenDelayed[0]

    const data = {airline: airportData[i],
                  ontime: predGivenOtime,
                  delayed: predGivenDelayed,
                  overall: overallOntime}
    predictions.push(data)
  }
  return predictions
}

// fliter down the list of passed airlines or all airlines based on which fly
// to origin, destination, and/or connection airports
export const filterListOfAirlinesWithAirports = (params, newData) => {

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
    return {airlinesInData: airlinesInData, airlinesInData2: airlinesInData2, completeAirlinesList: completeAirlinesList}
}


// construct the jsx for the sidebar with airport and route info 
export const constructSidebar = newData => {

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
          topLeftCaption={'expected flight time'}
          bottomLeft={data.route_airlines.length}
          bottomLeftSuffix={'airlines'}
          bottomLeftCaption={'fly this route'}
          bottomRight={data.route_flights_per_year.toLocaleString()}
          bottomRightCaption={'flights per year'}/>
      )
      color = styles.veryLightBlue
    }
    sidebarData.push({content: content, key: uuidv1(), open: (parseInt(index) === 1), color: color })
  } 
  return sidebarData
}

// construct the jsx for the main section with prediction info 
export const constructMain = (predictions) => {
    
    // compare the overall attribute of two predictions object 
    const compare = (a, b) => {
      const aVal = Math.round(a.overall * 100)
      const bVal = Math.round(b.overall * 100)

      let comparison = 0;
      if (aVal < bVal) {
        comparison = 1;
      } else if (aVal > bVal) {
        comparison = -1;
      }
      return comparison
    }

  let mainData = []

  // sort the airlines by predicted time 
  const sortedPredictions = predictions.sort(compare);

  // now we can construct the sidebar objects 
  for (const index in sortedPredictions){
    
    let content = {}
    let color = styles.lightBlue
    
    const displayIndex = parseInt(index) + 1 

    content.title = ( 
    <div>
        <div style={{display: 'inline-block'}}>
            <h6>{displayIndex.toString() + ordinalSuffixOf(displayIndex) + ' Best Airline'}</h6>
            <h4>{sortedPredictions[index].airline.airline_name.split(' Air')[0]}</h4>
        </div>
        <NumberGroup
            title={Math.round(sortedPredictions[index].overall * 100)}
            suffix='%'
            caption=''
            style={{float: 'right', width: 120}}
            floatNum={'right'}/>
    </div>
    )
    content.prompt = (
        <h6>{sortedPredictions[index].airline.airline_id + '\'s flight statistics →'}</h6>
    )
    content.content = (<div></div>)

    if (parseInt(index) % 2 === 1){ color = styles.veryLightBlue }
    if (parseInt(index) === 0){ color = styles.orange }    

    mainData.push({content: content, key: uuidv1(), open: (parseInt(index) === 0), color: color })
  } 
  return mainData
}


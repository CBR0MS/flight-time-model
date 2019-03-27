import * as tf from '@tensorflow/tfjs'


// get data from the FlyGenius API for a given resource and location
// see https://api.flygeni.us/docs/#flygenius-api-documentation-resources-in-the-api
// for all the possible resources 
export const getDataFromAPI = async (resource, loc) => {

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

    const data = {ontime: predGivenOtime,
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



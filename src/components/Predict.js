import React from 'react'
import queryString from 'query-string'
import { Redirect } from 'react-router-dom'

import LoadingScreen from './uiComponents/LoadingScreen'
import LandingBackground from './uiComponents/LandingBackground'

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
    }
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

              let couldNotCalcAll = false

              if (params.allAirlines || airlinesInData.length >= 1) {
                console.log('good!')
                console.log(airlinesInData)
              } 
              if (airlinesInData.length !== params.airlines && !params.allAirlines) {
                  couldNotCalcAll = true
              }
            }
            

            // let airports = []
            // let airlines = []
            // let destinations = []

            // for (const loc in data) {
            //   const displayName = data[loc].airport_city + ', ' + data[loc].airport_state + ' (' + data[loc].airport_id + ')'
            //   const valueName = data[loc].airport_id
            //   airports.push({label: displayName, value: valueName, key: loc})
            //   destinations.push(displayName)
            // }
        })
    }
  }
 
  render() {
    
    if (this.state.redirectLoc !== ''){
      console.log('bas')
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
      <h1>Prediction goes here</h1>
    )
  }

}

export default Predict
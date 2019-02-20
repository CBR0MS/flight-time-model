import React from 'react'
import queryString from 'query-string'
import { Spring } from 'react-spring/renderprops'

import CheckInputForm from './uiComponents/CheckInputForm'
import LoadingScreen from './uiComponents/LoadingScreen'
import LandingBackground from './uiComponents/LandingBackground'


class Check extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      params: {},
      autocompleteLocations: [],
      autocompleteAirlines: [],
      locations: []
    }
  }

  componentDidMount() {
    const newParams = queryString.parse(this.props.location.search)
    fetch('https://api.flygeni.us/airports/?use_details=True', {
      headers: {'Authorization': 'Token 62cfb7c66a3ac717a98d9b9d9eb16cdd4b7d15ba'}
    })
      .then(res => res.json())
      .then(data => {

          let airports = []
          let airlines = []
          let destinations = []

          for (const loc in data) {
            const displayName = data[loc].airport_city + ', ' + data[loc].airport_state + ' (' + data[loc].airport_id + ')'
            const valueName = data[loc].airport_id
            airports.push({label: displayName, value: valueName, key: loc})
            destinations.push(displayName)
          }

          fetch('https://api.flygeni.us/airlines/?use_details=True', {
            headers: {'Authorization': 'Token 62cfb7c66a3ac717a98d9b9d9eb16cdd4b7d15ba'}
          })
          .then(res => res.json())
          .then(data => {
             
              for (const loc in data) {
                const displayName = data[loc].airline_name + ' (' + data[loc].airline_id + ')'
                const valueName = data[loc].airline_id
                airlines.push({label: displayName, value: valueName, key: loc})
              }
              
          })
          
          this.setState({
            params: newParams,
            autocompleteAirlines: airlines,
            autocompleteLocations: airports,
            locations: destinations
          })
      })

      
  }

 
  render() {
    if (this.state.autocompleteLocations.length <= 0) {
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
        <Spring
          from={{ opacity: 0 }}
           to={{ opacity: 1 }}>
          {props => 
            <div style={props}>
            <CheckInputForm 
              params={this.state.params}
              autocompleteDataLocations={this.state.autocompleteLocations}
              autocompleteDataAirlines={this.state.autocompleteAirlines}
              locations={this.state.locations}
            />
          </div>}
        </Spring>
        
      </div>
    )
  }

}

export default Check
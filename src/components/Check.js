import React from 'react'
import queryString from 'query-string'
import { Spring } from 'react-spring/renderprops'

import CheckInputForm from './uiComponents/CheckInputForm'
import LoadingScreen from './uiComponents/LoadingScreen'


class Check extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      params: {},
      autocompleteLocations: [],
      autocompleteAirlines: [],
      locations: [],
      loadingText: ''
    }
  }

  componentDidMount() {
    document.title = 'Check a Flight - FlyGenius'
    const newParams = queryString.parse(this.props.location.search)
    fetch('./data/airports.json')
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

          fetch('./data/airlines.json')
          .then(res => res.json())
          .then(data => {
             
              for (const loc in data) {
                const displayName = data[loc].airline_name 
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
          <LoadingScreen text={this.state.loadingText}/>
        </div>
      )
    }
    return (
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
    )
  }

}

export default Check
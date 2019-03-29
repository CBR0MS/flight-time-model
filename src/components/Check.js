import React from 'react'
import queryString from 'query-string'
import { Spring } from 'react-spring/renderprops'

import CheckInputForm from './UIComponents/Forms/CheckInputForm'
import LoadingScreen from './UIComponents/Backgrounds/LoadingScreen'


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

          for (const i in data) {
            const displayName = data[i].airport_city + ', ' + data[i].airport_state + ' (' + data[i].airport_id + ')'
            const valueName = data[i].airport_id
            airports.push({label: displayName, value: valueName, key: i})
            destinations.push(displayName)
          }

          fetch('./data/airlines.json')
          .then(res => res.json())
          .then(data => {
             
              for (const i in data) {
                const displayName = data[i].airline_name 
                const valueName = data[i].airline_id
                airlines.push({label: displayName, value: valueName, key: i})
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
      return (<LoadingScreen text={this.state.loadingText}/>)
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
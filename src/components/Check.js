import React from 'react'
import queryString from 'query-string';

import CheckInputForm from './uiComponents/CheckInputForm'


class Check extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      params: {},
      autocompleteLocations: [],
      locations: []
    }
  }

  componentDidMount() {
    const newParams = queryString.parse(this.props.location.search)

    fetch('./data/cities.json')
      .then(res => res.json())
      .then(data => {
          
          let newData = []
          for (const loc in data.cities) {
            newData.push({label: data.cities[loc], value: data.cities[loc], key: loc})
          }
          
          this.setState({
            params: newParams,
            autocompleteLocations: newData,
            locations: data.cities 
          })
      })
  }

 
  render() {

    if (this.state.autocompleteLocations.length <= 0) {
      return (
        <h1>loading</h1>
      )
    }
    return (
      <CheckInputForm 
        params={this.state.params}
        autocompleteDataLocations={this.state.autocompleteLocations}
        locations={this.state.locations}
      />
    )
  }

}

export default Check
import React from 'react'
import queryString from 'query-string';

class Landing extends React.Component {

    render() {
        let params = queryString.parse(this.props.location.search)
        console.log(params)

        return (
            <p>Predict</p>
        )
    }
}

export default Landing
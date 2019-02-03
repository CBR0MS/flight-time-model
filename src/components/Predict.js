import React from 'react'
import queryString from 'query-string';
import DatePicker from "react-datepicker";
 
import "react-datepicker/dist/react-datepicker.css";

class Landing extends React.Component {

    constructor(props) {
    super(props);
    this.state = {
      startDate: new Date()
    };
    this.handleChange = this.handleChange.bind(this);
  }
 
  handleChange(date) {
    this.setState({
      startDate: date
    });
  }
 
  render() {
    return (
      <DatePicker
        selected={this.state.startDate}
        onChange={this.handleChange}
      />
    );
  }

    // render() {
    //     let params = queryString.parse(this.props.location.search)
    //     console.log(params)

    //     return (
    //         <div>
                

    //         </div>
    //     )
    // }
}

export default Landing
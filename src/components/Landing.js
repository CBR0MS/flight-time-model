import React from 'react'
import { withBreakpoints } from 'react-breakpoints'

import style from './uiComponents/style/style'
import LandingBackground from './uiComponents/LandingBackground'
import LandingInputForm from './uiComponents/LandingInputForm'


class Landing extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            firstInputValue: 'here',
            secondInputValue: 'there'
        }
        this.updateInputDisplayValues = this.updateInputDisplayValues.bind(this)
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     return nextProps !== this.props
    // }

    updateInputDisplayValues(data, dataLength) {

        const val1 = data[randomNum(dataLength-1)]
        const val2 = data[randomNum(dataLength-1)+1]

        this.setState({
            firstInputValue: val1,
            secondInputValue: val2
        }) 

    }

    componentDidMount() {
        fetch('./data/cities.json')
            .then(res => res.json())
            .then(data => {
                
                const allData = data.cities 
                const dataLength = allData.length

                this.updateInputDisplayValues(allData, dataLength)

                this.interval = setInterval(() => {
                    this.updateInputDisplayValues(allData, dataLength)
                    
                }, 3000)
            })
    }

    componentWillUnmount() {

        clearInterval(this.interval)
    }


    render() {

        const { breakpoints, currentBreakpoint } = this.props
        let maxWidth = '320px'
        let dispTop = '120px'
        
        if (breakpoints[currentBreakpoint] > breakpoints.mobile) {
            maxWidth = '620px'
            dispTop = '200px'
        } 
        if (breakpoints[currentBreakpoint] > breakpoints.tablet) {
            maxWidth = '800px'
            dispTop = '250px'
        } 
        if (breakpoints[currentBreakpoint] > breakpoints.desktopLarge) {
            maxWidth = '1040px'
        } 
        
        let frontStyle = Object.assign({}, style.landingContainerStyle)
        
        frontStyle.top = dispTop
        frontStyle.width = maxWidth

        const autoCompleteValues = [
            { id: 'foo', label: 'foo' },
            { id: 'bar', label: 'bar' },
            { id: 'baz', label: 'baz' },
        ]

    
        return (
            <div >
                <LandingBackground />
                <img src="/clouds.jpeg" style={style.landingImageStyle} alt=''/>
                <div style={frontStyle}>
                    <LandingInputForm
                        firstInputValue={this.state.firstInputValue}
                        firstAutocompleteValues={autoCompleteValues}
                        secondInputValue={this.state.secondInputValue} 
                        secondAutocompleteValues={autoCompleteValues}
                        />
                </div>
            </div>
        )
    }
}

export default withBreakpoints(Landing)

function randomNum(length) {
    return Math.floor(Math.random() * length-1)
}



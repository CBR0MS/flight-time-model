import React from 'react'
import { withBreakpoints } from 'react-breakpoints'
import { Spring } from 'react-spring/renderprops'

import style from './uiComponents/style/style'
import LandingBackground from './uiComponents/LandingBackground'
import LandingInputForm from './uiComponents/LandingInputForm'



class Landing extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            first: false,
            second: false,
            firstInputValue: 'here',
            secondInputValue: 'there',
            autocompleteValues: [{value: '', label: ''}], 
        }
        this.updateInputDisplayValues = this.updateInputDisplayValues.bind(this)
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     return nextProps !== this.props
    // }

    updateInputDisplayValues(data, dataLength) {
        const index = randomNum(dataLength-2)
        const val1 = (data[index]).split('')
        const val2 = (data[index+1]).split('')

        let i = 0
        let j = 0
        let start1 = ''
        let start2 = ''
        const bar = '|'


        this.intervalOne = setInterval(() => {

            if (i < val1.length){
                // update the array with the next char and move 'cursor'
                start1 = start1.slice(0, -1)
                start1 += val1[i]
                start1 += bar
            } else {
                // when done, remove the 'cursor'
                start1 = start1.slice(0, -1)
                this.setState({
                    firstInputValue: start1,
                }) 
                clearInterval(this.intervalOne)
                // start interval 2
                this.intervalTwo = setInterval(() => {

                    if (j < val2.length) {
                        start2 = start2.slice(0, -1)
                        start2 += val2[j]
                        start2 += bar
                    } else {
                        // when done, remove the 'cursor'
                        start2 = start2.slice(0, -1)
                        this.setState({
                            secondInputValue: start2,
                        })
                        clearInterval(this.intervalTwo)
                    }
                    this.setState({
                        secondInputValue: start2,
                    }) 
                    j += 1  
                }, 100)
            }
            this.setState({
                firstInputValue: start1,
            }) 
            i += 1  
        }, 100)

    }

    componentDidMount() {
        document.title = 'Flight Stats Prediction - FlyGenius'
        fetch('./data/cities.json')
            .then(res => res.json())
            .then(data => {

                let newData = []
                for (const loc in data.cities) {
                    const displayName = data.cities[loc]
                    const valueName = data.cities[loc]
                newData.push({label: displayName, value: valueName, key: loc})
                }
                const allData = data.cities 
                const dataLength = allData.length
                this.setState({
                    autocompleteValues: newData
                })

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

        return (
            <div >
                
                <Spring
                  from={{ opacity: 0 }}
                   to={{ opacity: 1 }}>
                  {props => 
                    <div style={props}>
                        <LandingBackground />
                        <img src="/clouds.jpeg" style={style.landingImageStyle} alt=''/>
                        <div style={frontStyle}>
                            <LandingInputForm
                                focusFirst={this.state.first}
                                focusSecond={this.state.second}
                                firstInputValue={this.state.firstInputValue}
                                firstAutocompleteValues={this.state.autocompleteValues}
                                secondInputValue={this.state.secondInputValue} 
                                secondAutocompleteValues={this.state.autocompleteValues}
                                />
                        </div>
                  </div>}
                </Spring>
                
            </div>
        )
    }
}

export default withBreakpoints(Landing)

function randomNum(length) {
    return Math.ceil(Math.random() * length-1)
}



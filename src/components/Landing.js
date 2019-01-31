import React from 'react'
import { withBreakpoints } from 'react-breakpoints'

import LandingBackground from './uiComponents/LandingBackground'
import LandingInputForm from './uiComponents/LandingInputForm'


class Landing extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            firstInputValue: 'here',
            secondInputValue: 'there'
        }
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     return nextProps !== this.props
    // }

    componentDidMount() {
        fetch('./data/cities.json')
            .then(res => res.json())
            .then(data => {
                
                const allData = data.cities 
                const dataLength = allData.length
                

                this.interval = setInterval(() => {
                    //console.log(Object.keys(allData)[randomNum(dataLength)])

                    const val1 = allData[randomNum(dataLength-1)]
                    const val2 = allData[randomNum(dataLength-1)+1]

                    this.setState({
                        firstInputValue: val1,
                        secondInputValue: val2
                    }) 
    
                }, 3000);
            })
    }

    componentWillUnmount() {

        clearInterval(this.interval);
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


        const frontStyle = {
            position: 'absolute',
            top: dispTop,
            left: '50%',
            transform: 'translateX(-50%)',
            width: maxWidth,
        }

    
        return (
            <div >
                <LandingBackground />
                <img src="/clouds.jpeg" className='main-image' alt=''/>
                <div style={frontStyle}>
                    <LandingInputForm
                        firstInputValue={this.state.firstInputValue}
                        secondInputValue={this.state.secondInputValue} />
                </div>
            </div>
        )
    }
}

export default withBreakpoints(Landing)

function randomNum(length) {
    return Math.floor(Math.random() * length-1)
}




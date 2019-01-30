import React from 'react'
import { withBreakpoints } from 'react-breakpoints'

import LandingHeadingInput from './uiComponents/LandingHeadingInput'
import GoButton from './uiComponents/GoButton'
import LandingBackground from './uiComponents/LandingBackground'


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
            dispTop = '200px'
        } 
        if (breakpoints[currentBreakpoint] > breakpoints.tablet) {
            maxWidth = '600px'
            dispTop = '300px'
        } 
        if (breakpoints[currentBreakpoint] > breakpoints.desktopLarge) {
            maxWidth = '1040px'
        } 


        const frontStyle = {
            position: 'absolute',
            top: dispTop,
            left: '50%',
            transform: 'translateX(-50%)'
        }

        const headingStyle = {
            color: '#154463',
            fontWeight: '700',
            fontStyle: 'italic',  
            fontFamily: 'nimbus-sans-extended, sans-serif',
            width: maxWidth,
        }

        const inputStyle = {
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: '3px solid #19547B',
            color: '#19547B',
            width: '300px',
            fontWeight: '700',
            fontStyle: 'italic', 
            borderRadius: '5px'
        }

        const subStyle = {
            margin: '40px 0',
            color: '#154463',
            maxWidth: '500px'
        }

        return (
            <div >

                <LandingBackground />

                <img src="/clouds.jpeg" className='main-image' alt=''/>
                
                <div style={frontStyle}>
                    <h1 style={headingStyle}>
                        I'm flying from &nbsp;
                        <LandingHeadingInput val={this.state.firstInputValue} style={inputStyle}/>
                        &nbsp; to &nbsp;
                        <LandingHeadingInput val={this.state.secondInputValue} style={inputStyle}/>
                    </h1>

                    <h4 style={subStyle}>
                        Compare Airlines and departure dates. Everything you need to know about your flight.
                    </h4>

                    <GoButton>
                        Check my flight &rarr;
                    </GoButton>

                </div>
            </div>
        )
    }
}

export default withBreakpoints(Landing)

function randomNum(length) {
    return Math.floor(Math.random() * length-1)
}


import React from 'react'

import styles from './style/style'

const fps = 30
const duration = 15
const start = 120
const finish = 210

// easing function 
function easeInOutQuad(x, t, b, c, d) {

    if ((t /= d / 2) < 1) {
        return c / 2 * t * t + b;
    } else {
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    }
}

// functio to change the angle of the background gradient 
function changeAngle(position, time, sub) {

    time += 1 / fps;
    if (sub){
        position = finish - (easeInOutQuad(time * 100 / duration, time, start, finish, duration) - start)
    } else {
        position = (easeInOutQuad(time * 100 / duration, time, start, finish, duration))
    }
    if (position <= start && sub === true){
        time = 0
        sub = false
    }
    if (position >= finish && sub === false){
        time = 0
        sub = true
    } 
    return [position, time, sub]
}


class LandingBackground extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            position: start,
            time: 0,
            goingBackwards: false,
            height: '100vh'
        };
    }

    componentDidMount() {
        
        // set an interval to run at given FPS to animate gradient angle 
        this.interval = setInterval(() => {

            const revisedStateValues = changeAngle(this.state.position, this.state.time, this.state.goingBackwards)

            const height = Math.max(document.body.scrollHeight, 
                                  document.body.offsetHeight, 
                                  document.documentElement.clientHeight, 
                                  document.documentElement.scrollHeight, 
                                  document.documentElement.offsetHeight )
            const newHeight = height.toString() + 'px'
            this.setState({
                position: revisedStateValues[0], 
                time: revisedStateValues[1],
                goingBackwards: revisedStateValues[2],
                height: newHeight 
            }) 
    
        }, 1000 / fps);
    }

    componentWillUnmount() {

        clearInterval(this.interval);
    }

    render() {

        // set the background gradient according to the current state
        const backgroundStyle = 'linear-gradient(' + this.state.position + 'deg, ' + styles.timeOfDay1 + ' 0%, ' + styles.timeOfDay2 + ' 100%)'

        let landingStyles = Object.assign({}, styles.landingPageBackground)
        landingStyles.background = backgroundStyle
   
        if (this.props.opacity === 1) {
            landingStyles.opacity = 1
        }
        landingStyles.height = this.state.height 
        
        return (
            <div className='landing' style={landingStyles}></div>
        )
    }
}

export default LandingBackground


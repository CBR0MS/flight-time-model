import React from 'react'

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
            goingBackwards: false
        };
    }

    componentDidMount() {
        
        // set an interval to run at given FPS to animate gradient angle 
        this.interval = setInterval(() => {

            const revisedStateValues = changeAngle(this.state.position, this.state.time, this.state.goingBackwards)

            this.setState({
                position: revisedStateValues[0], 
                time: revisedStateValues[1],
                goingBackwards: revisedStateValues[2]
            }) 
    
        }, 1000 / fps);
    }

    componentWillUnmount() {

        clearInterval(this.interval);
    }

    render() {

        // set the background gradient according to the current state
        const backgroundStyle = 'linear-gradient(' + this.state.position + 'deg,rgba(25,84,123,1) 0%, rgba(255,232,195, 1) 100%)'

        const landingStyles = {
            background: backgroundStyle
        }

        return (
            <div className='landing' style={landingStyles}></div>
        )
    }
}

export default LandingBackground


import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Spring } from 'react-spring/renderprops'

import './App.scss';

import Navigation from './components/Navigation'
import Landing from './components/Landing'
import Predict from './components/Predict'
import About from './components/About'
import Check from './components/Check'
import Error from './components/Error'
import styles from './components/Style/style'

import LandingBackground from './components/UIComponents/Backgrounds/LandingBackground'
import LoadingScreen from './components/UIComponents/Backgrounds/LoadingScreen'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {loaded: false}
    this.showPage = this.showPage.bind(this)
  }

  showPage() {
    this.setState({loaded: true})
  }

  render() {

    let image = (
      <picture>
      <source type='image/webp' srcSet={styles.backgroundImageUrl + '.webp'}/>
      <img 
        src={styles.backgroundImageUrl + '.jpg'} 
        style={styles.landingImageStyle} 
        onLoad={this.showPage}
        alt='background'/>
        </picture>
    )
    
    if (!this.state.loaded) {
      return (
        <div>
          <div style={styles.defaultLanding}>
            <LoadingScreen>
              <span style={styles.loadingLogo}>
                FlyGenius
              </span>
            </LoadingScreen>
          </div>
          {image}
        </div>
      )
    }
    
    return (

      <Spring
        from={{ opacity: 0 }}
         to={{ opacity: 1 }}>
        {props => 
          <div style={props}>

            <BrowserRouter>
              <div>
                <LandingBackground />
                {image}
                <Navigation/>
                <Switch>
                  <Route path='/' component={Landing} exact />
                  <Route path='/predict' component={Predict} />
                  <Route path='/check' component={Check} />
                  <Route path='/about' component={About} />
                  <Route component={Error} />
                </Switch>
              </div>
            </BrowserRouter>
          
          </div>}
      </Spring>


      
    )
  }
}

export default App;

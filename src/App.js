import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.scss';

import Navigation from './components/Navigation'
import Landing from './components/Landing'
import Predict from './components/Predict'
import About from './components/About'
import Check from './components/Check'
import Error from './components/Error'
import styles from './components/uiComponents/style/style'
import LandingBackground from './components/uiComponents/LandingBackground'

class App extends React.Component {

  render() {

    let image = (<img src="/clouds.jpeg" style={styles.landingImageStyle} alt=''/>)
    if (styles.hour < 6 || styles.hour > 18){
      image = (<img src="/mountain.jpg" style={styles.landingImageStyle} alt=''/>)
    }

    return (
      <BrowserRouter>
        <div>
        <LandingBackground />
         {image}

        <Navigation />
          <Switch>
            <Route path='/' component={Landing} exact />
            <Route path='/predict' component={Predict} />
            <Route path='/check' component={Check} />
            <Route path='/about' component={About} />
            <Route component={Error} />
          </Switch>
        </div>

      </BrowserRouter>
    )

  }
}

export default App;

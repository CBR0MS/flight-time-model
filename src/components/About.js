import React from 'react'

import ContentWrapper from './uiComponents/ContentWrapper'
import { Spring } from 'react-spring/renderprops'
import styles from './uiComponents/style/style'
import GoButton from './uiComponents/GoButton'

class About extends React.Component {

    render() {

        return (

            <Spring
                from={{ opacity: 0 }}
                 to={{ opacity: 1 }}>
                {props => 
                  <div style={props}>

                  <ContentWrapper>
                    <div style={styles.aboutPageContent}>
                        <h2 style={styles.aboutMargins}>Making choosing a flight an easier process</h2>
                        <p style={styles.aboutMargins}>When choosing a flight, people usually focus on the price. 
                         However, as with anything, there's much more to a flight than just the price. Some airlines are more often delayed 
                         than others, and some will reach their destinations on-time or early the majority of the time. This is all important 
                         information for you to know before buying a ticket, but it's usually not easily available.</p>
                         <p style={styles.aboutMargins}>FlyGenius helps you choose a flight by filling in the missing details. Enter an origin and destination, 
                         and we'll provide a variety of statistics that help to reveal the best airline for the route. </p>
                            
                        <GoButton 
                            color={'transparent'}
                            outlined={true}
                            shadow={false}
                            interiorColor={styles.adaptiveToTimeOfDay}
                            link={`/check`} > 
                                <span>Check a flight now!</span>
                        </GoButton>

                         <h2 style={styles.aboutMargins}>How it works</h2>
                         <p style={styles.aboutMargins}>Behind the scenes, FlyGenius uses a dataset gathered by the Department of Transportation containing every U.S. domestic 
                         flight. We've analyzed the data and pulled out the important features, which are used in a machine learning model. 
                         The model provides predictions of flight departure and arrival windows, which helps us determine the best possible 
                         airline for any given route and date combination. </p>
                         <p style={styles.aboutMargins}>As part of this analysis, we've created a database of statistics associated with airlines, airports, and routes,
                         which is freely available for developers. Currently it contains entries for 
                         12 major airlines, 320 airports, and a total of 5,597 routes. Read more about it on 
                         <a href="https://api.flygeni.us/docs/"> the API documentation site</a>.</p>
                            

                    </div>
                    
                </ContentWrapper>

                  
                </div>}
              </Spring>


            
        )
    }
}

export default About
import React from 'react'

import ContainerPanel from './uiComponents/ContainerPanel'
import LandingBackground from './uiComponents/LandingBackground'


class Landing extends React.Component {


    render() {

        const containerStyle = {
            maxWidth: '700px',
            float: 'right',
            margin: '80px 40px'
        }

        return (
            <div style={{marginTop: '-80px'}}>
                <ContainerPanel style={containerStyle}>
                    <p>Hi</p>
                </ContainerPanel>

                <LandingBackground />
            </div>
        )
    }
}

export default Landing


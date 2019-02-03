const darkBlue = '#154463'
const lightBlue = '#19547B'
const orange = '#F49E4C'
const lightOrange = '#FFE8C3'
const adaptiveWhite = 'rgba(255, 255, 255, 0.7)'

const autocompleteStyle = {
      top: 'unset',
      left: 'unset',
      borderRadius: '3px',
      color: adaptiveWhite,
      background: lightBlue,
      position: 'fixed',
      overflow: 'auto',   
      maxHeight: '75%',
      fontSize: '1.3rem',
      minWidth: '300px',
      width: '300px'
}

const landingSubStyle = {
      margin: '40px 0',
      color: darkBlue,
      maxWidth: '500px'
}

const landingHeadingStyle = {
      lineHeight: '60px',
      color: '#154463',
      fontWeight: '700',
      fontStyle: 'italic',  
      fontFamily: 'nimbus-sans-extended',
}

const landingInputStyle = {
      backgroundColor: 'transparent',
      border: 'none',
      // borderBottom: '3px solid #19547B',
      marginRight: '10px',
      color: lightBlue,
      width: '300px',
      height: '50px',
      fontWeight: '700',
      fontStyle: 'italic', 
      borderRadius: '5px'
}

const hamburgerStyle = {
      width: '50px',
      height: '50px',
      position: 'absolute',
      right: '20px',
      zIndex: '1000',
      cursor: 'pointer',
      top: '40px'
}

const menuContents =  {
      position: 'absolute',
      top: '40%',
      left: '50%',
      transform: 'translateX(-50%) translateY(-50%)'
}

const menuBackground = {
      height: '100vh',
      width: '100vw',
      position: 'absolute',
      top: 0,
      left: 0,
      backgroundColor: lightBlue,
      zIndex: 20
}

const goButtonInterior = {
      margin: '0 auto',
      textAlign: 'center',
      color: darkBlue,
}     

const landingImageStyle = {
      width: '100vw',
      height: '100vh',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: -2,
      objectFit: 'cover',
      objectPosition: '0 100%',
}

const menuText = {
      fontFamily: 'nimbus-sans-extended',
      fontSize: '2rem',
      padding: '20px',
      width: '320px',
}

const goButton = {
      backgroundColor: orange,
      boxShadow: '3px 5px 20px rgba(0, 0, 0, 0.4)',
      borderRadius: '20px',
      height: '40px',
      maxWidth: '200px',
      padding: '10px',
      cursor: 'pointer',
}

const landingPageBackground = {
      position: 'absolute',
      top: 0,
      left: 0,
      background: 'linear-gradient(170deg, rgba(25,84,123,0.75) 0%, rgba(255,232,195, 0.75) 100%)',
      height: '100vh',
      width: '100vw',
      zIndex: -1,
}

const landingContainerStyle = {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
}

const styles = {
      // components' styles 
      autocompleteStyle: autocompleteStyle,
      landingInputStyle: landingInputStyle,
      landingHeadingStyle: landingHeadingStyle,
      landingSubStyle: landingSubStyle,
      hamburgerStyle: hamburgerStyle,
      menuContents: menuContents,
      menuBackground: menuBackground,
      menuText: menuText,
      goButtonInterior: goButtonInterior,
      goButton: goButton,
      landingImageStyle: landingImageStyle,
      landingPageBackground: landingPageBackground,
      landingContainerStyle: landingContainerStyle,

      // global colors 
      darkBlue: darkBlue,
      lightBlue: lightBlue,
      orange: orange,
      lightOrange: lightOrange,
      adaptiveWhite: adaptiveWhite,
      

}

export default styles 






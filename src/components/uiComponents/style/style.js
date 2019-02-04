const darkBlue = 'hsl(204, 65%, 24%)'
const lightBlue = 'hsl(204, 65%, 29%)'
const veryLightBlue = 'hsl(204, 65%, 32%)'
const orange = 'hsl(29, 88%, 63%)'
const lightOrange = 'hsl(29, 88%, 88%)'
const adaptiveWhite = 'rgba(255, 255, 255, 0.7)'
const shadow = '5px 7px 30px hsla(204, 65%, 15%, 0.6)'
const border = '10px'

const autocompleteStyle = {
      top: 'unset',
      left: 'unset',
      color: adaptiveWhite,
      background: lightBlue,
      position: 'fixed',
      overflow: 'auto',   
      maxHeight: '310px',
      fontSize: '1.3rem',
      minWidth: '300px',
      width: '300px',
      boxShadow: shadow,
      borderRadius: border,
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
      // borderBottom: '3px solid #19547B',
      width: '300px',
      height: '50px',
      fontWeight: '700',
      fontStyle: 'italic', 
      display: 'inline-block',
      marginRight: '10px'
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
      zIndex: 20,
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
      boxShadow: shadow,
      borderRadius: '20px',
      height: '40px',
      maxWidth: '200px',
      padding: '10px',
      cursor: 'pointer'
}

const landingPageBackground = {
      position: 'absolute',
      top: 0,
      left: 0,
      background: 'linear-gradient(170deg, rgb(25,84,123) 0%, rgb(255,232,195) 100%)',
      height: '100vh',
      width: '100vw',
      zIndex: -1,
      opacity: 0.75,
}

const landingContainerStyle = {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
}

const logoStyle = {
      fontSize: '40px',
      left: '20px',
      top: '10px',
      fontFamily: 'PanAm',
      position: 'absolute',
      zIndex: 100
}

const checkInputStyle = {
      // backgroundColor: darkBlue,
      // border: 'none',
      // // borderBottom: '3px solid #19547B',
      // marginRight: '10px',
      // color: lightBlue,
      // width: '300px',
      // height: '50px',
      // fontWeight: '700',
      // fontStyle: 'italic', 
      // borderRadius: border,
      // margin: '40px'
}

const checkInputBoxStyle = {
      display: 'inline-block',
      margin: '40px 10px'
}

const checkStyle = {
      width: '100%',
      maxWidth: '900px',
      minHeight: '600px',
      padding: '20px',
      margin: '0 auto',
      marginTop: '80px',
      backgroundColor: lightBlue,
      boxShadow: shadow,
      borderRadius: border,
      marginBottom: '50px'
}

const checkStyleOuter = {
      margin: '10px'
}

const panelWrapper = {
      margin: '0 auto',
      width: '100%',
      maxWidth: '680px'
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
      logoStyle: logoStyle,
      checkInputStyle: checkInputStyle,
      checkStyle: checkStyle,
      checkStyleOuter: checkStyleOuter,
      panelWrapper: panelWrapper,
      checkInputBoxStyle: checkInputBoxStyle,

      // global colors 
      darkBlue: darkBlue,
      lightBlue: lightBlue,
      orange: orange,
      lightOrange: lightOrange,
      adaptiveWhite: adaptiveWhite,
      veryLightBlue: veryLightBlue,
      

}

export default styles 






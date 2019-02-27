const veryDarkBlue = 'hsl(204, 65%, 18%)'
const darkBlue = 'hsl(204, 65%, 24%)'
const lightBlue = 'hsl(204, 65%, 29%)'
const veryLightBlue = 'hsl(204, 65%, 32%)'
const orange = 'hsl(29, 88%, 63%)'
const lightOrange = 'hsl(29, 88%, 83%)'
const white = 'rgba(255, 255, 255, 0.95)'
const adaptiveWhite = 'rgba(255, 255, 255, 0.7)'
const shadow = '5px 7px 30px hsla(204, 65%, 15%, 0.6)'
const border = '10px'


const interpolate = require('color-interpolate')
 
let bottomColorMap = interpolate(['#1a5175', '#5c7789', '#ffbf71', '#d5e6f2', '#f4faff', '#fff9ed', '#ffd2b2', '#708c9e', '#1a5175'])
let topColorMap = interpolate(['#001523', '#001523', '#054a77', '#054a77', '#054a77', '#054a77', '#023759', '#001523', '#001523' ])

let currentTime = new Date();
let hour = currentTime.getHours();
//let hour = 9
let shiftedTime = hour / 24

let timeOfDay2 = bottomColorMap(shiftedTime)
let timeOfDay1 = topColorMap(shiftedTime)

let adaptiveToTimeOfDay = darkBlue
if (hour < 6 || hour >= 18) {
      adaptiveToTimeOfDay = adaptiveWhite
}

const font = 'interstate'

const autocompleteStyle = {
      top: 'unset',
      left: 'unset',
      color: adaptiveWhite,
      background: veryLightBlue,
      position: 'absolute',
      overflowY: 'auto',
      overflowX: 'hidden',
      maxHeight: '250px',
      fontSize: '1.3rem',
      minWidth: '300px',
      width: '300px',
      boxShadow: shadow,
      borderRadius: border,
      zIndex: '200',
}

const landingSubStyle = {
      margin: '40px 0',
      color: adaptiveToTimeOfDay,
      maxWidth: '500px'
}

const landingHeadingStyle = {
      lineHeight: '60px',
      color: adaptiveToTimeOfDay,
      fontWeight: '800',
      fontStyle: 'italic',  
      fontFamily: font,
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

const interiorGradient = {
      
}

const navDummyStyle = {
      WebkitMaskImage: 'linear-gradient( rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 20px, rgba(0,0,0,1) 50px, rgba(0,0,0,1) 100%)',
      height: 'calc(100vh - 100px)',
      position: 'fixed',
      width: '100vw',
      bottom: 0,
      left: 0,
      overflow: 'auto'
}

const navWrapperStyle = {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: 100
}

const hamburgerStyle = {
      width: '50px',
      height: '50px',
      position: 'absolute',
      right: '20px',
      zIndex: '1000',
      cursor: 'pointer',
      top: '20px'
}

const menuContents =  {
      position: 'absolute',
      top: '50%',
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
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: -2,
      objectFit: 'cover',
      objectPosition: '0 100%',
}

const menuText = {
      fontFamily: font,
      fontSize: '2.5rem',
      padding: '20px',
      fontWeight: 700,
      fontStyle: 'italic',
      width: '320px',
}

const goButton = {
      boxShadow: shadow,
      borderRadius: '20px',
      height: '40px',
      maxWidth: '300px',
      padding: '7px 20px',
      cursor: 'pointer',
      marginTop: '60px',
      marginBottom: '40px',
      transition: 'all 0.3s linear',
      border: '2px solid transparent',
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
      top: '0px',
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
      height: '100%',
      minHeight: '600px',
      padding: '20px',
      margin: '0 auto',
      marginTop: '80px',
      backgroundColor: lightBlue,
      boxShadow: shadow,
      borderRadius: border,
      marginBottom: '50px',
      transition: 'all 0.3s linear',
}

const checkStyleOuter = {
      margin: '10px'
}

const panelWrapper = {
      margin: '0 auto',
      width: '100%',
      maxWidth: '680px',
      transition: 'all 0.3s linear'
}

const inputWrapperTitle = {
      // display: 'block',
      // width: '300px',
      marginBottom: '-35px',
      marginLeft: '15px',
      color: white,
}     

const inputWrapper = {
      width: '310px',
      display: 'inline-block',
      marginRight: '15px',
      marginTop: '15px',
      fontSize: '1.1rem',
}

const loading = {
      height: '64px',
      width: '64px',
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translateX(-50%) translateY(-50%)'
}

const airlineBar = {
      display: 'inline-block',
      width: '300px',
      height: 50,
      color: adaptiveWhite,
      backgroundColor: veryLightBlue,
      borderRadius: border,
      boxShadow: shadow,
      margin: '20px 10px',
      padding: '10px',
}

const alertBar = {
      display: 'inline-block',
      width: '300px',
      height: 80,
      color: darkBlue,
      backgroundColor: orange,
      borderRadius: border,
      boxShadow: shadow,
      margin: '20px 10px',
      padding: '10px',
}

const airlineDeleteButton = {
      float: 'right',
      fontSize: '1.8rem',
      cursor: 'pointer',
      marginTop: '-6px',
}

const airlinesSection = {
      display: 'inline-block',
      width: '350px',
      marginTop: '30px',
      float: 'right',
}
const airlineInputWrapper = {
      marginTop: '20px',
      display: 'inline-block',
}

const allAirlineContentWrapper = {
      overflow: 'auto',
}

const alertBox = {
      position: 'fixed',
      top: '0',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '320px',
      height: '100px',
      zIndex: 1000,
}

const sidebarWrapper = {

      margin: '0 20px',
      flex: '1 0 auto',
      minWidth: 200,
      //width: '95%',
     //maxWidth: 400,
}

const contentWrapper = {

      margin: '0 20px',
      flex: '9 0 auto',

}

const predictionWrapper = {
      maxWidth: 1900,
      //width: '90%',
      margin: '60px auto',
      display: 'flex',
      flexFlow: 'row wrap',
      justifyContent: 'center',

}

const accordionPanel = {
      backgroundColor: lightBlue,
      borderRadius: border,
      boxShadow: shadow,
      padding: 20,
      color: adaptiveWhite,
      cursor: 'pointer',
}

const inlineWrapper =  {
      display: 'inline-block',
      width: 140,
      margin: '20px 0px',
}

const inlineWrapperNoMargin = {
      fontFamily: 'interstate-mono',
       display: 'inline-block',
       color: white,
}

const flexTable = {
      display: 'flex',
      flexFlow: 'row wrap',
      justifyContent: 'space-around',
      margin: '0 auto',
      width: 320,
}

const styles = {
      // components' styles 
      autocompleteStyle: autocompleteStyle,
      landingInputStyle: landingInputStyle,
      landingHeadingStyle: landingHeadingStyle,
      landingSubStyle: landingSubStyle,
      navWrapperStyle: navWrapperStyle,
      interiorGradient: interiorGradient,
      navDummyStyle: navDummyStyle,
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
      inputWrapperTitle: inputWrapperTitle,
      inputWrapper: inputWrapper,
      loading: loading,
      airlineBar: airlineBar,
      airlineDeleteButton: airlineDeleteButton,
      airlinesSection: airlinesSection,
      airlineInputWrapper: airlineInputWrapper,
      allAirlineContentWrapper: allAirlineContentWrapper,
      alertBox: alertBox,
      alertBar: alertBar,
      sidebarWrapper: sidebarWrapper,
      contentWrapper: contentWrapper,
      accordionPanel: accordionPanel,
      predictionWrapper: predictionWrapper,
      inlineWrapper: inlineWrapper,
      inlineWrapperNoMargin: inlineWrapperNoMargin,
      flexTable: flexTable,


      // global colors 
      darkBlue: darkBlue,
      lightBlue: lightBlue,
      orange: orange,
      lightOrange: lightOrange,
      adaptiveWhite: adaptiveWhite,
      veryLightBlue: veryLightBlue,
      veryDarkBlue: veryDarkBlue,
      white: white,

      timeOfDay1: timeOfDay1,
      timeOfDay2: timeOfDay2,
      hour: hour,

}

export default styles 






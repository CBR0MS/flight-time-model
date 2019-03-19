import React from 'react'

import styles from './style/style'

const FlexTable = props => {
  return (
    <div style={styles.flexTable}>
    {props.children}
    </div>
  )
}
const NumberGroup = props => {
  return (
    <div style={styles.inlineWrapper}>
      <h1 style={styles.inlineWrapperNoMargin}>{props.title}</h1>
      {props.suffix !== undefined ? (<p style={styles.inlineWrapperNoMargin}>{props.suffix}</p>) : null}
      <p>{props.caption}</p>
    </div>
    )
}


const DataCollection = props => {
  return (
  <FlexTable>
    <NumberGroup
      title={props.topLeft}
      suffix={props.topLeftSuffix}
      caption={props.topLeftCaption}
    /> 
    <NumberGroup
      title={props.topRight}
      suffix={props.topRightSuffix}
      caption={props.topRightCaption}
    /> 
    <NumberGroup
      title={props.bottomLeft}
      suffix={props.bottomLeftSuffix}
      caption={props.bottomLeftCaption}
    />
    <NumberGroup
      title={props.bottomRight}
      suffix={props.bottomRightSuffix}
      caption={props.bottomRightCaption}
    />
  </FlexTable>
  )
}


export default DataCollection
import React from 'react'

import styles from '../../Style/style'

export const FlexTable = props => {
  return (
    <div style={styles.flexTable}>
    {props.children}
    </div>
  )
}

export const NumberGroup = props => {
  return (
    <div style={props.style !== undefined ? Object.assign(props.style, styles.inlineWrapper) : styles.inlineWrapper}>
      <div style={props.floatNum !== undefined ? {float: props.floatNum, display: 'inline-block'} : {}}>
        <h1 style={Object.assign({fontSize: '2.5rem'}, styles.inlineWrapperNoMargin)}>{props.title}</h1>
          {props.suffix !== undefined ? (<p style={styles.inlineWrapperNoMargin}>{props.suffix}</p>) : null}
      </div>
      <p>{props.caption}</p>
    </div>
  )
}


export const DataCollection = props => {
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
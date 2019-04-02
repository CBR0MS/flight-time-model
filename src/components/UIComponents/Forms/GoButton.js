import React from "react";
import styles from "../../Style/style";
import { Link } from "react-router-dom";

const GoButton = props => {
  const joinedStyles = Object.assign({}, styles.goButton);
  const joinedStylesInterior = Object.assign({}, styles.goButtonInterior);
  if (props.centered) {
    joinedStyles.marginLeft = "auto";
    joinedStyles.marginRight = "auto";
  } else {
    joinedStyles.display = "inline-block";
    joinedStyles.margin = "10px 30px 10px 0";
  }

  if (!props.shadow) {
    joinedStyles.boxShadow = "none";
  }

  if (props.outlined) {
    joinedStyles.border = "1px solid " + props.interiorColor;
  }
  joinedStyles.backgroundColor = props.color;
  joinedStylesInterior.color = props.interiorColor;

  if (props.link !== undefined) {
    return (
      <div style={joinedStyles} onClick={props.onClick}>
        <Link to={props.link}>
          <div style={joinedStylesInterior}>{props.children}</div>
        </Link>
      </div>
    );
  }
  return (
    <div style={joinedStyles} onClick={props.onClick}>
      <div style={joinedStylesInterior}>{props.children}</div>
    </div>
  );
};

export default GoButton;

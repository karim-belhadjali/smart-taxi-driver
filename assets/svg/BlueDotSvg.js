import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Svg, { Circle } from "react-native-svg";

const BlueDotSvg = ({ style }) => {
  return (
    <Svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <Circle
        cx="7.5"
        cy="7.5"
        r="4.81579"
        stroke="#431879"
        stroke-width="5.36842"
      />
    </Svg>
  );
};

export default BlueDotSvg;

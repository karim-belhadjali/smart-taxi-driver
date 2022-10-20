import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Svg, { Path, Circle, Line } from "react-native-svg";

export default function DestinationSvgBig() {
  return (
    <Svg
      width="35"
      height="70"
      viewBox="0 0 15 59"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Circle
        cx="7.5"
        cy="7.5"
        r="4.81579"
        stroke="#431879"
        stroke-width="5.36842"
      />
      <Path
        d="M7.00006 44C3.69181 44 1.00006 46.6917 1.00006 49.9962C0.978311 54.83 6.77206 58.838 7.00006 59C7.00006 59 13.0218 54.83 13.0001 50C13.0001 46.6918 10.3083 44 7.00006 44ZM7.00006 53C5.34256 53 4.00006 51.6575 4.00006 50C4.00006 48.3425 5.34256 47 7.00006 47C8.65756 47 10.0001 48.3425 10.0001 50C10.0001 51.6575 8.65756 53 7.00006 53Z"
        fill="#F74C00"
      />
      <Line x1="7.5" y1="15" x2="7.5" y2="44" stroke="#4F4F4F" />
    </Svg>
  );
}

const styles = StyleSheet.create({});

import { StyleSheet } from "react-native";
import React from "react";
import Svg, { Path } from "react-native-svg";
import tw from "twrnc";

const StarSvg = ({ style }) => {
  return (
    <Svg
      width="15"
      height="14"
      viewBox="0 0 15 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <Path
        d="M7.5 0L9.18386 5.18237H14.6329L10.2245 8.38525L11.9084 13.5676L7.5 10.3647L3.09161 13.5676L4.77547 8.38525L0.367076 5.18237H5.81614L7.5 0Z"
        fill="#FAC100"
      />
    </Svg>
  );
};

export default StarSvg;

const styles = StyleSheet.create({});

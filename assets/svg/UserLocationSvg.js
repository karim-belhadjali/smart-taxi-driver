import { StyleSheet, Text, View } from "react-native";
import React from "react";

import Svg, { Path, Ellipse, G } from "react-native-svg";

const UserLocationSvg = () => {
  return (
    <Svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M6.5 0C2.9161 0 6.36752e-05 2.91606 6.36752e-05 6.49594C-0.00978995 8.68584 1.12535 10.2691 2.44955 11.37C4.76893 13.2984 8.23098 13.2984 10.5508 11.3706C11.8748 10.2702 13.0098 8.68803 12.9999 6.5C12.9999 2.91606 10.0839 0 6.5 0ZM6.5 9.75C4.70439 9.75 3.25003 8.29563 3.25003 6.5C3.25003 4.70437 4.70439 3.25 6.5 3.25C8.29561 3.25 9.74997 4.70437 9.74997 6.5C9.74997 8.29563 8.29561 9.75 6.5 9.75Z"
        fill="#431879"
      />
    </Svg>
  );
};

export default UserLocationSvg;

const styles = StyleSheet.create({});

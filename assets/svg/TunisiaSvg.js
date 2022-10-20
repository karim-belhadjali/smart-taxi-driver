import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Svg, { Path, Ellipse, G, Defs, ClipPath, Rect } from "react-native-svg";

const TunisiaSvg = ({ style }) => {
  return (
    <Svg
      width="25"
      height="19"
      viewBox="0 0 25 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <G clip-path="url(#clip0_1_90)">
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M-1.5625 0H26.5625V19H-1.5625V0Z"
          fill="#E70013"
        />
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M17.2534 9.49257C17.2534 10.7632 16.7553 11.9817 15.8687 12.8802C14.9821 13.7786 13.7795 14.2834 12.5256 14.2834C11.2717 14.2834 10.0692 13.7786 9.18259 12.8802C8.29596 11.9817 7.79785 10.7632 7.79785 9.49257C7.79785 8.22197 8.29596 7.0034 9.18259 6.10495C10.0692 5.2065 11.2717 4.70175 12.5256 4.70175C13.7795 4.70175 14.9821 5.2065 15.8687 6.10495C16.7553 7.0034 17.2534 8.22197 17.2534 9.49257Z"
          fill="white"
        />
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M12.5256 12.6692C11.7123 12.641 10.9416 12.2938 10.376 11.7008C9.8105 11.1078 9.49438 10.3154 9.49438 9.49073C9.49438 8.66608 9.8105 7.87367 10.376 7.28068C10.9416 6.68769 11.7123 6.34048 12.5256 6.31232C12.9578 6.31232 13.4521 6.41622 13.7854 6.66486C11.4929 6.75021 10.9106 8.72443 10.9106 9.51857C10.9106 10.3127 11.2805 12.0828 13.7854 12.3463C13.4997 12.5318 12.9578 12.6692 12.5256 12.6692Z"
          fill="#E70013"
        />
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M15.2869 10.8285L13.8623 10.3016L12.9211 11.5039L12.9761 9.97129L11.5552 9.4332L13.0127 9.01016L13.075 7.47754L13.9246 8.75039L15.3821 8.34219L14.4482 9.54824L15.2869 10.8285Z"
          fill="#E70013"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_1_90">
          <Rect width="25" height="19" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default TunisiaSvg;

const styles = StyleSheet.create({});

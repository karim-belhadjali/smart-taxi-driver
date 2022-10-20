import { StyleSheet, TextInput, View } from "react-native";
import React, { useState } from "react";
import tw from "twrnc";

import AntDesign from "react-native-vector-icons/AntDesign";

const TextInputs = ({ placeHolder, value, onChangeText, iconName, style }) => {
  const [borderColor, setborderColor] = useState("#431879");
  return (
    <View
      style={[
        tw`flex flex-row w-full`,
        styles.container,
        tw`border-[0.35]`,
        { borderColor: borderColor },
        style,
      ]}
    >
      {iconName && (
        <AntDesign
          style={tw`pt-1 pr-3`}
          name={iconName}
          size={20}
          color={"#431879"}
        />
      )}
      <TextInput
        placeholder={placeHolder}
        value={value}
        onChangeText={(text) => onChangeText(text)}
        style={tw`flex-1`}
        onFocus={() => {
          setborderColor("#FAC100");
        }}
        onBlur={() => setborderColor("#431879")}
      />
    </View>
  );
};

export default TextInputs;

const styles = StyleSheet.create({
  icon: {},
  container: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 5,
  },
});

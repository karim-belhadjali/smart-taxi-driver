import { StyleSheet, TextInput, View } from "react-native";
import React, { useState } from "react";
import tw from "twrnc";

import AntDesign from "react-native-vector-icons/AntDesign";

const Input = ({ placeHolder, value, onChangeText }) => {
  const [borderColor, setborderColor] = useState("#979797");
  return (
    <View
      style={[
        tw`flex flex-row w-50% mt-5 border`,
        styles.container,

        { borderColor: borderColor },
      ]}
    >
      <TextInput
        placeholder={placeHolder}
        value={value}
        onChangeText={(text) => onChangeText(text)}
        style={tw`flex-1`}
        onFocus={() => {
          setborderColor("#F74C00");
        }}
        onBlur={() => setborderColor("")}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  icon: {},
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
});

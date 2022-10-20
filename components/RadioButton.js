import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { RadioButton } from "react-native-paper";
import tw from "twrnc";

const RadioButtons = ({ title, value, onSelect, state, disabled }) => {
  return (
    <View style={tw`flex flex-row`}>
      <RadioButton
        value={value}
        status={state === value ? "checked" : "unchecked"}
        disabled={disabled}
        onPress={() => {
          onSelect(value);
        }}
        color="#431879"
      />
      <Text
        style={[
          tw`mt-2 text-[#431879] ${
            state === value ? "text-[#431879]" : "text-[#000000]"
          } ${state === value ? "opacity-100" : "opacity-40"}`,
        ]}
      >
        {title}
      </Text>
    </View>
  );
};

export default RadioButtons;

const styles = StyleSheet.create({});

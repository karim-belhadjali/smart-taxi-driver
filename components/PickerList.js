import { StyleSheet, Text, View } from "react-native";
import React from "react";
import tw from "twrnc";

import { Picker } from "@react-native-picker/picker";
const PickerList = ({ title, selectedValue, setSelectedLanguage, items }) => {
  return (
    <View style={tw`flex items-start w-[80%] my-2`}>
      {title && <Text style={[tw`mx-1`, styles.text]}>{title}</Text>}
      <View
        style={tw`border border-[#979797] w-[100%] rounded-lg px-2 text-[#979797]`}
      >
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue, itemIndex) => {
            setSelectedLanguage(itemValue);
          }}
        >
          {items.map((value) => {
            return <Picker.Item key={value} label={value} value={value} />;
          })}
        </Picker>
      </View>
    </View>
  );
};

export default PickerList;

const styles = StyleSheet.create({
  text: {
    fontFamily: "Poppins-Light",
    lineHeight: 21,
  },
});

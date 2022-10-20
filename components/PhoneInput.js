import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native";
import tw from "twrnc";

const PhoneInput = ({ handlePhonenumber, style, placeholder }) => {
  const [phonebordercolor, setphonebordercolor] = useState("#431879");

  return (
    <View
      style={[
        tw`border-[0.35] bg-white w-full mt-2  p-3 border-[${phonebordercolor}] flex-row justify-between rounded-md `,
        styles.phoneContainer,
        style,
      ]}
    >
      <View style={tw`flex-row`}>
        <Text style={styles.number}>+216</Text>
      </View>
      <View
        style={[tw`h-full border-[0.15] mx-3 `, { backgroundColor: "#431879" }]}
      />
      <TextInput
        style={[tw`mr-12 w-full h-full`, styles.numbers]}
        placeholder={placeholder}
        numberOfLines={1}
        autoCompleteType="tel"
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        onChangeText={(phoneNumber) => handlePhonenumber(phoneNumber)}
        onFocus={() => setphonebordercolor("#FAC100")}
        onBlur={() => {
          setphonebordercolor("#431879");
        }}
      />
    </View>
  );
};

export default PhoneInput;

const styles = StyleSheet.create({
  title: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 28,
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 15,
  },
  subSubtitle: {
    fontFamily: "Poppins-Light",
    fontSize: 15,
  },
  subtitleNumber: {
    fontFamily: "Poppins-Bold",
    fontSize: 15,
  },
  number: {
    fontFamily: "Poppins-Light",
    marginLeft: 3,
    fontSize: 16,
  },
  numbers: {
    fontFamily: "Poppins-Light",
    fontSize: 16,
  },
  phoneContainer: {
    marginLeft: 20,
    marginRight: 20,
  },
  btn: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#fff",
  },
});

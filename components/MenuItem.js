import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import tw from "twrnc";
import AntDesign from "react-native-vector-icons/AntDesign";

const MenuItem = ({ iconName, text, onClick }) => {
  return (
    <TouchableOpacity style={tw`flex flex-row w-full my-5`} onPress={onClick}>
      <AntDesign style={tw`mx-5`} name={iconName} size={30} color={"#455154"} />
      <Text style={[tw``, { fontFamily: "Poppins-Regular", fontSize: 18 }]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default MenuItem;

const styles = StyleSheet.create({});

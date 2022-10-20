import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import tw from "twrnc";

const NextBtn = ({ text, onClick }) => {
  return (
    <TouchableOpacity
      style={tw`absolute bottom-3 rounded-full bg-[#431879] w-[80]  p-4 flex justify-center items-center`}
      onPress={onClick}
    >
      <Text style={styles.btn}>{text}</Text>
    </TouchableOpacity>
  );
};

export default NextBtn;

const styles = StyleSheet.create({
  btn: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#fff",
  },
});

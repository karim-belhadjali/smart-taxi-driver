import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";

import AntDesign from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/core";

import tw from "twrnc";
import AboutItem from "../components/AboutItem";

const AboutScreen = () => {
  const navigation = useNavigation();
  const [currentScreen, setcurrentScreen] = useState("main");
  const handleReturn = () => {
    if (currentScreen === "main") {
      navigation.navigate("RequestsScreen");
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "RequestsScreen",
          },
        ],
      });
    }
  };
  return (
    <View style={tw`flex w-screen h-screen bg-white`}>
      <View style={tw`flex items-start ml-5 mt-5`}>
        <Text style={[tw``, { fontFamily: "Poppins-Bold", fontSize: 20 }]}>
          À propos
        </Text>
        <Text
          style={[
            tw`opacity-60`,
            { fontFamily: "Poppins-Light", fontSize: 15 },
          ]}
        >
          Version 1.0
        </Text>
      </View>
      <View style={tw`bg-[#000000] opacity-10 h-[.45] mt-5 w-screen`} />

      <AboutItem
        key={"Rate App"}
        style={tw`my-5`}
        fontStyle={{ fontFamily: "Poppins-Light", fontSize: 18, opacity: 0.4 }}
        iconStyle={{ opacity: 0.4 }}
        text="Rate App"
      />
      <View style={tw`bg-[#000000] opacity-10 h-[.45]  w-screen`} />
      <AboutItem
        key={"Smart Careers"}
        style={tw`my-5`}
        fontStyle={{ fontFamily: "Poppins-Light", fontSize: 18, opacity: 0.4 }}
        iconStyle={{ opacity: 0.4 }}
        text="Smart Careers"
      />
      <View style={tw`bg-[#000000] opacity-10 h-[.45] w-screen`} />

      <AboutItem
        key={"Terms and conditions"}
        style={tw`my-5`}
        fontStyle={{ fontFamily: "Poppins-Light", fontSize: 18 }}
        iconStyle={{ opacity: 1 }}
        text="Terms and conditions"
      />
      <View style={tw`bg-[#000000] opacity-10 h-[.45]  w-screen`} />
    </View>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({});

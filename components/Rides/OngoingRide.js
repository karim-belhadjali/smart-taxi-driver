import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import tw from "twrnc";
import SmallCarSvg from "../../assets/svg/SmallCarSvg";
import StarSvg from "../../assets/svg/StarSvg";
import EvilIcons from "react-native-vector-icons/EvilIcons";

import DestinationSvg from "../../assets/svg/destinationSvg";

const OngoingRide = ({ price, origin, destination, handleFinish }) => {
  return (
    <View
      style={[
        tw`bg-[#FFFFFF] absolute bottom-0 w-screen h-[40%] rounded-t-2xl p-4 flex items-center`,
        {
          shadowRadius: 100,
          shadowOpacity: 0.8,
          shadowColor: "#171717",
          shadowOffset: {
            width: -11,
            height: -50,
          },
          elevation: 50,
        },
      ]}
    >
      <View
        style={tw`w-screen flex flex-row justify-between items-center px-7`}
      >
        <SmallCarSvg />
        <View>
          <Text style={[tw``, { fontFamily: "Poppins-Bold", fontSize: 20 }]}>
            {price} TND
          </Text>
          <Text
            style={[tw`pb-2`, { fontFamily: "Poppins-Light", fontSize: 10 }]}
          >
            À payer dès l'arrivée
          </Text>
        </View>
      </View>

      <View
        key={"separator"}
        style={tw`bg-[#000000] opacity-10 h-[.45] mt-1 w-screen`}
      />
      <View key={"details"} style={tw`mt-5 w-[90%] h-[50%] flex  items-start`}>
        <View style={tw`flex-row mb-5`}>
          <EvilIcons
            name="clock"
            size={20}
            color="#66CFC7"
            style={tw`mt-[3] mr-3`}
          />

          <Text
            style={[
              tw``,
              { fontFamily: "Poppins-SemiBold", fontSize: 14, opacity: 0.7 },
            ]}
          >
            Vers le client
          </Text>
        </View>

        <View key={"road"} style={tw`flex flex-row`}>
          <View style={tw` mr-5`}>
            <DestinationSvg />
          </View>
          <View style={tw`flex `}>
            <Text
              style={[
                tw`mb-4`,
                { fontFamily: "Poppins-Regular", fontSize: 14 },
              ]}
              numberOfLines={1}
            >
              {origin}
            </Text>
            <Text
              style={[
                tw`mb-2`,
                { fontFamily: "Poppins-Regular", fontSize: 14 },
              ]}
              numberOfLines={1}
            >
              {destination}
            </Text>
          </View>
        </View>
      </View>
      <View style={tw`absolute bottom-3 flex justify-center items-center`}>
        <TouchableOpacity
          style={tw` rounded-full  w-[80] bg-[#431879] h-12   flex justify-center items-center`}
          onPress={handleFinish}
        >
          <Text style={styles.btnC}>Fin de la course</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OngoingRide;

const styles = StyleSheet.create({
  btnAnnuler: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#431879",
  },
  btn: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 10,
    color: "#000000",
    opacity: 0.8,
  },
  txt: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 10,
    color: "#F74C00",
    opacity: 0.8,
    marginBottom: 3,
  },
  btnC: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "#fff",
  },
});

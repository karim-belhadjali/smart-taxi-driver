import { StyleSheet, Text, View } from "react-native";
import React from "react";
import tw from "twrnc";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { TouchableOpacity } from "react-native";
import DestinationSvg from "../../assets/svg/destinationSvg";
import * as Linking from "expo-linking";

const ToClient = ({ price, origin, destination, phone, handleStart }) => {
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
      <View style={tw`flex flex-row justify-between items-center  w-full`}>
        <TouchableOpacity
          style={tw`rounded-full bg-[#FFFFFF] border-[#66CFC7] border w-[40] h-10  flex flex-row justify-center items-center`}
          onPress={() => {
            if (phone) {
              Linking.openURL(`tel: ${phone}`);
            }
          }}
        >
          <FontAwesome name="phone" size={20} color="#66CFC7" />
          <Text style={[tw`ml-2`, styles.btn]}>Appel Client</Text>
        </TouchableOpacity>
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
        <Text style={styles.txt}>
          Veillez lancer la course dès l’arrivée au client !
        </Text>
        <TouchableOpacity
          style={tw` rounded-full  w-[80] bg-[#431879] h-12   flex justify-center items-center`}
          onPress={handleStart}
        >
          <Text style={styles.btnC}>Commencer la course</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ToClient;

const styles = StyleSheet.create({
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

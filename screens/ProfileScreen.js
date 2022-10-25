import { StyleSheet, Text, View } from "react-native";
import React from "react";
import tw from "twrnc";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";

import { selectCurrentUser } from "../app/slices/navigationSlice";
import { useSelector } from "react-redux";

const ProfileScreen = () => {
  const user = useSelector(selectCurrentUser);
  return (
    <View style={tw`bg-[#FFFFFF]  w-screen h-screen flex items-center px-5`}>
      <View style={tw`w-[90%] flex flex-row mt-5 items-center`}>
        <View
          style={tw`bg-[#979797] rounded-full w-12 h-12 flex justify-center items-center`}
        >
          <AntDesign style={tw``} name={"user"} size={25} color={"#ffff"} />
        </View>
        <View style={tw`flex `}>
          <Text
            style={[
              tw`mt-3 mx-3`,
              { fontFamily: "Poppins-Bold", fontSize: 20 },
            ]}
            numberOfLines={1}
          >
            {user?.fullName}
          </Text>

          <Text
            style={[
              tw` mx-3`,
              {
                fontFamily: "Poppins-SemiBold",
                fontSize: 14,
                opacity: 0.8,
                color: "#979797",
              },
            ]}
          >
            {user?.status}
          </Text>
        </View>
      </View>
      <View style={tw`bg-[#000000] opacity-10 h-[.45] w-full mt-5`} />

      {user?.email && (
        <View style={tw`flex flex-row w-[80%] mt-5 `}>
          <Entypo name={"email"} size={25} color={"#455154"} />
          <Text style={[tw`mt-[1] ml-5`, { fontFamily: "Poppins-SemiBold" }]}>
            {user?.email}
          </Text>
        </View>
      )}
      {user?.mainPhone && (
        <View style={tw`flex flex-row w-[80%] mt-5 `}>
          <AntDesign style={tw``} name={"phone"} size={25} color={"#455154"} />
          <View>
            <Text style={[tw`mt-[1] ml-5`, { fontFamily: "Poppins-SemiBold" }]}>
              (+216) {user?.mainPhone}
            </Text>
            {user?.secondPhone !== "" && (
              <Text
                style={[tw`mt-[1] ml-5`, { fontFamily: "Poppins-SemiBold" }]}
              >
                (+216) {user?.secondPhone}
              </Text>
            )}
          </View>
        </View>
      )}
      {user?.ville && user?.gouvernorat && (
        <View style={tw`flex flex-row w-[80%] mt-5 `}>
          <Entypo name={"location"} size={25} color={"#455154"} />
          <Text style={[tw`mt-[4] ml-5`, { fontFamily: "Poppins-SemiBold" }]}>
            {user?.ville}, {user?.gouvernorat}
          </Text>
        </View>
      )}
      {user?.matricule && (
        <View style={tw`flex flex-row w-[80%] mt-5 `}>
          <AntDesign style={tw``} name={"car"} size={25} color={"#455154"} />

          <Text style={[tw`mt-[1] ml-5`, { fontFamily: "Poppins-SemiBold" }]}>
            {user?.matricule}
          </Text>
        </View>
      )}
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});

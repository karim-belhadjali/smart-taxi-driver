import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FinalCarSvg from "../assets/svg/FinalCarSvg";
import tw from "twrnc";

import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, setResting } from "../app/slices/navigationSlice";
import { useNavigation } from "@react-navigation/core";
import WaitingCar from "../assets/svg/WaitingCar";

const WaitingScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const currentDrive = useSelector(selectCurrentUser);

  useEffect(() => {
    dispatch(setResting(true));
  }, []);

  return (
    <View
      style={tw`w-screen h-screen flex pt-[120] justify-center items-center `}
    >
      <View style={[tw`rounded-full`, styles.ellipse1]} />
      <View style={[tw`rounded-full`, styles.ellipse2]} />

      <WaitingCar />
      <TouchableOpacity
        style={tw`rounded-full bg-[#431879] w-[80] border-[#431879] border-2 p-4 flex justify-center items-center mt-30`}
        onPress={() => {
          navigation.navigate("RequestsScreen");
          navigation.reset({
            index: 0,
            routes: [
              {
                name: "RequestsScreen",
              },
            ],
          });
        }}
      >
        <Text style={styles.btn}>Commencer</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WaitingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  ellipse2: {
    position: "absolute",
    left: 130,
    top: -190,
    backgroundColor: "#431879",
    width: 283,
    height: 283,
  },
  ellipse1: {
    position: "absolute",
    left: -40,
    top: -180,
    backgroundColor: "#FAC100",
    opacity: 0.9,
    width: 283,
    height: 283,
  },
  flesh: {
    position: "absolute",
    left: 29,
    top: 40,
    width: 30,
    height: "auto",
    zIndex: 100,
  },
  btn: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#fff",
  },
});

import React, { useState, useEffect } from "react";
import {
  Platform,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Button,
  Dimensions,
  Image,
  StatusBar,
} from "react-native";

import * as Location from "expo-location";
import * as Network from "expo-network";
import * as SplashScreen from "expo-splash-screen";
import { GOOGLE_MAPS_API_KEY } from "@env";

import {
  selectCurrentLocation,
  setCurrentLocation,
  setCurrentUser,
} from "../app/slices/navigationSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import { useFonts } from "expo-font";
import LogoSvg from "../assets/svg/LogoSvg";
import Loader from "react-native-three-dots";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export default function App() {
  const navigation = useNavigation();

  const [reload, setreload] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const dispatch = useDispatch();
  useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins/Poppins-Black.ttf"),
    "Poppins-Italic": require("../assets/fonts/Poppins/Poppins-Italic.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins/Poppins-Medium.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins/Poppins-Light.ttf"),
  });

  useEffect(() => {
    (async () => {
      let { isConnected, isInternetReachable } =
        await Network.getNetworkStateAsync();
      if (isConnected && isInternetReachable) {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Autorisation de localisation",
            "Cette application doit avoir accès à votre emplacement pour fonctionner, si le problème persiste, autorisez-le manuellement dans les paramètres",
            [
              {
                text: "Réessayer",
                onPress: () => {
                  setreload(!reload);
                },
              },
            ]
          );
          return;
        }

        await Location.getCurrentPositionAsync({})
          .then(async (location) => {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.coords.latitude},${location.coords.longitude}&key=${GOOGLE_MAPS_API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();
            dispatch(
              setCurrentLocation({
                location: {
                  lat: location.coords.latitude,
                  lng: location.coords.longitude,
                },
                description: data.results[0]?.formatted_address,
              })
            );
            setErrorMsg(null);
            await getUser("Driver");
          })
          .catch((e) => {
            setErrorMsg(e.message);
          });
      } else {
        setErrorMsg("No Internet Connection is detected please try again");
        Alert.alert(
          "Connexion Internet non détectée",
          "Aucune connexion Internet n'est détectée, veuillez réessayer",
          [
            {
              text: "Réessayer",
              onPress: () => {
                setreload(!reload);
              },
            },
          ]
        );
      }
    })();
  }, [reload]);

  const getUser = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        let driver = JSON.parse(value);
        dispatch(setCurrentUser(driver));
        navigation.navigate("WaitingScreen");
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "WaitingScreen",
            },
          ],
        });
      } else {
        navigation.navigate("LoginScreen");
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "LoginScreen",
            },
          ],
        });
      }
    } catch (e) {
      // error reading value
      console.log(e.message);
    }
  };

  return (
    <View style={stylesheet.styleRectangle1}>
      <View
        style={tw`flex justify-center items-center overflow-visible h-full`}
      >
        <LogoSvg style={tw`mb-10`} />
        <Loader color="#431879" />
      </View>
    </View>
  );
}

const stylesheet = StyleSheet.create({
  styleRectangle1: {
    position: "absolute",
    left: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height + StatusBar.currentHeight,
    backgroundColor: "#FAC100",
  },
});

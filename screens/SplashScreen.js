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
  setCurrentLocation,
  setCurrentUser,
  setVersion,
} from "../app/slices/navigationSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import { useFonts } from "expo-font";
import LogoSvg from "../assets/svg/LogoSvg";
import Loader from "react-native-three-dots";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import AppLink from "react-native-app-link";
import { registerForPushNotificationsAsync } from "../notifications";

export default function App() {
  const navigation = useNavigation();
  useNavigation();

  const [reload, setreload] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const dispatch = useDispatch();

  const version = "1.1.0";

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
        console.log("before location");

        await Location.getCurrentPositionAsync({})
          .then(async (location) => {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.coords.latitude},${location.coords.longitude}&key=${GOOGLE_MAPS_API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();

            const distance = await getTravelTime(
              location.coords.latitude,
              location.coords.longitude
            );
            console.log("location");
            if (
              distance?.status !== "NOT_FOUND" &&
              distance?.status !== "ZERO_RESULTS"
            ) {
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
              await getVersion();
            } else {
              Alert.alert(
                "Changer votre position",
                "Veuillez changer votre position, nous n'avons pas pu obtenir vos informations actuelles",
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
          })
          .catch((e) => {
            console.log(e.message);

            Alert.alert(
              "Connexion Internet faible",
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

  const getTravelTime = async (destinationlat, destinationlng) => {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${
      36.7389 + "," + 10.2848
    }&destinations=${
      destinationlat + "," + destinationlng
    }&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.rows[0].elements[0];
  };
  const getUser = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        let driver = JSON.parse(value);
        const docRef = doc(db, "drivers", driver.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          let driverDb = docSnap.data();
          dispatch(setCurrentUser(driverDb));
          navigation.navigate("WaitingScreen");
          navigation.reset({
            index: 0,
            routes: [
              {
                name: "WaitingScreen",
              },
            ],
          });
        }
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

  const getVersion = async () => {
    const docRef = doc(db, "versions", "driver");
    const docSnap = await getDoc(docRef);
    if (docSnap?.exists()) {
      if (docSnap.data().name === version) {
        dispatch(setVersion(version));
        await getUser("Driver");
      } else {
        Alert.alert(
          "Nouvelle mise à jour détectée",
          "Nouvelle mise à jour détectée, veuillez mettre à jour l'application vers la dernière version",
          [
            {
              text: "Mettre à jour",
              onPress: () => {
                AppLink.openInStore({
                  appName: "Beem Smart Driver",
                  playStoreId: "com.beem.smartdriver",
                });
              },
            },
            {
              text: "Réessayer",
              onPress: () => {
                setreload(!reload);
              },
            },
          ]
        );
      }
    } else {
      await getUser("Driver");
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

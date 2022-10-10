import React, { useState, useEffect } from "react";
import {
  Platform,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Button,
} from "react-native";

import * as Location from "expo-location";
import * as Network from "expo-network";

import {
  selectCurrentLocation,
  setCurrentLocation,
} from "../app/slices/navigationSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
// import { GOOGLE_MAPS_API_KEY } from "@env";
const GOOGLE_MAPS_API_KEY = "AIzaSyCZ_g1IKyfqx-UNjhGKnIbZKPF9rAzVJwg";

export default function SplashScreen() {
  const navigation = useNavigation();

  const [reload, setreload] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const dispatch = useDispatch();
  const currentLocation = useSelector(selectCurrentLocation);

  useEffect(() => {
    (async () => {
      let { isConnected, isInternetReachable } =
        await Network.getNetworkStateAsync();
      if (isConnected && isInternetReachable) {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
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
                description: data?.results[0]?.formatted_address,
              })
            );
            setErrorMsg(null);
            navigation.navigate("LoginScreen");
          })
          .catch((e) => {
            setErrorMsg(e.message);
          });
      } else {
        setErrorMsg("No Internet Connection is detected please try again");
      }
    })();
  }, [reload]);

  const handleTryAgain = () => {
    setreload(!reload);
  };
  return (
    <SafeAreaView style={{ height: "100%", paddingTop: 50 }}>
      {!errorMsg && <Text>{JSON.stringify(currentLocation)}</Text>}
      {errorMsg && (
        <>
          <Text>{errorMsg}</Text>
          <Button title="Try Again" onPress={handleTryAgain} />
        </>
      )}
      <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
        <Button title="check internet" onPress={handleTryAgain} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});

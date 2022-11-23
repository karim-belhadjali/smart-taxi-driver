import React, { useState, useEffect } from "react";

import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";

import { Provider } from "react-redux";
import { store } from "./app/store";
import { useDeviceContext } from "twrnc";
import { StatusBar } from "expo-status-bar";

import tw from "twrnc";

import * as Location from "expo-location";
import Navigations from "./components/Navigations";
import { useKeepAwake } from "expo-keep-awake";
import * as Notifications from "expo-notifications";

export default function App() {
  useDeviceContext(tw);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  useKeepAwake();
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  return (
    <>
      <Provider store={store}>
        <NavigationContainer>
          <SafeAreaProvider>
            <Navigations />
          </SafeAreaProvider>
        </NavigationContainer>
      </Provider>
      <StatusBar style="dark" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

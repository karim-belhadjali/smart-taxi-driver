import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";

const LOCATION_TASK_NAME = "background-location-task";
TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (data) {
    const { locations } = data;
    // do something with the locations captured in the background
    console.log("Updating Location", locations);
  }
});

const updateLocation = async (lang_chauffeur, lat_chauffeur) => {
  const userID = 922;
  console.log("Updating Location", lang_chauffeur, lat_chauffeur);
};

export default function TestsScreen() {
  const startLocation = async () => {
    // await Location.requestForegroundPermissionsAsync();
    // await Location.requestBackgroundPermissionsAsync();
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 15000,
      distanceInterval: 1,
      foregroundService: {
        notificationTitle: "En ligne ... ",
        notificationBody: "Mise à jour de votre position en cours ...",
      },

      showsBackgroundLocationIndicator: true,
    });
    //navigation.navigate("LoginScreen");
  };
  const stopLocation = async () => {
    Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME).then(
      (value) => {
        if (value) {
          Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <Button
        title="Start Location Updates"
        onPress={async () => {
          await startLocation();
        }}
      ></Button>
      <Button
        title="stop Location Updates"
        onPress={async () => {
          await stopLocation();
        }}
      ></Button>

      <Text>Open up App.js to start working on your app!</Text>

      <StatusBar style="auto" />
    </View>
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

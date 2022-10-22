import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TestsScreen from "../screens/TestsScreen";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import RegisterScreen from "../screens/RegisterScreen";
import WaitingScreen from "../screens/WaitingScreen";
import RequestsScreen from "../screens/RequestsScreen";

const Stack = createNativeStackNavigator();

const Navigations = () => {
  return (
    <Stack.Navigator style={{ flex: 1 }} initialRouteName="SplashScreen">
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TestsScreen"
        component={TestsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="WaitingScreen"
        component={WaitingScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RequestsScreen"
        component={RequestsScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default Navigations;

const styles = StyleSheet.create({});

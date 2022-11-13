import React, { useState, useEffect } from "react";

import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

import { signInAnonymously } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useDispatch } from "react-redux";
import { setCurrentUser } from "../app/slices/navigationSlice";
import { useNavigation } from "@react-navigation/core";

import { LogBox } from "react-native";

import tw from "twrnc";

import TextInputs from "../components/TextInput";

const LoginScreen = () => {
  LogBox.ignoreLogs(["Setting a timer"]);

  // Ref or state management hooks
  const [autorisation, setautorisation] = useState();
  const [error, seterror] = useState();
  const dispatch = useDispatch();

  const navigation = useNavigation();

  const storeUser = async (value) => {
    try {
      await AsyncStorage.setItem("Driver", JSON.stringify(value));
    } catch (e) {
      // saving error
      seterror({
        text: "un problème est survenu lors de la sauvegarde de l'utilisateur, contactez l'équipe d'assistance",
      });
    }
  };

  const getUser = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        let driver = JSON.parse(value);
      }
    } catch (e) {
      // error reading value
      seterror({
        text: "un problème est survenu lors de la lecture de la valeur de l'utilisateur, contactez l'équipe d'assistance",
      });
    }
  };

  const handleLogin = async () => {
    if (autorisation) {
      let driver;
      const docRef = doc(db, "drivers", autorisation);
      const docSnap = await getDoc(docRef).catch((err) => {
        seterror({
          text: err.message,
        });
        return;
      });
      if (docSnap?.exists()) {
        driver = docSnap.data();
        seterror(null);
        await storeUser(driver);
        dispatch(setCurrentUser(docSnap.data()));
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
        seterror({
          text: "Ce numéro n'existe pas",
        });
      }
    } else {
      seterror({
        text: "Veulliez entrer un numéro valide",
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={[tw`rounded-full`, styles.ellipse1]} />
      <View style={[tw`rounded-full`, styles.ellipse2]} />
      <View style={[styles.styleSEnregistrer, tw`mb-2`]}>
        <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 30 }}>
          Se connecter
        </Text>
      </View>

      <View style={[tw``, styles.inputContainer]}>
        <Text style={[tw`mb-1`, { fontFamily: "Poppins-Regular" }]}>
          Numéro de l’autorisation *
        </Text>
        <TextInputs
          placeHolder={"Ex: 218 39 46 28"}
          value={autorisation}
          onChangeText={setautorisation}
          iconName="user"
          style={tw`mb-2`}
        />
        {error && (
          <Text
            style={[
              tw`ml-2 mb-1`,
              { fontFamily: "Poppins-Regular", color: "#F74C00" },
            ]}
          >
            {error?.text}
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={tw`absolute bottom-3 rounded-full bg-[#431879] w-[80]  p-4 flex justify-center items-center`}
        onPress={handleLogin}
      >
        <Text style={styles.btn}>Confirmer</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

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
  styleSEnregistrer: {
    display: "flex",
    width: "80%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    fontSize: 30,
  },
  inputContainer: {
    width: "80%",
  },
  scrollView: {
    backgroundColor: "pink",
    marginHorizontal: 20,
  },
  text: {
    fontFamily: "Poppins-Light",
    lineHeight: 21,
  },
  next: {
    fontFamily: "Poppins-SemiBold",
    lineHeight: 21,
    color: "white",
  },
  ignore: {
    fontFamily: "Poppins-SemiBold",
    lineHeight: 21,
    color: "black",
  },
  numbers: {
    fontFamily: "Poppins-Light",
    fontSize: 20,
  },
  title: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 28,
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 15,
  },
  subSubtitle: {
    fontFamily: "Poppins-Light",
    fontSize: 15,
  },
  subtitleNumber: {
    fontFamily: "Poppins-Bold",
    fontSize: 15,
  },
  phoneContainer: {
    marginLeft: 20,
    marginRight: 20,
  },
  btn: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#fff",
  },
});

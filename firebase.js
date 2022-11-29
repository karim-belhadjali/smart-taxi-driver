import { initializeApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Optionally import the services that you want to use
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";
//import {...} from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
//import {...} from "firebase/storage";

// Initialize Firebase

const firebaseConfig = {
  apiKey: "AIzaSyA_MBIonc47YR-XXXSReEO0gBBsMV_3Ppw",

  authDomain: "beem-smart-taxi.firebaseapp.com",

  projectId: "beem-smart-taxi",

  storageBucket: "beem-smart-taxi.appspot.com",

  messagingSenderId: "182743146583",

  appId: "1:182743146583:web:9a6b44451e4dc45e308312",

  measurementId: "G-JZN37453SJ",
};

let app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const functions = getFunctions(app);
const db = getFirestore(app);

export { auth, app, functions, httpsCallable, db };

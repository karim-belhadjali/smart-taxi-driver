import React, { useRef, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
} from "react-native";

import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
// import { GOOGLE_MAPS_API_KEY } from "@env";
import { Icon } from "react-native-elements";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";

import { functions, httpsCallable, db } from "../firebase";

import {
  selectDestination,
  selectOrigin,
  selectCurrentLocation,
  selectCurrentUser,
} from "../app/slices/navigationSlice";
import { useDispatch, useSelector } from "react-redux";
import { setDestination, setOrigin } from "../app/slices/navigationSlice";
const GOOGLE_MAPS_API_KEY = "AIzaSyA_MBIonc47YR-XXXSReEO0gBBsMV_3Ppw";
import tw from "twrnc";
import { LogBox } from "react-native";

import {
  doc,
  onSnapshot,
  collection,
  setDoc,
  query,
  runTransaction,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

const LOCATION_TASK_NAME = "background-location-task";

const HomeScreen = () => {
  LogBox.ignoreLogs(["Setting a timer"]);
  TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
    if (error) {
      // Error occurred - check `error.message` for more details.
      return;
    }
    if (data) {
      const { locations } = data;
      setDoc(
        doc(db, "Current Ride", currentDoc.uid),
        {
          driver: {
            driverLocation: {
              location: {
                lat: locations[0].coords.latitude,
                lng: locations[0].coords.longitude,
              },
            },
          },
        },
        { merge: true }
      );
    }
  });

  const dispatch = useDispatch();
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const currentLocation = useSelector(selectCurrentLocation);
  const user = useSelector(selectCurrentUser);
  const mapRef = useRef(null);
  const statusRef = useRef(null);
  const [requestSent, setrequestSent] = useState(false);
  const [message, showMessage] = useState(undefined);
  const [occupied, setoccupied] = useState(false);
  const [error, seterror] = useState();
  const [currentDoc, setcurrentDoc] = useState("");
  const [currentRide, setcurrentRide] = useState(false);
  const [actionButton, setactionButton] = useState(false);

  useEffect(() => {
    if (!origin || !destination) return;

    setTimeout(() => {
      mapRef?.current?.fitToSuppliedMarkers(
        ["origin", "destination", "current"],
        {
          edgePadding: { top: 150, right: 100, bottom: 50, left: 100 },
          duration: 1000,
        }
      );
    }, 300);
  }, [origin, destination]);

  useEffect(() => {
    setcurrentDoc(false);
    setrequestSent(true);
    setoccupied(false);
    setactionButton(false);
  }, []);

  useEffect(() => {
    if (!occupied) return;
    respond();
  }, [occupied]);

  useEffect(() => {
    if (occupied && listner) listner();
    if (occupied) return;
    let listner = handleListener();
    //return () => listner();
  }, [occupied]);

  useEffect(() => {
    if (!currentRide && ref) ref();
    if (!currentRide) return;
    const ref = onSnapshot(doc(db, "Current Ride", currentDoc.uid), (doc) => {
      if (doc.exists()) {
        setcurrentRide(doc.data());
        if (doc?.data()?.canceledByClient) {
          setoccupied(false);
          setactionButton(false);
          dispatch(setOrigin(undefined));
          dispatch(setDestination(undefined));
          setcurrentDoc(undefined);
          stopLocation();
          setcurrentRide(false);
          ref();
          return;
        }
      } else {
        ref();
        return;
      }
    });
    return () => ref();
  }, [currentRide]);

  const handleListener = async () => {
    const q = query(collection(db, "Ride Requests"));
    const ref = onSnapshot(q, async (querySnapshot) => {
      let found = false;
      if (!occupied) {
        for (let index = 0; index < querySnapshot?.docs?.length; index++) {
          if (found) break;
          const docu = querySnapshot.docs[index].data();
          if (docu.accepted === false) {
            showMessage({
              name: docu?.clientFirstname,
              lastname: docu?.clientLastName,
              location: docu?.origin?.description,
              document: docu,
            });
            setcurrentDoc(docu);
            found = true;
            break;
          }
        }
      }
    });
    return ref;
  };

  const respond = async () => {
    let result = await accept(currentDoc);
    if (result) {
      console.log("accepted request: success");
      setactionButton(true);
      startLocation();
      setDoc(doc(db, "Current Ride", currentDoc.uid), {
        uid: currentDoc.uid,
        driver: {
          driverId: currentDoc.driverId,
          driverstartingLocation: currentLocation,
          driverLocation: currentLocation,
        },
        client: {
          origin: currentDoc.origin,
          destination: currentDoc.destination,
          phoneNumber: currentDoc.phoneNumber,
        },
        price: "",
        canceledByDriver: false,
        canceledByClient: false,
        startedAt: Date.now(),
        finished: false,
      }).then(() => {
        setcurrentRide(true);
        setTimeout(() => {
          deleteDoc(doc(db, "Ride Requests", currentDoc.uid));
        }, 3000);
      });
    } else {
      console.log("accepted request: failure");
      setoccupied(false);
      seterror({ text: "the request is expired" });
    }
  };

  const startLocation = async () => {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 5000,
      distanceInterval: 20,
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

  const accept = async (docu, q) => {
    const docref = doc(db, "Ride Requests", docu.uid);
    let response;
    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(docref);
        if (!sfDoc.exists()) {
          console.log("Document does not exist!");
          response = 0;
          return;
        }
        // transaction.update(docref, {
        //   accepted: true,
        //   driverId: user.uid,
        //   driverLocation: currentLocation,
        // });

        response = {
          origin: docu.origin,
          destination: docu.destination,
        };
      });
    } catch (e) {
      console.log("Transaction failed: ", e);
      response = 0;
    }
    if (response === 0) {
      return false;
    } else {
      dispatch(setOrigin(response.origin));
      dispatch(setDestination(response.destination));
      return true;
    }
  };

  const handleCancelDriver = () => {
    setDoc(
      doc(db, "Current Ride", currentDoc.uid),
      { canceledByDriver: true },
      { merge: true }
    ).then(() => {
      setDoc(
        doc(
          db,
          "Canceled Rides",
          currentDoc.uid + "_" + currentDoc.driverId + "_" + Date.now()
        ),
        {
          userUid: currentRide.uid,
          driverUid: currentRide.driver.driverId,
          startTime: currentRide.startedAt,
          FinishedTime: Date.now(),
          finalPrice: currentRide.price,
          driverStartingLocation: currentRide.driver.driverstartingLocation,
          pickUpPlace: currentRide.client.origin,
          rideDestination: currentRide.client.destination,
          canceledBy: "driver",
        }
      ).then((e) => {
        setoccupied(false);
        setactionButton(false);
        dispatch(setOrigin(undefined));
        dispatch(setDestination(undefined));
        setTimeout(() => {
          deleteDoc(doc(db, "Current Ride", currentRide.uid));
        }, 3000);
        setcurrentDoc(undefined);
        setcurrentRide(false);
        stopLocation();
      });
    });
  };

  const handleFinishRide = () => {
    setDoc(
      doc(db, "Current Ride", currentRide.uid),
      { finished: true },
      { merge: true }
    ).then(() => {
      setDoc(
        doc(
          db,
          "Canceled Rides",
          currentRide.uid + "_" + currentRide.driver.driverId + "_" + Date.now()
        ),
        {
          userUid: currentRide.uid,
          driverUid: currentRide.driver.driverId,
          startTime: currentRide.startedAt,
          FinishedTime: Date.now(),
          finalPrice: currentRide.price,
          driverStartingLocation: currentRide.driver.driverstartingLocation,
          pickUpPlace: currentRide.client.origin,
          rideDestination: currentRide.client.destination,
        }
      ).then((e) => {
        setoccupied(false);
        setactionButton(false);
        dispatch(setOrigin(undefined));
        dispatch(setDestination(undefined));
        setTimeout(() => {
          deleteDoc(doc(db, "Current Ride", currentRide.uid));
        }, 3000);
        setcurrentDoc(undefined);
        setcurrentRide(false);
        stopLocation();
      });
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <MapView
        ref={mapRef}
        initialRegion={{
          latitude: currentLocation?.location?.lat,
          longitude: currentLocation?.location?.lng,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        mapType="mutedStandard"
        provider="google"
        style={tw`flex-1`}
      >
        {origin && destination && (
          <MapViewDirections
            origin={origin.description}
            destination={destination.description}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={3}
            strokeColor="blue"
            lineDashPattern={[0]}
          />
        )}
        {origin && currentLocation && (
          <MapViewDirections
            origin={`${currentLocation?.location?.lat},${currentLocation?.location?.lng}`}
            destination={origin.description}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={3}
            strokeColor="red"
            lineDashPattern={[0]}
          />
        )}
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation?.location?.lat,
              longitude: currentLocation?.location?.lng,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            title="current"
            description={currentLocation.description}
            identifier="current"
          >
            <Icon size={50} name="location" type="evilicon" color="#8B8000" />
          </Marker>
        )}
        {origin?.location && (
          <Marker
            coordinate={{
              latitude: origin?.location?.lat,
              longitude: origin?.location.lng,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            title="Origin"
            description={origin?.description}
            identifier="origin"
          />
        )}
        {destination?.location && (
          <Marker
            coordinate={{
              latitude: destination?.location.lat,
              longitude: destination?.location.lng,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            title="Destination"
            description={destination?.description}
            identifier="destination"
          />
        )}
      </MapView>
      {message ? (
        <TouchableOpacity
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 0xffffffee, justifyContent: "center" },
          ]}
          onPress={() => showMessage(undefined)}
        >
          <Text
            style={{
              color: "blue",
              fontSize: 17,
              textAlign: "center",
              margin: 20,
            }}
          >
            {message.name}
          </Text>
          <Text
            style={{
              color: "blue",
              fontSize: 17,
              textAlign: "center",
              margin: 20,
            }}
          >
            {message.lastname}
          </Text>
          <Text
            style={{
              color: "blue",
              fontSize: 17,
              textAlign: "center",
              margin: 20,
            }}
          >
            {message.location}
          </Text>

          <View>
            <Button
              title="Confirm"
              onPress={() => {
                setoccupied(true);
                showMessage(undefined);
              }}
            />
            <Button
              title="Decline"
              onPress={() => {
                setoccupied(false);
                showMessage(undefined);
              }}
            />
          </View>
        </TouchableOpacity>
      ) : undefined}
      {error ? (
        <TouchableOpacity
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 0xffffffee, justifyContent: "center" },
          ]}
          onPress={() => seterror(undefined)}
        >
          <Text
            style={{
              color: "#FF0000",
              fontSize: 17,
              textAlign: "center",
              margin: 20,
            }}
          >
            {error.text}
          </Text>
        </TouchableOpacity>
      ) : undefined}
      {actionButton && (
        <>
          <Button title="Cancel ride" onPress={handleCancelDriver} />
          <Button title="Finish ride" onPress={handleFinishRide} />
        </>
      )}
      <Text ref={statusRef}>{occupied}</Text>
    </KeyboardAvoidingView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});

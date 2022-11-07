// import React, { useRef, useState, useEffect } from "react";
// import { StyleSheet, Text, View } from "react-native";
// import { StatusBar } from "react-native";

// import {
//   selectCurrentLocation,
//   selectCurrentUser,
//   selectDestination,
//   selectOrigin,
//   selectRide,
//   setCurrentLocation,
//   setDestination,
//   setOrigin,
//   setRide,
// } from "../app/slices/navigationSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigation } from "@react-navigation/core";

// import * as TaskManager from "expo-task-manager";
// import * as Location from "expo-location";

// import MapView, { Marker } from "react-native-maps";
// import MapViewDirections from "react-native-maps-directions";

// import {
//   doc,
//   onSnapshot,
//   collection,
//   setDoc,
//   query,
//   runTransaction,
//   deleteDoc,
//   getDoc,
// } from "firebase/firestore";
// import { db } from "../firebase";

// import tw from "twrnc";

// import ToClient from "../components/Rides/ToClient";
// import FinishedPage from "../components/FinishedPage";
// import OngoingRide from "../components/Rides/OngoingRide";
// import MapCarSvg from "../assets/svg/MapCarSvg";
// import UserLocationSvg from "../assets/svg/UserLocationSvg";

// const GOOGLE_MAPS_API_KEY = "AIzaSyCZ_g1IKyfqx-UNjhGKnIbZKPF9rAzVJwg";
// const LOCATION_TASK_NAME = "background-location-task";

// const RideScreen = () => {
//   TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
//     if (error) {
//       // Error occurred - check `error.message` for more details.
//       return;
//     }
//     if (data) {
//       const { locations } = data;
//       dispatch(
//         setCurrentLocation({
//           description: currentLocation.description,
//           location: {
//             lat: locations[0].coords.latitude,
//             lng: locations[0].coords.longitude,
//           },
//         })
//       );
//       setDoc(
//         doc(db, "Current Courses", currentRide?.user.phone),
//         {
//           driverInfo: {
//             location: {
//               location: {
//                 lat: locations[0].coords.latitude,
//                 lng: locations[0].coords.longitude,
//               },
//             },
//           },
//         },
//         { merge: true }
//       );
//     }
//   });

//   const dispatch = useDispatch();
//   const origin = useSelector(selectOrigin);
//   const destination = useSelector(selectDestination);
//   const currentLocation = useSelector(selectCurrentLocation);
//   const user = useSelector(selectCurrentUser);
//   const request = useSelector(selectRide);
//   const mapRef = useRef(null);
//   const currentRide = useSelector(selectRide);

//   const navigation = useNavigation();

//   const [mapHeight, setmapHeight] = useState("60%");
//   const [currentStep, setcurrentStep] = useState("ToClient");

//   useEffect(() => {
//     if (!origin || !currentLocation) return;

//     setTimeout(() => {
//       mapRef?.current?.fitToSuppliedMarkers(["origin", "current"], {
//         edgePadding: { top: 150, right: 100, bottom: 50, left: 100 },
//         duration: 1000,
//       });
//     }, 300);
//   }, [origin, currentLocation]);

//   useEffect(() => {
//     if (!destination || !currentLocation) return;

//     setTimeout(() => {
//       mapRef?.current?.fitToSuppliedMarkers(["Client", "current"], {
//         edgePadding: { top: 150, right: 100, bottom: 50, left: 100 },
//         duration: 1000,
//       });
//     }, 300);
//   }, [destination, currentLocation]);

//   useEffect(() => {
//     getRide;
//   }, []);

//   useEffect(() => {
//     startLocation();
//   }, []);
//   useEffect(() => {
//     console.log(currentRide);
//   }, [currentRide]);

//   const getRide = async () => {
//     const docSnap = await getDoc(docRef);
//     dispatch(setRide(docSnap.data()));
//     //setcurrentRide(docSnap.data());
//   };
//   const startLocation = async () => {
//     await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
//       accuracy: Location.Accuracy.BestForNavigation,
//       timeInterval: 5000,
//       distanceInterval: 20,
//       foregroundService: {
//         notificationTitle: "En ligne ... ",
//         notificationBody: "Mise à jour de votre position en cours ...",
//       },

//       showsBackgroundLocationIndicator: true,
//     });
//   };

//   const stopLocation = async () => {
//     Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME).then(
//       (value) => {
//         if (value) {
//           Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
//         }
//       }
//     );
//   };

//   const handleStartRide = () => {
//     setDoc(
//       doc(db, "Current Courses", currentRide?.user.phone),
//       { driverArrived: true },
//       {
//         merge: true,
//       }
//     ).then(() => {
//       dispatch(setOrigin(null));
//       mapRef?.current?.fitToSuppliedMarkers(["Client", "current"], {
//         edgePadding: { top: 150, right: 100, bottom: 50, left: 100 },
//         duration: 1000,
//       });
//       setcurrentStep("Ongoing");
//     });
//   };
//   const handleFinish = () => {
//     setDoc(
//       doc(db, "Current Courses", currentRide?.user.phone),
//       { finished: true },
//       {
//         merge: true,
//       }
//     ).then(() => {
//       setDoc(
//         doc(
//           db,
//           "Finished Rides",
//           `${currentRide?.driverInfo?.phone}_${Date.now()}_${
//             currentRide?.user?.phone
//           }`
//         ),
//         { finishedTime: Date.now(), currentRide }
//       ).then(() => {
//         dispatch(setDestination(null));
//         stopLocation();
//         setcurrentStep("finished");
//       });
//     });
//   };

//   const handleReturnHome = () => {
//     dispatch(setRide(null));
//     deleteDoc(doc(db, "Ride Requests", currentRide?.user.phone));
//     deleteDoc(doc(db, "Current Courses", currentRide?.user.phone));
//     navigation.navigate("RequestsScreen");
//     navigation.reset({
//       index: 0,
//       routes: [
//         {
//           name: "RequestsScreen",
//         },
//       ],
//     });
//   };

//   return (
//     <View style={tw`h-full bg-[#fff] flex pt-[${StatusBar.currentHeight}]`}>
//       {currentStep !== "finished" && (
//         <>
//           <MapView
//             ref={mapRef}
//             initialRegion={{
//               latitude: currentLocation.location.lat,
//               longitude: currentLocation.location.lng,
//               latitudeDelta: 0.005,
//               longitudeDelta: 0.005,
//             }}
//             mapType="mutedStandard"
//             provider="google"
//             style={tw`w-screen h-[${mapHeight}]`}
//             zoomEnabled={true}
//           >
//             <Marker
//               coordinate={{
//                 latitude: currentLocation.location.lat,
//                 longitude: currentLocation.location.lng,
//                 latitudeDelta: 0.005,
//                 longitudeDelta: 0.005,
//               }}
//               title="current"
//               description={currentLocation.description}
//               identifier="current"
//             >
//               <MapCarSvg />
//             </Marker>
//             {origin && currentLocation && (
//               <MapViewDirections
//                 origin={`${currentLocation.location.lat},${currentLocation.location.lng}`}
//                 destination={`${origin.location.lat},${origin.location.lng}`}
//                 apikey={GOOGLE_MAPS_API_KEY}
//                 strokeWidth={3}
//                 strokeColor="blue"
//                 lineDashPattern={[0]}
//               />
//             )}
//             {origin && (
//               <Marker
//                 coordinate={{
//                   latitude: origin.location.lat,
//                   longitude: origin.location.lng,
//                   latitudeDelta: 0.005,
//                   longitudeDelta: 0.005,
//                 }}
//                 title="Client"
//                 description={origin.description}
//                 identifier="origin"
//               >
//                 <UserLocationSvg />
//               </Marker>
//             )}
//             {destination && currentLocation && !origin && (
//               <MapViewDirections
//                 origin={`${currentLocation.location.lat},${currentLocation.location.lng}`}
//                 destination={`${destination.location.lat},${destination.location.lng}`}
//                 apikey={GOOGLE_MAPS_API_KEY}
//                 strokeWidth={3}
//                 strokeColor="blue"
//                 lineDashPattern={[0]}
//               />
//             )}
//             {destination && !origin && (
//               <Marker
//                 coordinate={{
//                   latitude: destination.location.lat,
//                   longitude: destination.location.lng,
//                   latitudeDelta: 0.005,
//                   longitudeDelta: 0.005,
//                 }}
//                 title="Client"
//                 description={destination.description}
//                 identifier="Client"
//               />
//             )}
//           </MapView>
//           {currentStep === "ToClient" && (
//             <ToClient
//               handleStart={handleStartRide}
//               origin={currentRide?.origin?.description}
//               destination={currentRide?.destination?.description}
//               phone={currentRide?.user?.phone}
//               price={currentRide?.price}
//             />
//           )}
//           {currentStep === "Ongoing" && (
//             <OngoingRide
//               origin={currentRide?.origin?.description}
//               destination={currentRide?.destination?.description}
//               price={currentRide?.price}
//               handleFinish={handleFinish}
//             />
//           )}
//         </>
//       )}
//       {currentStep === "finished" && (
//         <FinishedPage ride={currentRide} OnFinish={handleReturnHome} />
//       )}
//     </View>
//   );
// };

// export default RideScreen;

// const styles = StyleSheet.create({});
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, Text, View, Dimensions } from "react-native";

import React, { useRef, useState, useEffect } from "react";
import { StatusBar } from "react-native";

import {
  selectCurrentLocation,
  selectCurrentUser,
  selectDestination,
  selectOrigin,
  selectRide,
  setCurrentLocation,
  setDestination,
  setOrigin,
  setRide,
} from "../app/slices/navigationSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/core";

import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";

import MapViewDirections from "react-native-maps-directions";

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
import { db } from "../firebase";

import tw from "twrnc";

import ToClient from "../components/Rides/ToClient";
import FinishedPage from "../components/FinishedPage";
import OngoingRide from "../components/Rides/OngoingRide";
import MapCarSvg from "../assets/svg/MapCarSvg";
import UserLocationSvg from "../assets/svg/UserLocationSvg";

const GOOGLE_MAPS_API_KEY = "AIzaSyCZ_g1IKyfqx-UNjhGKnIbZKPF9rAzVJwg";
const LOCATION_TASK_NAME = "background-location-task";

export default function RideScreen() {
  TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
    if (error) {
      // Error occurred - check `error.message` for more details.
      return;
    }
    if (data) {
      const { locations } = data;
      dispatch(
        setCurrentLocation({
          description: currentLocation.description,
          location: {
            lat: locations[0].coords.latitude,
            lng: locations[0].coords.longitude,
          },
        })
      );
      setDoc(
        doc(db, "Current Courses", currentRide?.user.phone),
        {
          driverInfo: {
            location: {
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
  const request = useSelector(selectRide);
  const mapRef = useRef(null);
  const currentRide = useSelector(selectRide);

  const navigation = useNavigation();

  const [mapHeight, setmapHeight] = useState("60%");
  const [currentStep, setcurrentStep] = useState("ToClient");

  useEffect(() => {
    if (!origin || !currentLocation) return;

    setTimeout(() => {
      mapRef?.current?.fitToSuppliedMarkers(["origin", "current"], {
        edgePadding: { top: 150, right: 100, bottom: 50, left: 100 },
        duration: 1000,
      });
    }, 300);
  }, [origin, currentLocation]);

  useEffect(() => {
    if (!destination || !currentLocation) return;

    setTimeout(() => {
      mapRef?.current?.fitToSuppliedMarkers(["Client", "current"], {
        edgePadding: { top: 150, right: 100, bottom: 50, left: 100 },
        duration: 1000,
      });
    }, 300);
  }, [destination, currentLocation]);

  useEffect(() => {
    getRide;
  }, []);

  useEffect(() => {
    startLocation();
  }, []);
  useEffect(() => {
    console.log(currentRide);
  }, [currentRide]);

  const getRide = async () => {
    const docSnap = await getDoc(docRef);
    dispatch(setRide(docSnap.data()));
    //setcurrentRide(docSnap.data());
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

  const handleStartRide = () => {
    setDoc(
      doc(db, "Current Courses", currentRide?.user.phone),
      { driverArrived: true },
      {
        merge: true,
      }
    ).then(() => {
      dispatch(setOrigin(null));
      mapRef?.current?.fitToSuppliedMarkers(["Client", "current"], {
        edgePadding: { top: 150, right: 100, bottom: 50, left: 100 },
        duration: 1000,
      });
      setcurrentStep("Ongoing");
    });
  };
  const handleFinish = () => {
    setDoc(
      doc(db, "Current Courses", currentRide?.user.phone),
      { finished: true },
      {
        merge: true,
      }
    ).then(() => {
      setDoc(
        doc(
          db,
          "Finished Rides",
          `${currentRide?.driverInfo?.phone}_${Date.now()}_${
            currentRide?.user?.phone
          }`
        ),
        { finishedTime: Date.now(), currentRide }
      ).then(() => {
        dispatch(setDestination(null));
        stopLocation();
        setcurrentStep("finished");
      });
    });
  };

  const handleReturnHome = () => {
    dispatch(setRide(null));
    deleteDoc(doc(db, "Ride Requests", currentRide?.user.phone));
    deleteDoc(doc(db, "Current Courses", currentRide?.user.phone));
    navigation.navigate("RequestsScreen");
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "RequestsScreen",
        },
      ],
    });
  };
  return (
    <View style={styles.container}>
      {currentStep !== "finished" && (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: currentLocation.location.lat,
              longitude: currentLocation.location.lng,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
          >
            <Marker
              coordinate={{
                latitude: currentLocation.location.lat,
                longitude: currentLocation.location.lng,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              title="current"
              description={currentLocation.description}
              identifier="current"
            >
              <MapCarSvg />
            </Marker>
            {origin && currentLocation && (
              <MapViewDirections
                origin={`${currentLocation.location.lat},${currentLocation.location.lng}`}
                destination={`${origin.location.lat},${origin.location.lng}`}
                apikey={GOOGLE_MAPS_API_KEY}
                strokeWidth={3}
                strokeColor="blue"
                lineDashPattern={[0]}
              />
            )}
            {origin && (
              <Marker
                coordinate={{
                  latitude: origin.location.lat,
                  longitude: origin.location.lng,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}
                title="Client"
                description={origin.description}
                identifier="origin"
              >
                <UserLocationSvg />
              </Marker>
            )}
            {destination && currentLocation && !origin && (
              <MapViewDirections
                origin={`${currentLocation.location.lat},${currentLocation.location.lng}`}
                destination={`${destination.location.lat},${destination.location.lng}`}
                apikey={GOOGLE_MAPS_API_KEY}
                strokeWidth={3}
                strokeColor="blue"
                lineDashPattern={[0]}
              />
            )}
            {destination && !origin && (
              <Marker
                coordinate={{
                  latitude: destination.location.lat,
                  longitude: destination.location.lng,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}
                title="Client"
                description={destination.description}
                identifier="Client"
              />
            )}
          </MapView>
          {currentStep === "ToClient" && (
            <ToClient
              handleStart={handleStartRide}
              origin={currentRide?.origin?.description}
              destination={currentRide?.destination?.description}
              phone={currentRide?.user?.phone}
              price={currentRide?.price}
            />
          )}
          {currentStep === "Ongoing" && (
            <OngoingRide
              origin={currentRide?.origin?.description}
              destination={currentRide?.destination?.description}
              price={currentRide?.price}
              handleFinish={handleFinish}
            />
          )}
        </>
      )}
      {currentStep === "finished" && (
        <FinishedPage ride={currentRide} OnFinish={handleReturnHome} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    height: "100%",
    paddingTop: StatusBar.currentHeight,
  },
  map: {
    width: Dimensions.get("window").width,
    height: "60%",
  },
});

import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from "react-native";
import tw from "twrnc";
import { StatusBar } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import MenuItem from "../components/MenuItem";
import {
  selectCurrentLocation,
  selectCurrentUser,
  selectVersion,
  setDestination,
  setOrigin,
  setRide,
} from "../app/slices/navigationSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/core";

import BlueDotSvg from "../assets/svg/BlueDotSvg";
import {
  doc,
  onSnapshot,
  collection,
  setDoc,
  query,
  runTransaction,
  deleteDoc,
  getDoc,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { LogBox } from "react-native";
import { setOccupied } from "../app/slices/navigationSlice";
import Entypo from "react-native-vector-icons/Entypo";

import ToggleSwitch from "toggle-switch-react-native";
import { Dimensions } from "react-native";
import { Audio } from "expo-av";

const GOOGLE_MAPS_API_KEY = "AIzaSyA_MBIonc47YR-XXXSReEO0gBBsMV_3Ppw";
import { registerForPushNotificationsAsync } from "../notifications";

const RequestsScreen = () => {
  LogBox.ignoreLogs(["Setting a timer"]);
  let interval = undefined;
  const [requests, setrequests] = useState([]);
  const [occupied, setoccupied] = useState(false);
  const [currentRide, setcurrentRide] = useState();
  const [currentTimeRideInfo, setcurrentTimeRideInfo] = useState(null);
  const [currentRideRequest, setcurrentRideRequest] = useState();
  const [accepted, setaccepted] = useState(false);
  const currentLocation = useSelector(selectCurrentLocation);
  const user = useSelector(selectCurrentUser);
  const version = useSelector(selectVersion);
  const [online, setonline] = useState(true);
  const [displayMenu, setdisplayMenu] = useState(false);

  const [sound, setSound] = useState();

  // Animations menu
  const screenWidth = Dimensions.get("window").width;
  const leftpos = useRef(new Animated.Value(-screenWidth)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleListener = async () => {
    if (occupied && !online) return;
    setrequests([]);
    const q = query(
      collection(db, "Ride Requests"),
      where("driverAccepted", "==", false),
      where("canceled", "==", false)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      // doc.data() is never undefined for query doc snapshots
      const docu = doc.data();
      console.log(docu);
      const distanceInfo = await getTravelTime(
        currentLocation.location.lat,
        currentLocation.location.lng,
        docu.origin.location.lat,
        docu.origin.location.lng
      );

      if (
        distanceInfo?.status !== "NOT_FOUND" &&
        distanceInfo?.status !== "ZERO_RESULTS"
      ) {
        console.log(parseFloat(distanceInfo?.distance?.text));
        if (parseFloat(distanceInfo?.distance?.text) <= 3) {
          setrequests((prevState) => [...prevState, docu]);
          playSound();
        }
      } else {
        console.log(distanceInfo);
      }
    });
  };

  useEffect(() => {
    setoccupied(false);
    setonline(true);
    if (interval === undefined) {
      handleListener();
    }
  }, []);

  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    let token = await registerForPushNotificationsAsync();
    setDoc(
      doc(db, "drivers", user.uid),
      {
        token,
      },
      { merge: true }
    );
  };

  useEffect(() => {
    start();
  }, [occupied, online]);

  const start = async () => {
    if (occupied === false && online === true) {
      // await registerBackgroundFetchAsync();
      interval = setInterval(() => {
        handleListener();
      }, 10000);
      return () => clearInterval(interval);
    } else if (occupied === true) {
      if (interval !== undefined) {
        clearInterval(interval);
      }
    } else if (online === false) {
      setrequests([]);
    }
  };

  useEffect(() => {
    if (!accepted) return;
    setTimeout(async () => {
      const docRef = doc(db, "Ride Requests", currentRideRequest?.user.phone);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        let ride = docSnap.data();
        if (ride?.clientAccepted === false && ride?.canceled === false) {
          setDoc(
            doc(db, "Ride Requests", currentRideRequest?.user.phone),
            { canceled: true },
            { merge: true }
          );
        }
      }
    }, 30000);
    const unsub = onSnapshot(
      doc(db, "Ride Requests", currentRideRequest?.user.phone),
      async (current) => {
        if (current.exists()) {
          const request = current.data();
          if (request.clientAccepted) {
            dispatch(setOrigin(request.origin));
            dispatch(setDestination(request.destination));
            const docRef = doc(
              db,
              "Current Courses",
              currentRideRequest?.user.phone
            );
            setTimeout(async () => {
              const docSnap = await getDoc(docRef);
              dispatch(setRide(docSnap.data()));
              console.log(docSnap.data());
              navigation.navigate("RideScreen");
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: "RideScreen",
                  },
                ],
              });
              unsub();
            }, 3000);
          } else if (request.canceled) {
            deleteDoc(doc(db, "Ride Requests", request?.user.phone));
            dispatch(setRide(null));
            setcurrentTimeRideInfo(null);
            setcurrentRide(null);
            setoccupied(false);
            setaccepted(false);
            unsub();
          }
        } else {
          dispatch(setRide(null));
          setcurrentTimeRideInfo(null);
          setcurrentRide(null);
          setoccupied(false);
          setaccepted(false);
          unsub();
        }
      }
    );
    return () => unsub();
  }, [accepted]);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const handleAccept = async (request) => {
    setcurrentRideRequest(request);
    setoccupied(true);
    const docref = doc(db, "Ride Requests", request?.user.phone);
    const distanceInfo = await getTravelTime(
      currentLocation.location.lat,
      currentLocation.location.lng,
      request.origin.location.lat,
      request.origin.location.lng
    );

    if (distanceInfo?.status === "NOT_FOUND") {
      handleAnnuler(request);
      console.log("Document updated!");
      return;
    }

    handleChangeRequestValue(docref, request, distanceInfo);
  };

  const handleChangeRequestValue = async (docref, request, distanceInfo) => {
    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(docref);
        if (!sfDoc.exists()) {
          setoccupied(false);
          return;
        } else if (sfDoc.data().driverAccepted === true) {
          console.log("Document already accepted!");
          setOccupied(false);
          handleAnnuler(currentRideRequest);
          return;
        } else {
          if (distanceInfo?.status !== "ZERO_RESULTS") {
            transaction.update(docref, {
              driverAccepted: true,
              driverTime: distanceInfo?.duration?.text,
              driverDistance: parseFloat(distanceInfo?.distance?.text),
              driverInfo: {
                carType: user?.carType,
                location: currentLocation,
                name: user?.fullName,
                phone: user?.mainPhone,
              },
            });
          } else {
            transaction.update(docref, {
              driverAccepted: true,
              driverTime: "3",
              driverDistance: 1,
              driverInfo: {
                carType: user?.carType,
                location: currentLocation,
                name: user?.fullName,
                phone: user?.mainPhone,
              },
            });
          }

          setcurrentRide(request);
          handleAnnuler(request);
          setaccepted(true);
          console.log("Document updated!");
        }
      });
    } catch (e) {
      console.log("Transaction failed: ", e);
      setoccupied(false);
      setaccepted(false);
    }
  };
  const handleAnnuler = (request) => {
    let newRequests = requests.filter(
      (item) => item.user.phone !== request.user.phone
    );
    setrequests(newRequests);
  };

  const getTravelTime = async (
    originlat,
    originlng,
    destinationlat,
    destinationlng
  ) => {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${
      originlat + "," + originlng
    }&destinations=${
      destinationlat + "," + destinationlng
    }&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    setcurrentTimeRideInfo(data.rows[0].elements[0]);
    return data.rows[0].elements[0];
  };

  //Animations functions

  const handleOpenMenu = () => {
    setdisplayMenu(true);

    Animated.timing(leftpos, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      Animated.timing(opacity, {
        toValue: 0.2,
        duration: 100,
        useNativeDriver: false,
      }).start();
    });
  };
  const handleCloseMenu = () => {
    setdisplayMenu(false);

    Animated.timing(opacity, {
      toValue: 0,
      duration: 20,
      useNativeDriver: false,
    }).start(() => {
      Animated.timing(leftpos, {
        toValue: -screenWidth,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });
  };

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/mixkit-positive-notification-951.wav")
    );
    setSound(sound);

    await sound.playAsync();
  }
  return (
    <>
      <View
        style={tw`h-full w-screen px-5 flex items-center pt-[${StatusBar.currentHeight}] bg-[#FFFFFF]`}
      >
        {!accepted && (
          <View
            style={tw`w-full flex flex-row justify-between items-center  my-5`}
          >
            <TouchableOpacity
              onPress={() => handleOpenMenu()}
              style={[
                tw`bg-gray-50 p-3 mt-1 w-12 h-12 rounded-full  mr-3`,
                // { elevation: 50 },
              ]}
            >
              <Entypo name="menu" size={25} color="#171717" />
            </TouchableOpacity>

            <ToggleSwitch
              isOn={online}
              onColor="#66CFC7"
              offColor="#979797"
              label="En ligne"
              labelStyle={{
                color: "black",
                fontWeight: "900",
                fontFamily: "Poppins-Regular",
              }}
              size="small"
              onToggle={(isOn) => setonline(!online)}
            />
          </View>
        )}
        <View style={tw`w-full flex-row justify-start items-center`}>
          <View
            style={tw`rounded-full bg-[#979797] w-15 h-15 flex justify-center items-center`}
          >
            <AntDesign name="user" size={30} color={"#ffff"} />
          </View>
          <View style={tw`w-full  justify-center items-start ml-5`}>
            <Text style={{ fontFamily: "Poppins-SemiBold", color: "#979797" }}>
              Aslema, {user?.fullName}!
            </Text>
            <Text style={{ fontFamily: "Poppins-SemiBold", color: "#979797" }}>
              <Text style={{ color: "#000000" }}>Beem</Text> vous souhaite la
              bienvenue
            </Text>
          </View>
        </View>
        <View
          key={"separator"}
          style={tw`bg-[#000000] opacity-10 h-[.45] mt-5 w-90`}
        />
        <View style={tw`flex justify-center items-start w-full ml-3 mt-3`}>
          <Text
            style={{
              fontFamily: "Poppins-Bold",
              color: "#000000",
              fontSize: 22,
            }}
          >
            Liste des demandes
          </Text>
        </View>
        {requests.length > 0 && (
          <View style={tw`h-72% w-screen mt-1 pb-10 flex items-center`}>
            <FlatList
              data={requests}
              ItemSeparatorComponent={() => (
                <View
                  style={[
                    tw``,
                    {
                      height: 20,
                    },
                  ]}
                />
              )}
              renderItem={(request) => {
                return (
                  <View
                    style={tw`border-[#979797] bg-[#F5F5F5] border-[.35] h-40 rounded-md w-80 px-4`}
                  >
                    <Text
                      style={[
                        tw`ml-2 mt-3`,
                        {
                          fontFamily: "Poppins-SemiBold",
                          fontSize: 15,
                          color: "#000000",
                          opacity: 0.7,
                        },
                      ]}
                    >
                      Le client vous attend à :
                    </Text>
                    <View style={tw`bg-[#000000] opacity-10 h-[.45] mt-1 `} />
                    <View style={tw`w-full flex flex-row mt-5`}>
                      <BlueDotSvg style={tw`mt-1 mr-2 pr-5`} />
                      <Text
                        style={[
                          tw``,
                          { fontFamily: "Poppins-SemiBold", fontSize: 15 },
                        ]}
                        numberOfLines={1}
                      >
                        {request.item.origin.description}
                      </Text>
                    </View>
                    <View
                      style={tw`flex flex-row justify-between items-center mt-3 pl-1 pr-2`}
                    >
                      <TouchableOpacity
                        style={tw`rounded-full bg-[#F5F5F5] h-[11] w-[30] border-[#F74C00] border-[.35] p-2 flex flex-row justify-center items-center`}
                        onPress={() => handleAnnuler(request.item)}
                      >
                        <Text style={styles.btnAnnuler}>Annuler</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={tw`rounded-full bg-[#431879] h-[11] w-[35]  p-2 flex flex-row justify-center items-center`}
                        onPress={() => handleAccept(request.item)}
                      >
                        <Text style={styles.btnAccepter}>Accepter</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
              keyExtractor={(request) => request?.user?.phone}
            />
          </View>
        )}
        {requests.length < 1 && (
          <View style={tw`w-full h-[80%] justify-center items-center`}>
            <Text style={{ fontFamily: "Poppins-Regular", fontSize: 15 }}>
              Aucune demande disponible pour le moment ou les demandes sont
              éloignées de votre position.
            </Text>
          </View>
        )}
      </View>
      {accepted && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: "#000000",
              justifyContent: "center",
              opacity: 0.8,
            },
            tw`h-screen top-[5.7]] flex justify-center items-center`,
          ]}
        >
          <ActivityIndicator size={80} color="#F74C00" />
        </View>
      )}

      <Animated.View
        style={[
          tw`flex flex-row w-screen h-screen android:mt-[${StatusBar.currentHeight}]`,
          StyleSheet.absoluteFill,
          { left: leftpos },
        ]}
      >
        <View style={tw`bg-[#FFFFFF]  w-[75%] flex items-center`}>
          <View style={tw`w-[90%] flex flex-row mt-5`}>
            <View
              style={tw`bg-[#431879] rounded-full w-12 h-12 flex justify-center items-center`}
            >
              <AntDesign style={tw``} name={"user"} size={25} color={"#ffff"} />
            </View>
            <Text
              style={[
                tw`mt-3 mx-3`,
                { fontFamily: "Poppins-Bold", fontSize: 20 },
              ]}
              numberOfLines={1}
            >
              {user?.fullName}
            </Text>
          </View>
          <View style={tw`bg-[#000000] opacity-10 h-[.45] w-full mt-5`} />
          <View style={tw`mt-5 w-[90%]`}>
            <MenuItem
              iconName={"hearto"}
              text="Profile"
              onClick={() => navigation.navigate("Profile")}
            />
            <View style={tw`opacity-30`}>
              <MenuItem
                iconName={"clockcircleo"}
                text="Historique"
                onClick={() => console.log("disabled")}
              />
            </View>
            <MenuItem
              iconName={"infocirlceo"}
              text="À propos"
              onClick={() => {
                navigation.navigate("À propos");
              }}
            />
          </View>
          <Text
            style={[
              tw`absolute bottom-2 left-10`,
              { fontFamily: "Poppins-SemiBold", fontSize: 15, opacity: 0.5 },
            ]}
          >
            Beem 2022 - Version {version}
          </Text>
        </View>
        <Animated.View style={[tw`bg-[#000000] w-[25%]`, { opacity: opacity }]}>
          <TouchableOpacity
            activeOpacity={0}
            style={[tw`bg-transparent w-full h-full`]}
            onPress={() => {
              handleCloseMenu();
            }}
          />
        </Animated.View>
      </Animated.View>
    </>
  );
};

export default RequestsScreen;

const styles = StyleSheet.create({
  btnAnnuler: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#F74C00",
    marginTop: 1,
  },
  btnAccepter: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#fff",
    marginTop: 1,
  },
});

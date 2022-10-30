import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import tw from "twrnc";
import { StatusBar } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import {
  selectCurrentLocation,
  selectCurrentUser,
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
} from "firebase/firestore";
import { functions, httpsCallable, db } from "../firebase";
import { LogBox } from "react-native";
import { setOccupied } from "../app/slices/navigationSlice";
import Entypo from "react-native-vector-icons/Entypo";

import ToggleSwitch from "toggle-switch-react-native";

const GOOGLE_MAPS_API_KEY = "AIzaSyCZ_g1IKyfqx-UNjhGKnIbZKPF9rAzVJwg";

const RequestsScreen = () => {
  LogBox.ignoreLogs(["Setting a timer"]);
  const [requests, setrequests] = useState([]);
  const [occupied, setoccupied] = useState(false);
  const [currentRide, setcurrentRide] = useState();
  const [currentTimeRideInfo, setcurrentTimeRideInfo] = useState(null);
  const [currentRideRequest, setcurrentRideRequest] = useState();
  const [accepted, setaccepted] = useState(false);
  const currentLocation = useSelector(selectCurrentLocation);
  const user = useSelector(selectCurrentUser);
  const [online, setonline] = useState(true);
  let interval;

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleListener = async () => {
    if (occupied) return;
    setrequests([]);
    const q = query(collection(db, "Ride Requests"));
    const unsub = onSnapshot(q, async (querySnapshot) => {
      for (let index = 0; index < querySnapshot?.docs?.length; index++) {
        const docu = querySnapshot.docs[index].data();

        if (docu.driverAccepted === false) {
          setrequests((prevState) => [...prevState, docu]);
        }
        unsub();
      }
      unsub();
    });
  };

  useEffect(() => {
    setoccupied(false);
    setonline(true);
  }, []);

  useEffect(() => {
    if (occupied === false && online === true) {
      interval = setInterval(() => {
        handleListener();
      }, 3000);
      return () => clearInterval(interval);
    } else if (occupied === true) {
      if (interval) {
        clearInterval(interval);
      }
    } else if (online === false) {
      setrequests([]);
    }
  }, [occupied, online]);

  useEffect(() => {
    if (!accepted) return;
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
            }, 5000);
          } else if (request.canceled) {
            deleteDoc(doc(db, "Ride Requests", request?.user.phone));
            dispatch(setRide(null));
            setcurrentTimeRideInfo(null);
            setcurrentRide(null);
            setoccupied(false);
            setaccepted(false);
          }
        } else {
          unsub();
        }
      }
    );
    return () => unsub();
  }, [accepted]);

  const handleAccept = async (request) => {
    console.log("here");
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

    if (parseFloat(distanceInfo?.distance?.text) > 5) {
      setTimeout(() => {
        handleChangeRequestValue(docref, request, distanceInfo);
      }, 2000);
    } else {
      handleChangeRequestValue(docref, request, distanceInfo);
    }
  };

  const handleChangeRequestValue = async (docref, request, distanceInfo) => {
    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(docref);
        if (!sfDoc.exists()) {
          console.log("Document does not exist!");
          setoccupied(false);
          return;
        } else if (sfDoc.data().driverAccepted === true) {
          console.log("Document already accepted!");
          setOccupied(false);
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
    let newRequests = requests.filter((item) => item.phone !== request.phone);
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

  return (
    <>
      <View
        style={tw`h-screen w-screen px-5 flex items-center pt-[${StatusBar.currentHeight}]`}
      >
        {!accepted && (
          <View
            style={tw`w-full flex flex-row justify-between items-center  my-5`}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("MainDrawer")}
              style={[
                tw`bg-gray-50 p-3 mt-1 w-12 h-12 rounded-full  mr-3`,
                { elevation: 50 },
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
              <Text style={{ color: "#000000" }}>Beem</Text> vous souhaite
            </Text>
          </View>
        </View>
        <View
          key={"separator"}
          style={tw`bg-[#000000] opacity-10 h-[.45] mt-5 w-90`}
        />
        <View style={tw`flex justify-center items-start w-full ml-3 mt-5`}>
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
          <View style={tw`h-full w-full mt-5 flex items-center`}>
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
              Pas de demande disponible pour le moment
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

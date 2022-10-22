import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  StatusBar,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";

import AntDesign from "react-native-vector-icons/AntDesign";
import tw from "twrnc";
import TextInputs from "../components/TextInput";
import NextBtn from "../components/NextBtn";
import PickerList from "../components/PickerList";
import RadioButtons from "../components/RadioButton";
import { signInAnonymously } from "firebase/auth";

import { auth, app, db } from "../firebase";

import { useNavigation } from "@react-navigation/core";
import { TextInput } from "react-native";
import PhoneInput from "../components/PhoneInput";
import { doc, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../app/slices/navigationSlice";

const OTP_KEY = "b86a2a1a-5a08-48a4-8071-dea8dfcbb752";

const CompleteProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [currentStep, setcurrentStep] = useState("step1");
  const [substep, setsubstep] = useState("step1");

  const [showerror, setshowerror] = useState(undefined);

  const gouvernorats = ["ben arous", "ariana", "mannouba"];
  const ville = ["Hammem-lif", "ezzahra", "rades"];

  // Phone Ref management hooks
  const [message, showMessage] = useState();

  // Code Ref management hooks
  const code2 = useRef();
  const code3 = useRef();
  const code1 = useRef();
  const code4 = useRef();

  // Code State management hooks

  const [codeNumber1, setcodeNumber1] = useState();
  const [codeNumber2, setcodeNumber2] = useState();
  const [codeNumber3, setcodeNumber3] = useState();
  const [codeNumber4, setcodeNumber4] = useState();

  //Driver attributes States
  const [selectedGov, setselectedGov] = useState(null);
  const [selectedVille, setselectedVille] = useState(null);
  const [driverType, setdriverType] = useState("Propriétaire");
  const [email, setemail] = useState("");
  const [fullName, setfullName] = useState("");
  const [mainPhoneNumber, setmainPhoneNumber] = useState();
  const [secondayPhoneNumber, setsecondayPhoneNumber] = useState("");
  const [matricule1, setmatricule1] = useState();
  const [matricule2, setmatricule2] = useState();
  const [numAutorisation, setnumAutorisation] = useState();
  const [carType, setcarType] = useState("");

  //OTP
  const [verificationId, setVerificationId] = useState();
  const [verifycode, setverifycode] = useState(false);
  //Border
  const [border1, setborder1] = useState("#979797");
  const [border2, setborder2] = useState("#979797");
  const [border3, setborder3] = useState("#979797");
  const [border4, setborder4] = useState("#979797");
  //Errors
  const [govErr, setgovErr] = useState(false);
  const [villeErr, setvilleErr] = useState(false);
  const [autorisationErr, setautorisationErr] = useState(false);
  const [matricule1Err, setmatricule1Err] = useState(false);
  const [matricule2Err, setmatricule2Err] = useState(false);

  useEffect(() => {
    //setcurrentStep("step1");
    setsubstep("step1");
  }, []);
  useEffect(() => {
    if (currentStep === "step2") {
      const verify = async () => {
        // The FirebaseRecaptchaVerifierModal ref implements the
        // FirebaseAuthApplicationVerifier interface and can be
        // passed directly to `verifyPhoneNumber`.

        try {
          if (mainPhoneNumber !== "" && mainPhoneNumber.length === 8) {
            //await handleSendOtp();
          }
        } catch (err) {
          showMessage({ text: `Error: ${err.message}`, color: "red" });
          console.log(err);
        }
      };
      verify();
    }
  }, [currentStep]);

  const handleStep1Click = async () => {
    if (
      fullName !== "" &&
      email !== "" &&
      isValidEmail(email) &&
      fullName.length > 6 &&
      mainPhoneNumber.length > 6
    ) {
      setcurrentStep("step2");
    } else if (isValidEmail(email)) {
      setshowerror({ text: "Please enter a valid email" });
    } else if (!fullName.length > 6) {
      setshowerror({ text: "Please enter a valid full name" });
    } else {
      setshowerror({ text: "Please fill all the required values" });
    }
  };
  const handleReturn = () => {
    if (currentStep === "step2") {
      setcurrentStep("step1");
    } else if (currentStep === "step3" && substep == "step1") {
      setcurrentStep("step2");
    } else if (currentStep === "step3" && substep == "step2") {
      setsubstep("step1");
    } else {
      navigation.navigate("LoginScreen");
    }
  };

  const handleSave = async () => {
    if (substep == "step2") {
      if (selectedGov !== null) {
        setgovErr(false);
        if (selectedVille !== null) {
          setvilleErr(false);
          if (numAutorisation) {
            setautorisationErr(false);
            if (matricule1) {
              setmatricule1Err(false);
              if (matricule2) {
                setmatricule2Err(false);
                const currentDriver = {
                  uid: numAutorisation,
                  fullName: fullName,
                  email,
                  mainPhone: mainPhoneNumber,
                  secondPhone: secondayPhoneNumber,
                  staut: driverType,
                  autorisationNumber: numAutorisation,
                  gouvernorat: selectedGov,
                  ville: selectedVille,
                  matricule: `${matricule1}-TU-${matricule2}`,
                  carType,
                };
                setDoc(doc(db, "drivers", numAutorisation), currentDriver).then(
                  () => {
                    dispatch(setCurrentUser(currentDriver));
                    navigation.navigate("WaitingScreen");
                    navigation.reset({
                      index: 1,
                      routes: [
                        {
                          name: "LoginScreen",
                        },
                        {
                          name: "WaitingScreen",
                        },
                      ],
                    });
                  }
                );
              } else {
                setmatricule2Err(true);
              }
            } else {
              setmatricule1Err(true);
            }
          } else {
            setautorisationErr(true);
          }
        } else {
          setvilleErr(true);
        }
      } else {
        setgovErr(true);
      }
    } else {
      setsubstep("step2");
    }
  };

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }
  const handleSendOtp = async () => {
    var myHeaders = new Headers();
    myHeaders.append("x-as-apikey", OTP_KEY);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      messageFormat:
        "Hello, this is your OTP ${otp}. Please do not share it with anyone",
      phoneNumber: "+21653081882",
      otpLength: 4,
      otpValidityInSeconds: 120,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://www.getapistack.com/api/v1/otp/send", requestOptions)
      .then((response) => response.text())
      .then((data) => {
        const result = JSON.parse(data);
        setVerificationId(result.data.requestId);
      })
      .catch((error) => console.log("error", error));
  };
  const handleVerifyOtp = async (otps) => {
    var myHeaders = new Headers();
    myHeaders.append("x-as-apikey", OTP_KEY);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      requestId: verificationId,
      otp: otps,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    // fetch("https://www.getapistack.com/api/v1/otp/verify", requestOptions)
    //   .then((response) => response.text())
    //   .then((result) => console.log(result))
    //   .catch((error) => console.log("error", error));

    signInAnonymously(auth)
      .then(() => {
        console.log("here");
        setcurrentStep("step3");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
    setcurrentStep("step3");
  };
  return (
    <>
      {currentStep !== "step3" && (
        <KeyboardAvoidingView
          style={[tw`w-screen mr-5`, styles.container]}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={[tw`rounded-full`, styles.ellipse1]} />
          <View style={[tw`rounded-full`, styles.ellipse2]} />
          <TouchableOpacity style={styles.flesh} onPress={handleReturn}>
            <AntDesign name="arrowleft" size={20} color={"#ffff"} />
          </TouchableOpacity>

          {currentStep === "step1" && (
            <>
              <View style={[styles.styleSEnregistrer, tw`mb-2`]}>
                <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 30 }}>
                  S'enregistrer
                </Text>
              </View>

              <View style={[tw``, styles.inputContainer]}>
                <TextInputs
                  placeHolder={"Nom et prénom"}
                  value={fullName}
                  onChangeText={setfullName}
                  iconName="user"
                  style={tw`mb-2`}
                />
                <TextInputs
                  placeHolder={"Email"}
                  value={email}
                  onChangeText={setemail}
                  iconName="mail"
                />
              </View>
              <PhoneInput
                handlePhonenumber={setmainPhoneNumber}
                style={tw`w-[80%] h-13`}
                placeholder={"Num téléphone principal"}
              />
              <Text
                numberOfLines={2}
                style={[
                  tw`w-[78%] mt-2`,
                  { fontFamily: "Poppins-Light", fontSize: 13 },
                ]}
              >
                Vous allez recevoir un code de verification sur votre numéro de
                téléphone principal.
              </Text>
              <PhoneInput
                handlePhonenumber={setsecondayPhoneNumber}
                style={tw`w-[80%] h-13`}
                placeholder={"Num téléphone secondaire"}
              />

              <NextBtn text={"Continuer"} onClick={handleStep1Click} />
            </>
          )}
          {currentStep === "step2" && (
            <>
              <View style={tw`flex items-start w-full ml-[15%]`}>
                <Text style={styles.title}>Entrer votre code</Text>
                <Text style={[tw`my-2`, styles.subSubtitle]}>
                  Le code SMS a été envoyer à
                </Text>
                <Text style={styles.subtitleNumber}>
                  +216 {mainPhoneNumber}
                </Text>
              </View>
              <View style={[tw`w-full items-start mt-10 `]}>
                <Text
                  style={[
                    tw`text-[#F74C00] underline ml-[9%] `,
                    { fontSize: 16 },
                  ]}
                  onPress={() => setverifycode(false)}
                >
                  Modifier mon numéro
                </Text>
                <View style={[tw`flex-row w-full px-10 mt-4  justify-evenly`]}>
                  <View
                    style={tw`border border-[${border1}] rounded-lg mx-1 w-18 h-[13] flex justify-center items-center `}
                  >
                    <TextInput
                      ref={code1}
                      style={[tw`ml-2 mt-2`, styles.numbers]}
                      autoCompleteType="tel"
                      keyboardType="numeric"
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        code2.current.focus();
                      }}
                      onFocus={() => setborder1("#FAC100")}
                      onBlur={() => setborder1("#979797")}
                      blurOnSubmit={false}
                      textContentType="telephoneNumber"
                      onChangeText={(codeNumber) => {
                        if (codeNumber.length === 1) {
                          code2.current.focus();
                          setcodeNumber1(codeNumber);
                        } else {
                          setcodeNumber1("");
                        }
                      }}
                      maxLength={1}
                    />
                  </View>
                  <View
                    style={tw`border border-[${border2}] rounded-lg mx-1 w-18  h-[13] flex justify-center items-center `}
                  >
                    <TextInput
                      ref={code2}
                      style={[tw`ml-2 mt-2`, styles.numbers]}
                      autoCompleteType="tel"
                      keyboardType="numeric"
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        code3.current.focus();
                      }}
                      onFocus={() => setborder2("#FAC100")}
                      onBlur={() => setborder2("#979797")}
                      blurOnSubmit={false}
                      focusable
                      textContentType="telephoneNumber"
                      onChangeText={(codeNumber) => {
                        if (codeNumber.length === 1) {
                          code3.current.focus();
                          setcodeNumber2(codeNumber);
                        } else {
                          setcodeNumber2("");
                        }
                      }}
                      maxLength={1}
                    />
                  </View>
                  <View
                    style={tw`border border-[${border3}] rounded-lg mx-1 w-18   h-[13] flex justify-center items-center `}
                  >
                    <TextInput
                      ref={code3}
                      style={[tw`ml-2 mt-2`, styles.numbers]}
                      autoCompleteType="tel"
                      keyboardType="numeric"
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        code4.current.focus();
                      }}
                      onFocus={() => setborder3("#FAC100")}
                      onBlur={() => setborder3("#979797")}
                      blurOnSubmit={false}
                      focusable
                      textContentType="telephoneNumber"
                      onChangeText={(codeNumber) => {
                        if (codeNumber.length === 1) {
                          code4.current.focus();
                          setcodeNumber3(codeNumber);
                        } else {
                          setcodeNumber3("");
                        }
                      }}
                      maxLength={1}
                    />
                  </View>
                  <View
                    style={tw`border border-[${border4}] rounded-lg mx-1 w-18 h-[13] flex justify-center items-center `}
                  >
                    <TextInput
                      ref={code4}
                      style={[tw`ml-2 mt-2`, styles.numbers]}
                      autoCompleteType="tel"
                      keyboardType="numeric"
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        code4.current.blur();
                      }}
                      onFocus={() => setborder4("#FAC100")}
                      onBlur={() => setborder4("#979797")}
                      blurOnSubmit={false}
                      focusable
                      textContentType="telephoneNumber"
                      onChangeText={(codeNumber) => {
                        if (codeNumber.length === 1) {
                          code4.current.blur();
                          setcodeNumber4(codeNumber);
                        } else {
                          setcodeNumber4("");
                        }
                      }}
                      maxLength={1}
                    />
                  </View>
                  {/* <View
                    style={tw`border rounded-lg mx-1 w-[12] h-[15] flex justify-center items-center `}
                  >
                    <TextInput
                      ref={code5}
                      style={[tw`ml-2 mt-2`, styles.numbers]}
                      autoCompleteType="tel"
                      keyboardType="numeric"
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        code6.current.focus();
                      }}
                      blurOnSubmit={false}
                      focusable
                      textContentType="telephoneNumber"
                      onChangeText={(codeNumber) => {
                        if (codeNumber.length === 1) {
                          code6.current.focus();
                          setcodeNumber5(codeNumber);
                        } else {
                          setcodeNumber5("");
                        }
                      }}
                      maxLength={1}
                    />
                  </View>
                  <View
                    style={tw`border rounded-lg mx-1 w-[12] h-[15] flex justify-center items-center `}
                  >
                    <TextInput
                      ref={code6}
                      style={[tw`ml-2 mt-2`, styles.numbers]}
                      autoCompleteType="tel"
                      keyboardType="numeric"
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        code1.current.blur();
                      }}
                      blurOnSubmit={false}
                      focusable
                      textContentType="telephoneNumber"
                      onChangeText={(codeNumber) => {
                        if (codeNumber.length === 1) {
                          code6.current.blur();
                          setcodeNumber6(codeNumber);
                        } else {
                          setcodeNumber6("");
                        }
                      }}
                      maxLength={1}
                    />
                  </View> */}
                </View>
              </View>
              <View style={tw`absolute bottom-5`}>
                <Text style={tw`mb-2`}>
                  Renvoi du code dans
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "Poppins-SemiBold",
                    }}
                  >
                    {" "}
                    16sec
                  </Text>
                </Text>

                <TouchableOpacity
                  style={tw` rounded-full bg-[#431879] w-[80]  p-4 flex justify-center items-center`}
                  onPress={async () => {
                    try {
                      if (
                        codeNumber1.length === 1 &&
                        codeNumber2.length === 1 &&
                        codeNumber3.length === 1 &&
                        codeNumber4.length === 1
                      ) {
                        await handleVerifyOtp(
                          codeNumber1 + codeNumber2 + codeNumber3 + codeNumber4
                        );
                      } else {
                        showMessage({
                          text: `Error: Pleas fill all the numbers`,
                          color: "red",
                        });
                      }
                    } catch (err) {
                      showMessage({
                        text: `Error: ${err.message}`,
                        color: "red",
                      });
                      console.log(err);
                    }
                  }}
                >
                  <Text style={styles.btn}>Verifier</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* {currentStep !== "step1" && (
        <View
          style={tw`absolute bottom-3 w-screen flex flex-row justify-between px-8 `}
        >
          <TouchableOpacity
            style={tw`rounded-full bg-[#fff] w-45%  p-4 flex justify-center items-center`}
            onPress={handleNext}
          >
            <Text style={[styles.btn, styles.ignore]}>Ignorer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              tw`rounded-full bg-[#431879] w-45%   p-4 flex justify-center items-center`,
            ]}
            onPress={handleNext}
          >
            <Text style={[styles.btn, styles.next]}>Suivant</Text>
          </TouchableOpacity>
        </View>
      )} */}
        </KeyboardAvoidingView>
      )}
      {currentStep === "step3" && (
        <View style={tw`w-screen h-screen flex pt-[120] items-center `}>
          <View style={[tw`rounded-full`, styles.ellipse1]} />
          <View style={[tw`rounded-full`, styles.ellipse2]} />
          <TouchableOpacity style={styles.flesh} onPress={handleReturn}>
            <AntDesign name="arrowleft" size={20} color={"#ffff"} />
          </TouchableOpacity>
          {substep === "step1" && (
            <>
              <Text
                style={{
                  width: "81%",
                  fontFamily: "Poppins-Regular",
                  fontSize: 15,
                  lineHeight: 30,
                }}
              >
                Est-ce que vous étes :
              </Text>
              <View
                key={"Radio buttons"}
                style={tw`flex flex-row w-80 items-center justify-between pr-6 my-2`}
              >
                <RadioButtons
                  title="Propriétaire"
                  value="Propriétaire"
                  onSelect={setdriverType}
                  state={driverType}
                  disabled={false}
                />
                <RadioButtons
                  title="Chauffeur Taxi"
                  value="Chauffeur Taxi"
                  onSelect={setdriverType}
                  state={driverType}
                  disabled={false}
                />
              </View>
              <Text
                style={{
                  width: "81%",
                  fontFamily: "Poppins-Regular",
                  fontSize: 15,
                  lineHeight: 30,
                }}
              >
                Numéro de l’autorisation :
              </Text>
              <TextInputs
                onChangeText={setnumAutorisation}
                placeHolder="Ex :  218 39 46 3 28"
                value={numAutorisation}
                key={"numAutorisation"}
                style={tw`w-80 my-2 bg-[#F5F5F5]`}
              />
              <Text
                style={{
                  width: "81%",
                  fontFamily: "Poppins-Regular",
                  fontSize: 15,
                  lineHeight: 30,
                }}
              >
                Matricule de la voiture :
              </Text>
              <View
                key={"matricule"}
                style={tw`flex flex-row items-center justify-evenly my-2 `}
              >
                <TextInputs
                  onChangeText={setmatricule1}
                  placeHolder="Numéro"
                  value={matricule1}
                  key={"m1"}
                  style={tw`w-25 mr-2 bg-[#F5F5F5]`}
                />
                <Text
                  style={{
                    width: "10%",
                    fontFamily: "Poppins-SemiBold",
                    fontSize: 18,
                    lineHeight: 30,
                    paddingTop: 12,
                  }}
                >
                  TUN
                </Text>
                <TextInputs
                  onChangeText={setmatricule2}
                  placeHolder="Série"
                  value={matricule2}
                  key={"m2"}
                  style={tw`w-40 ml-1 bg-[#F5F5F5]`}
                />
              </View>
            </>
          )}
          {substep == "step2" && (
            <>
              <Text
                style={{
                  width: "81%",
                  fontFamily: "Poppins-Regular",
                  fontSize: 15,
                  lineHeight: 30,
                }}
              >
                Type de la voiture*
              </Text>
              <TextInputs
                onChangeText={setcarType}
                placeHolder="Toyota Yaris"
                value={carType}
                key={"numAutorisation"}
                style={tw`w-80 my-2 bg-[#F5F5F5]`}
              />
              <Text
                style={{
                  width: "81%",
                  fontFamily: "Poppins-Regular",
                  fontSize: 15,
                  lineHeight: 30,
                }}
              >
                Gouvernorat :
              </Text>

              <PickerList
                key={"gouv"}
                selectedValue={selectedGov}
                setSelectedLanguage={setselectedGov}
                items={gouvernorats}
              />
              <Text
                style={{
                  width: "81%",
                  fontFamily: "Poppins-Regular",
                  fontSize: 15,
                  lineHeight: 30,
                }}
              >
                Ville d’activité :
              </Text>

              <PickerList
                key={"ville"}
                selectedValue={selectedVille}
                setSelectedLanguage={setselectedVille}
                items={ville}
              />
            </>
          )}
          <NextBtn text={"Continuer"} onClick={handleSave} />
        </View>
      )}
    </>
  );
};

export default CompleteProfileScreen;

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

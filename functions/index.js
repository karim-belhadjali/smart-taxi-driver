const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// http callable function (adding a request)
exports.CreateNewRide = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "only authenticated users can add requests"
    );
  }
  return admin
    .firestore()
    .collection("Current Ride")
    .doc(data.uid)
    .set({
      uid: data.uid,
      driver: {
        driverId: data.driverId,
        driverLocation: data.driverLocation,
      },
      client: {
        origin: data.origin,
        destination: data.destination,
        phoneNumber: data.phoneNumber,
      },
      price: data.price,
    });
});
// http callable function (adding a request)
exports.UpdateDriverLocation = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "only authenticated users can add requests"
    );
  }
  return admin
    .firestore()
    .collection("Current Ride")
    .doc(data.uid)
    .get()
    .then((doc) => {
      let currentDriverLocation = doc.data().driver.driverLocation;
      let newCurrentDriverLocation = {
        description: currentDriverLocation.description,
        location: { lat: data.lat, lng: data.lng, heading: data.heading },
      };
      return admin
        .firestore()
        .collection("Current Ride")
        .doc(data.uid)
        .update({
          driver: {
            driverId: doc.data().driver.driverId,
            driverLocation: newCurrentDriverLocation,
          },
        });
    });
});

exports.deleteRequestedRide = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "only authenticated users can add requests"
    );
  }
  return admin.firestore().collection("Ride Requests").doc(data.uid).delete();
});

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Expo } = require("expo-server-sdk");
admin.initializeApp();
let expo = new Expo();

exports.sendNotificationToFCMToken = functions.firestore
  .document("Ride Requests/{userID}")
  .onCreate(async (event) => {
    let result = await admin.firestore().collection("drivers").get();
    let messages = [];

    result.forEach((doc) => {
      if (doc.data().token) {
        console.log(doc.data());
        console.log("found");
        messages.push({
          to: doc.data().token,
          sound: "default",
          body: "nouvelle course disponibles",
        });
      }
    });
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    (async () => {
      for (let chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          console.error(error);
        }
      }
    })();
  });

// exports.sendmessage = functions.https.onCall(async (data, context) => {
//   let result = await admin.firestore().collection("drivers").get();
//   let messages = [];

//   result.forEach((doc) => {
//     if (doc.data().token) {
//       console.log(doc.data());
//       console.log("found");
//       messages.push({
//         to: doc.data().token,
//         sound: "default",
//         body: "nouvelle course disponibles",
//       });
//     }
//   });
//   let chunks = expo.chunkPushNotifications(messages);
//   let tickets = [];
//   (async () => {
//     for (let chunk of chunks) {
//       try {
//         let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
//         tickets.push(...ticketChunk);
//       } catch (error) {
//         console.error(error);
//       }
//     }
//   })();
// });

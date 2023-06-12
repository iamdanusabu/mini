import { initializeApp } from "https://www.gstatic.com/firebasejs/8.9.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/8.9.1/firebase-firestore.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/8.9.1/firebase-database.js";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAW_hh9ta2OJ7blpr1Xt9zcRE_rMOZKzn4",
    authDomain: "sodium-platform-316710.firebaseapp.com",
    projectId: "sodium-platform-316710",
    storageBucket: "sodium-platform-316710.appspot.com",
    messagingSenderId: "656532454851",
    appId: "1:656532454851:web:70e00457309b64555e1176"
  };
 // Initialize Firebase
  
  firebase.initializeApp(firebaseConfig);
  
  const firestore = firebase.firestore();
  const database = firebase.database();
  
  function copyCollectionToRealtimeDatabase() {
    firestore.collection("your-collection-name").get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const docRef = database.ref("your-database-path/" + doc.id);
  
          docRef.set(data)
            .then(() => {
              console.log("Document copied to Realtime Database:", doc.id);
            })
            .catch((error) => {
              console.error("Error copying document:", doc.id, error);
            });
        });
      })
      .catch((error) => {
        console.error("Error getting Firestore collection:", error);
      });
  }
  
  copyCollectionToRealtimeDatabase();
  
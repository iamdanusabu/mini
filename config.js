import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import {getFirestore, collection, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyAW_hh9ta2OJ7blpr1Xt9zcRE_rMOZKzn4",
  authDomain: "sodium-platform-316710.firebaseapp.com",
  projectId: "sodium-platform-316710",
  storageBucket: "sodium-platform-316710.appspot.com",
  messagingSenderId: "656532454851",
  appId: "1:656532454851:web:70e00457309b64555e1176"
};

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  const firestore = getFirestore(app);


   
    // Initialize Firebase
      var name = document.getElementById("name")
      var password = document.getElementById("password")
      var email = document.getElementById("email")
    
      window.signup = function(e) {
        e.preventDefault();
        var obj = {
          name: name.value,
          password: password.value,
          email: email.value,
        };
      
        createUserWithEmailAndPassword(auth, obj.email, obj.password)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log("User signed up:", user);
      
            const patientCollection = collection(firestore, "patient");
            const userDocRef = doc(patientCollection, user.uid);
      
            const patientData = {
              name: obj.name,
              email: obj.email,
            };
      
            setDoc(userDocRef, patientData)
              .then(() => {
                console.log("Patient document created in Firestore with ID:", user.uid);
                alert("Sign up success! Document ID: " + user.uid); // Display document ID as an alert
                // Perform any necessary actions after successful registration.
              })
              .catch((error) => {
                console.error("Error creating patient document:", error);
                alert("Sign up failed. Please try again.");
              });
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Sign up error:", errorCode, errorMessage);
            alert("Sign up failed. Please try again.");
          });
      
        console.log(obj);
      };
      
    
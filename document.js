import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

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
const firestore = getFirestore();

// Search Form
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const documentData = document.getElementById("document-data");

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const searchValue = searchInput.value.trim();
  const patientDocRef = doc(firestore, "patient", searchValue);
  const patientDocSnapshot = await getDoc(patientDocRef);

  if (patientDocSnapshot.exists()) {
    const patientData = patientDocSnapshot.data();
    displayPatientData(patientData);
  } else {
    displayErrorMessage("Patient not found.");
  }
});


// Function to display the patient data
// Function to display the patient data
function displayPatientData(patientData) {
    const excludedFields = ["email", "name"]; // Add the field names you want to exclude from the display
    const specificField = "name"; // Specify the field name you want to display as the title
  
    let output = "<div style='display: flex; justify-content: center; align-items: center; height: 100vh;'>";
    output += "<div>";
    output += `<h2>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspHello ${patientData[specificField]}</h2>`; // Add "Hello" in front of the specific field value
    output += "<table style='width: 150%; max-width: 800px; border-collapse: collapse; margin: 0 auto; font-size: 16px;'>";
    output += "<tr><th style='padding: 12px 16px; text-align: left; border-bottom: 1px solid #ddd; background-color: #4CAF50; color: #fff; font-weight: bold;'>Field</th><th style='padding: 12px 16px; text-align: left; border-bottom: 1px solid #ddd; background-color: #4CAF50; color: #fff; font-weight: bold;'>Value</th></tr>";
  
    Object.keys(patientData)
      .sort()
      .forEach((field) => {
        if (!excludedFields.includes(field)) {
          output += `<tr><td>${field}</td><td>${patientData[field]}</td></tr>`;
        }
      });
  
    output += "</table>";
    output += "</div>";
    output += "</div>";
    documentData.innerHTML = output;
  }
  
  function displayErrorMessage(message) {
    documentData.innerHTML = `<p>${message}</p>`;
  }
  

onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in.
      console.log("User is signed in:", user);
      // Perform any necessary actions when the user is logged in.
    } else {
      // User is signed out.
      console.log("User is signed out");
      // Perform any necessary actions when the user is logged out.
    }
  });
  
window.logout = function() {
    signOut(auth)
      .then(() => {
        // User signed out successfully.
        console.log("User signed out");
        alert("Signed out successfully!");
        // Perform any necessary actions when the user is logged out.
        window.location.href = "home.html";
    })
      .catch((error) => {
        // An error occurred during sign-out.
        console.error("Sign-out error:", error);
        alert("Sign-out failed. Please try again.");
      });
  }
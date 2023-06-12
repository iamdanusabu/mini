import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Your web app's Firebase configuration
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

// Add Field Form
const addFieldForm = document.getElementById("add-field-form");


function displayPatientData(patientData) {
  const excludedFields = ["email", "name"]; // Add the field names you want to exclude from the display
  const specificField = "name"; // Specify the field name you want to display as the title

  let output = "<div>";
  output += `<h2>Medical Records of ${patientData[specificField]}</h2>`; // Add "Hello" in front of the specific field value
  output += "<table>";
  output += "<tr><th>Serial Number</th><th>Date of Visit</th><th>Medicine Prescribed</th><th>Remarks</th><th>Hospital</th></tr>";

  Object.entries(patientData)
    .sort()
    .forEach(([field, value]) => {
      if (!excludedFields.includes(field)) {
        if (Array.isArray(value)) { 
          output += `<tr><td>${field}</td>`;
          value.forEach((item) => {
            output += `<td>${item}</td>`;
          });
          output += "</tr>";
        } else {
          output += `<tr><td>${field}</td><td>${value}</td></tr>`;
        }
      }
    });

  output += "</table>";
  output += "</div>";
  document.getElementById("documentData").innerHTML = output;
}


function displayErrorMessage(message) {
  document.getElementById("documentData").innerHTML = `<p>${message}</p>`;
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

const logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      // User signed out successfully
      console.log("User signed out");
      alert("Logged out successfully!");
      window.location.href = "home.html"; // Redirect to the desired page after logout
    })
    .catch((error) => {
      // An error occurred during logout
      console.error(error);
      alert("Logout failed. Please try again.");
    });
});

// Search Form
const searchForm = document.getElementById("search-form");

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const searchInput = document.getElementById("search-input");
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

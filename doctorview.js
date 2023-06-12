import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

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

const clashDictionary = {
    "Paracetamol": ["Entresto", "Doxycycline"],
    "Medicine B": ["Medicine D"],
    // Add more potential clashes as needed
  };
  
 // Function to check for clashes with the new value
function getClashes(newValue, patientData) {
    const clashes = [];
    Object.entries(patientData).forEach(([field, value]) => {
      if (field !== "uid" && clashDictionary[newValue]?.includes(value)) {
        clashes.push(field);
      }
      if (clashDictionary[field]?.includes(newValue)) {
        clashes.push(field);
      }
    });
    return clashes;
  }
  
  // Function to display clashes
  function displayClashes(clashes) {
    if (clashes.length !== 0) {
      let message = "There are clashes with the following values:";
      clashes.forEach((field) => {
        message += `\n- ${field}`;
      });
      alert(message);
    }
  }
  
  // Update the addFieldForm event listener code
  addFieldForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const searchValue = searchInput.value.trim();
    const patientDocRef = doc(firestore, "patient", searchValue);
    const patientDocSnapshot = await getDoc(patientDocRef);
  
    if (patientDocSnapshot.exists()) {
      const field = fieldInput.value.trim();
      const value = valueInput.value.trim();
  
      // Check for clashes with existing values
      const clashes = getClashes(value, patientDocSnapshot.data());
  
      if (clashes.length !== 0) {
        displayClashes(clashes);
        return;
      }
  
      // Update the document with the new field and value
      await setDoc(patientDocRef, { [field]: value }, { merge: true });
  
      // Clear the field inputs
      fieldInput.value = "";
      valueInput.value = "";
  
      // Display the updated patient data
      const updatedPatientDocSnapshot = await getDoc(patientDocRef);
      const updatedPatientData = updatedPatientDocSnapshot.data();
      displayPatientData(updatedPatientData);
    } else {
      displayErrorMessage("Patient not found.");
    }
  });
  
  
  
  async function checkForClashes(field, value) {
    const querySnapshot = await getDocs(collection(firestore, "patient"));
    const clashes = [];
  
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log("Data:", data); // Debugging statement
  
      if (data[field] && data[field] === value) {
        clashes.push(doc.id);
      }
    });
  
    return clashes;
  }
  
  
  // Function to check for clashes with the new value
  // Function to check for clashes with the new value
function getClashes(newValue, patientData) {
    const clashes = [];
    Object.entries(patientData).forEach(([field, value]) => {
      if (field !== "uid" && clashDictionary[newValue]?.includes(value)) {
        clashes.push(field);
      }
      if (clashDictionary[field]?.includes(newValue)) {
        clashes.push(field);
      }
    });
    return clashes;
  }
  
  
  // Function to display clashes
  function displayClashes(clashes) {
    let message = "There are clashes with the following values:";
    clashes.forEach(field => {
      message += `\n- ${field}`;
    });
    alert(message);
  }
  
  
// Function to display the patient data
function displayPatientData(patientData) {
  const excludedFields = ["email", "name"]; // Add the field names you want to exclude from the display
  const specificField = "name"; // Specify the field name you want to display as the title

  let output = "<div>";
  output += `<h2>Medical Records of ${patientData[specificField]}</h2>`; // Add "Hello" in front of the specific field value
  output += "<table>";
  output += "<tr><th>Date of Visit</th><th>Medicine Prescribed</th></tr>";

  Object.entries(patientData)
    .sort()
    .forEach(([field, value]) => {
      if (!excludedFields.includes(field)) {
        output += `<tr><td>${field}</td><td>${value}</td></tr>`;
      }
    });

  output += "</table>";
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

window.logout = function () {
  signOut(auth)
    .then(() => {
      // User signed out successfully.
      console.log("User signed out");
      alert("Signed out successfully!");
      // Perform any necessary actions when the user is logged out.
      window.location.href = "index.html";
    })
    .catch((error) => {
      // An error occurred during sign-out.
      console.error("Sign-out error:", error);
      alert("Sign-out failed. Please try again.");
    });
};

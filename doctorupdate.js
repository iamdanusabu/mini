import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

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

// Array of medications that may cause potential clashes
const potentialClashMedications = [
  ["Warfarin", "Aspirin"],
  ["Ibuprofen", "Clopidogrel"],
  ["Simvastatin", "Lisinopril"],
  ["Metformin", "Sertraline"],
  ["Alprazolam", "Omeprazole"],
  ["Metoprolol", "Levothyroxine"],
  ["Atorvastatin", "Citalopram"],
  ["Amoxicillin", "Metronidazole"],
  ["Prednisone", "Acetaminophen"],
  ["Fluoxetine", "Ranitidine"],
  ["Aspirin","Panadol"],
];

// Function to display the warning message
function displayWarningMessage(message) {
  const warningMessageElement = document.getElementById("warning-message");
  warningMessageElement.textContent = message;
  warningMessageElement.style.display = "block";

  setTimeout(() => {
    warningMessageElement.style.display = "none";
  }, 5000); // Set the timeout to 3 seconds (adjust as needed)
}

// Function to display the patient data
function displayPatientData(patientData) {
  const excludedFields = ["email", "name"]; 
  const specificField = "name"; //field name to display the title
  const medicineList = []; // Array to store the second element of each medication array

  let output = "<div>";
  output += `<h2>Medical Records of ${patientData[specificField]}</h2>`; // Add "Hello" in front of the specific field value
  output += "<table>";
  output += "<tr><th>Serial No.</th><th>Date of Visit</th><th>Medicine Prescribed </th><th>Remarks</th><th>Hospital </th></tr>";

  Object.entries(patientData)
    .sort()
    .forEach(([field, value]) => {
      if (!excludedFields.includes(field)) {
        if (Array.isArray(value)) {
          output += `<tr><td>${field}</td>`;
          value.forEach((item, index) => {
            if (index === 1) {
              medicineList.push(item); // Add the second element to the medicineList array
            }
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

  console.log("Medicine List:", medicineList);

  // Comparing medicineList with potentialClashMedications
  const potentialClashes = [];
  for (let i = 0; i < potentialClashMedications.length; i++) {
    const clashMedications = potentialClashMedications[i];
    const clashMedication1 = clashMedications[0];
    const clashMedication2 = clashMedications[1];

    if (medicineList.includes(clashMedication1) && medicineList.includes(clashMedication2)) {
      potentialClashes.push(clashMedications);
    }
  }

  // Displaying potential clashes
  if (potentialClashes.length > 0) {
    const clashMessage = `Warning: Potential medicine clash detected between the following medications: ${potentialClashes.map(clash => clash.join(' and ')).join(', ')}`;
    console.log(clashMessage);
    displayWarningMessage(clashMessage);
  } else {
    console.log("No potential medicine clashes found.");
  }
}

// Rest of the code...



// Add Field Form
const addFieldForm = document.getElementById("add-field-form");
const fieldInput = document.getElementById("field-input");
const valueInputs = document.getElementsByClassName("value-input");

addFieldForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const field = fieldInput.value.trim();
  const values = Array.from(valueInputs).map(input => input.value.trim());

  const searchInput = document.getElementById("search-input");
  const searchValue = searchInput.value.trim();
  const patientDocRef = doc(firestore, "patient", searchValue);
  const patientDocSnapshot = await getDoc(patientDocRef);

  if (patientDocSnapshot.exists()) {
    const existingData = patientDocSnapshot.data();
    const updatedData = {
      ...existingData,
      [field]: values
    };

    // Update the document with the new field and values
    await setDoc(patientDocRef, updatedData, { merge: true });

    // Clear the input fields
    fieldInput.value = "";
    Array.from(valueInputs).forEach(input => (input.value = ""));

    // Display the updated patient data
    const updatedPatientDocSnapshot = await getDoc(patientDocRef);
    const updatedPatientData = updatedPatientDocSnapshot.data();
    displayPatientData(updatedPatientData);
  } else {
    displayErrorMessage("Patient not found.");
  }
});

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
    window.location.href = "doctorlogin.html"; // Redirect to a different page when signed out
  }
});


const logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      // User signed out successfully
      console.log("User signed out");
      alert("Logged out successfully!");
      window.location.href = "doctorlogin.html"; // Redirect to the desired page after logout
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

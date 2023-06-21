// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
import { getDatabase, ref, child, get, remove } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
import { getStorage, ref as storageRef } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-storage.js";;

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAW_hh9ta2OJ7blpr1Xt9zcRE_rMOZKzn4",
    authDomain: "sodium-platform-316710.firebaseapp.com",
    projectId: "sodium-platform-316710",
    storageBucket: "sodium-platform-316710.appspot.com",
    messagingSenderId: "656532454851",
    appId: "1:656532454851:web:70e00457309b64555e1176"
  };
  
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const database = getDatabase(app);
  const storage = getStorage(app);
  const storageFileRef = storageRef(storage, 'Files/'); // Update the storage reference
  
  const loginForm = document.getElementById('loginForm');
  const dashboard = document.getElementById('dashboard');
  const registrationTable = document.getElementById('registrationTable');
  const registrationData = document.getElementById('registrationData');
  const nextButton = document.getElementById('nextButton');
  
  loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
  
      signInWithEmailAndPassword(auth, username, password)
          .then(() => {
              loginForm.reset();
              loginForm.style.display = 'none';
              dashboard.style.display = 'block';
  
              fetchDoctorRegistrations();
          })
          .catch((error) => {
              console.error(error);
              alert('Login failed. Please check your credentials.');
          });
  });
  
  async function fetchDoctorRegistrations() {
      try {
          registrationData.innerHTML = '';
  
          const snapshot = await get(child(ref(database), 'contactForm')); // Update the database reference
          if (snapshot.exists()) {
              snapshot.forEach((childSnapshot) => {
                  const registration = childSnapshot.val();
                  const { name, emailid,mbbsLicense, dob } = registration;
  
                  const row = document.createElement('tr');
                  row.innerHTML = `
                      <td>${name}</td>
                      <td>${mbbsLicense}</td>
                      <td>${dob}</td>
                      <td>
                          <button class="acceptBtn" data-email="${emailid}">Accept</button>
                          <button class="rejectBtn" data-email="${emailid}">Reject</button>
                      </td>
                  `;
  
                  registrationData.appendChild(row);
              });
  
              // Add event listeners to accept and reject buttons
              const acceptButtons = document.getElementsByClassName('acceptBtn');
              const rejectButtons = document.getElementsByClassName('rejectBtn');
  
              Array.from(acceptButtons).forEach((button) => {
                  button.addEventListener('click', acceptRegistration);
              });
  
              Array.from(rejectButtons).forEach((button) => {
                  button.addEventListener('click', rejectRegistration);
              });
          } else {
              alert('No doctor registrations found.');
          }
      } catch (error) {
          console.error(error);
          alert('Failed to fetch doctor registrations. Please try again later.');
      }
  }
  
  // ...

async function acceptRegistration() {
    const email = this.getAttribute('data-email');
    const row = this.parentNode.parentNode; // Get the parent row element
  
    try {
      // Create a user with the provided email and password
      const password = email.split('@')[0]; // Set the password as the emailid
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
  
      // Send password reset email to the user
      await sendPasswordResetEmail(auth, email);
  
      alert('Doctor registration accepted. Password reset email sent.');
  
      // Delete the doctor registration from the database
      await remove(child(ref(database), `contactForm/${email.replace('.', ',')}`));
  
      // Transition animation before removing the row from the table
      row.style.opacity = '0';
      row.style.transform = 'translateY(-20px)';
      await new Promise((resolve) => setTimeout(resolve, 500)); // Delay for transition animation
      row.remove();
    } catch (error) {
      console.error(error);
      alert('Failed to accept doctor registration. Please try again later.');
    }
  }
  
  async function rejectRegistration() {
    const email = this.getAttribute('data-email');
    const row = this.parentNode.parentNode; // Get the parent row element
  
    try {
      // Delete the doctor registration from the database
      await remove(child(ref(database), `contactForm/${email.replace('.', ',')}`));
  
      // Transition animation before removing the row from the table
      row.style.opacity = '0';
      row.style.transform = 'translateY(-20px)';
      await new Promise((resolve) => setTimeout(resolve, 500)); // Delay for transition animation
      row.remove();
  
      alert('Doctor registration rejected.');
    } catch (error) {
      console.error(error);
      alert('Failed to reject doctor registration. Please try again later.');
    }
  }
  
  // ...
  
  // Next Button
  nextButton.addEventListener('click', fetchDoctorRegistrations);
  
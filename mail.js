const firebaseConfig = {
  apiKey: "AIzaSyDcTyFqdWZMP7qNgrnYqcYZ2OIXMMHBG7g",
  authDomain: "upload-e8fed.firebaseapp.com",
  databaseURL: "https://upload-e8fed-default-rtdb.firebaseio.com",
  projectId: "upload-e8fed",
  storageBucket: "upload-e8fed.appspot.com",
  messagingSenderId: "58607096448",
  appId: "1:58607096448:web:1e38896d507d5cf0588c65",
  measurementId: "G-NCHGTERL30"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
  var contactFormDB = firebase.database().ref("contactForm");

document.getElementById("contactForm").addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();

  var name = getElementVal("name");
  var emailid = getElementVal("emailid");
  var phone = getElementVal("phone");
  var msgContent = getElementVal("msgContent");

  saveMessages(name, emailid, phone, msgContent);

  // Enable alert
  document.querySelector(".alert").style.display = "block";
  alert("Your Certificates will be Manually inspected, and your Unique Login Code will be Mailed/SMS to you");

  // Remove the alert after 3 seconds
  setTimeout(() => {
    document.querySelector(".alert").style.display = "none";
  }, 3000);

  // Reset the form
  document.getElementById("contactForm").reset();
}

const saveMessages = (name, emailid, phone, msgContent) => {
  var newContactForm = contactFormDB.push();

  newContactForm.set({
    name: name,
    emailid: emailid,
    phone: phone,
    msgContent: msgContent,
  });
};

const getElementVal = (id) => {
  return document.getElementById(id).value;
};

// Add an event listener to the file input element
document.getElementById("fileButton").addEventListener("change", function (e) {
  for (let i = 0; i < e.target.files.length; i++) {
    let imageFile = e.target.files[i];
    let storageRef = firebase.storage().ref("Files/" + imageFile.name);
    let task = storageRef.put(imageFile);

    task.on(
      "state_changed",
      function progress(snapshot) {
        let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + percentage + "% done");
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED:
            console.log("Upload is Paused");
            break;
          case firebase.storage.TaskState.RUNNING:
            console.log("Upload is RUNNING");
            break;
        }
      },
      function error(error) {
        console.log("Error occurred during upload:", error);
      },
      function complete() {
        console.log("Upload completed!");
      }
    );
  }
});

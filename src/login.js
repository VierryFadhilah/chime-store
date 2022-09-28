import { async } from "@firebase/util";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  getDoc,
  doc,
  setDoc,
  collection,
} from "firebase/firestore";

import { app } from "./index.js";

const auth = getAuth(app);

const loginForm = document.querySelector("#login");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = loginForm.emailName.value;
  const password = loginForm.passwordName.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      login(user.uid);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
});
async function login(uid) {
  const db = getFirestore(app);
  const userDoc = await getDoc(doc(db, "users", uid));
  const dataUser = userDoc.data();
  console.log(dataUser.role);

  if (dataUser.role == "admin") {
    window.location = "admin";
  } else {
    window.location = "app";
  }
}
onAuthStateChanged(auth, (user) => {
  //Autentikasi User
  if (user) {
    login(user.uid);
  } else {
  }
});

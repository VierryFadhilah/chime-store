import { app } from "./index.js";

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { async } from "@firebase/util";

const auth = getAuth(app);
const registerForm = document.querySelector("#login");

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = registerForm.emailName.value;
  const password = registerForm.passwordName.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
});

const loginPage = document.querySelector("#loginPage");
const broadcastPage = document.querySelector("#broadcastPage");

onAuthStateChanged(auth, getUser);
function getUser(user) {
  if (user) {
    var userMail = user.email;
    console.log(`Log in as ${userMail} `);
    loginPage.hidden = true;
    broadcastPage.hidden = false;
  } else {
    console.log(` logout`);
    loginPage.hidden = false;
    broadcastPage.hidden = true;
  }
}

const logOut = document.querySelector("#signOut");
const logout = () => {
  signOut(auth);
};
logOut.addEventListener("click", logout);

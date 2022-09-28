import { app } from "./index.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  setDoc,
  addDoc,
} from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const auth = getAuth(app);
onAuthStateChanged(auth, (user) => {
  //Autentikasi User
  if (user) {
    const db = getFirestore(app);
    async function getUserdata() {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const dataUser = userDoc.data();
      if (dataUser.role != "admin") {
      } else {
        window.location = "app";
      }
    }
    getUserdata();
  } else {
    load("login.html", body);
  }
});

const body = document.getElementById("body");
function load(url, element) {
  const req = new XMLHttpRequest();
  req.open("GET", url, false);
  req.send(null);

  element.innerHTML = req.responseText;
}

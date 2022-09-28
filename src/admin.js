import { app } from "./index.js";

import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

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
import { async } from "@firebase/util";

const auth = getAuth(app);
const db = getFirestore(app);

var MyApp = {};
onAuthStateChanged(auth, (user) => {
  //Autentikasi User
  if (user) {
    console.log(user.uid);
    MyApp.user = user;
  } else {
    window.location = "index";
  }
});

const tableElement = document.getElementById("tabElement");
let dataProduk = "";
async function getProduk() {
  const refProduk = doc(db, "produk", "script");

  const produk = await getDoc(refProduk);
  const produkData = Object.entries(produk.data());
  produkData.forEach(([key, val]) => {
    dataProduk += `<tr>
  <td scope="col">${key}</td>
  <td scope="col">${decodeURIComponent(val)}</td>
</tr>`;
    tableElement.innerHTML = dataProduk;
    decodeURIComponent;
  });
}
getProduk();

const submitProduk = document.querySelector("#submitProduk");
submitProduk.addEventListener("submit", async (e) => {
  const inputProduk = submitProduk.inputProdukName.value;
  const inputScript = submitProduk.inputScriptNAme.value;
  e.preventDefault();
  try {
    const docRef = await setDoc(
      doc(db, "produk", "script"),
      {
        [inputProduk]: encodeURIComponent(inputScript),
      },
      { merge: true }
    );
  } catch (e) {
    console.error("Error adding document: ", e);
  }
});
const logOut = document.getElementById("signOutBtn");
logOut.addEventListener("click", logout);
function logout() {
  signOut(auth);
}

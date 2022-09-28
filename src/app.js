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
import { getDatabase, ref, set } from "firebase/database";
const realtimeDb = getDatabase(app);
const auth = getAuth(app);

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
const logOut = document.getElementById("signOut");
logOut.addEventListener("click", logout);
function logout() {
  signOut(auth);
}

//mengambil data hari ini

function getDateToday() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = dd + "/" + mm + "/" + yyyy;
  return today;
}
// Cari nomor yang belum di gunakan di dtabase
function randNomor() {
  const items = [17, 78, 53, 11, 21, 12, 13, 23, 22, 56, 57];
  const max = 99999999;
  const min = 1000000;
  const ranNom = Math.floor(Math.random() * (max - min + 1)) + min;
  const oper = items[Math.floor(Math.random() * items.length)];
  return `628${oper}${ranNom}`;
}

// mengambil select produk dari database
const db = getFirestore(app);
const selectProduk = document.getElementById("selectProduk");
let dataProduk = "";
const getSelect = async () => {
  const refProduk = doc(db, "produk", "script");

  const produk = await getDoc(refProduk);
  const produkData = Object.entries(produk.data());
  produkData.forEach(([key, val]) => {
    dataProduk += `<option value="${key}">${key}</option>`;
  });
  selectProduk.innerHTML += dataProduk;
};

getSelect();
//menampilkan Script Text
const selectProdukElement = document.getElementById("selectProduk");
selectProdukElement.addEventListener("change", () => {
  MyApp.produk = selectProdukElement.value;
  getScript(MyApp.produk);
});

async function getScript(d) {
  const querySnapshot = await getDoc(doc(db, "produk", "script"));
  const querySnapshotData = querySnapshot.data();
  const script = querySnapshotData[d];

  const textScript = document.getElementById("textScript");
  textScript.innerHTML = decodeURIComponent(script);
  MyApp.script = script;
}

// Setting tag
const tagElement = document.getElementById("tag");
tagElement.addEventListener("change", tagDiganti);
async function tagDiganti() {
  const docRef = doc(db, "tag", tagElement.value);
  const docSnap = await getDoc(docRef);
  const dataTag = docSnap.data();

  if (docSnap.exists() && dataTag.produk == MyApp.produk) {
    MyApp.sentAmount = dataTag.sentAmount;
    getTagCount(dataTag.sentAmount);
  } else {
    await setDoc(doc(db, "tag", tagElement.value), {
      produk: MyApp.produk,
      sentAmount: 0,
      sentBy: MyApp.user.uid,
    });
    tagDiganti();
  }
}
async function getTagCount(data) {
  idCount.innerHTML = `${data}/50`;
}

function getTag() {
  var tag = tagElement.value;
  if (tag != null) {
    return tag;
  } else {
    return null;
  }
}
// ubah link saat Tombol Send di tekan

const btnKlik = document.querySelector("#klik");
btnKlik.addEventListener("click", getRandNomor);

async function getRandNomor() {
  const nomor = randNomor();

  //cari apakah nomor aktif atau tidak
  function setData(nomor) {
    set(ref(realtimeDb, "kontak/" + nomor), {
      aktif: false,
      [MyApp.user.uid]: {
        onDate: "",
        product: "",
      },
    });
  }
  setData(nomor);

  var tag = getTag();
  console.log(`nomor ${nomor} disimpan Di Database `);
  var link = `http://wa.me/${[nomor]}` + `/?text=${MyApp.script}${tag}`;
  window.location = link;
  // console.log(link);

  MyApp.nomor = nomor;
}

const idCount = document.getElementById("count");
idCount.addEventListener("click", gantiAktif);
function gantiAktif() {
  // menambahkan group Collection messageSentBy dan
  setDoc(
    doc(db, "tag", tagElement.value),
    {
      produk: MyApp.produk,
      sentAmount: MyApp.sentAmount + 1,
      sentBy: MyApp.user.uid,
    },
    { merge: true }
  );
  // mengganti status nomor aktif : true
  set(ref(realtimeDb, "kontak/" + MyApp.nomor), {
    aktif: true,
    [MyApp.user.uid]: {
      onDate: getDateToday(),
      product: MyApp.produk,
    },
  });
  console.log(MyApp.nomor + " : { aktif: true }");

  tagDiganti();
}

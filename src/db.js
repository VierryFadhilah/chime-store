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

import { async } from "@firebase/util";

import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  //Autentikasi User
  if (user) {
    const db = getFirestore(app);

    // Cari nomor yang belum di gunakan di dtabase
    function randNomor() {
      const items = [17, 78, 53, 11, 21, 12, 13, 23, 22, 56, 57];
      const max = 99999999;
      const min = 1000000;
      const ranNom = Math.floor(Math.random() * (max - min + 1)) + min;
      const oper = items[Math.floor(Math.random() * items.length)];
      return `628${oper}${ranNom}`;
    }

    // Memilih Produk
    let produkName = "";
    const selectProduk = document.getElementById("selectProduk");
    selectProduk.addEventListener("change", pilihProduk);

    function pilihProduk() {
      const selectProduk = document.getElementById("selectProduk");
      getScript(selectProduk.value);
    }

    // mengambil select produk dari database
    async function getSelectProduk() {
      const q = query(collection(db, "broadcast"), where("produk", "!=", null));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        var produk = doc.data().produk;
        produkName += `<option value="${produk}">${produk}</option>`;
      });

      const selectProduk = document.getElementById("selectProduk");
      selectProduk.innerHTML = produkName;
    }
    getSelectProduk();

    //menampilkan Script Text
    async function getScript(produkName) {
      const q = query(
        collection(db, "broadcast"),
        where("produk", "==", produkName)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        var script = doc.data().textScript;
        const textScript = document.getElementById("textScript");
        textScript.innerHTML = decodeURIComponent(script);
        MyApp.script = script;
      });
    }

    async function testLog() {
      const docRef = doc(db, "collection", "document");
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
    }
    testLog();

    // Setting tag
    const tagElement = document.getElementById("tag");

    function getTag() {
      var tag = tagElement.value;
      if (tag != null) {
        return tag;
      } else {
        return null;
      }
    }

    // ubah link saat Tombol Send di tekan
    var MyApp = {};
    const btnKlik = document.querySelector("#klik");
    btnKlik.addEventListener("click", getRandNomor);

    async function getRandNomor() {
      const docRef = doc(db, "kontak", "nomor");
      const docSnap = await getDoc(docRef);
      const nomor = randNomor();

      if (docSnap.data().hasOwnProperty(nomor)) {
        getRandNomor();
      } else {
        console.log(`Nomor ${nomor} Belum di pakai`);
      }
      var tag = getTag();
      console.log(`nomor ${nomor} disimpan Di Database `);
      var link = `http://wa.me/${[nomor]}` + `/?text=${MyApp.script}${tag}`;
      //  window.location = link;
      console.log(link);
      var userId = user.uid;
      const kontakRef = doc(db, "kontak", "nomor");
      setDoc(
        kontakRef,
        {
          [nomor]: {
            aktif: false,
            dateSend: Date.now(),
            MessageSentBy: userId,
          },
        },
        { merge: true }
      );
      MyApp.nomor = nomor;
    }

    // mengganti status nomor aktif : true
    const idCount = document.getElementById("count");
    idCount.addEventListener("click", gantiAktif);
    let count = 1;
    function gantiAktif() {
      const kontakRef = doc(db, "kontak", "nomor");
      setDoc(
        kontakRef,
        {
          [MyApp.nomor]: {
            aktif: true,
            dateSend: Date.now(),
          },
        },
        { merge: true }
      );

      console.log(MyApp.nomor + " : { aktif: true }");
      idCount.innerHTML = count++ + "/50";
    }
  } else {
    // User is signed out
    // ...
  }
});

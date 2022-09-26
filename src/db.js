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
  collectionGroup,
} from "firebase/firestore";

import { async } from "@firebase/util";

import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  //Autentikasi User
  if (user) {
    const db = getFirestore(app);
    var userId = user.uid;
    // Playground doang ini mah
    async function playGround() {}

    playGround();

    //mengambil data hari ini
    function getDateToday() {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();

      today = dd + "/" + mm + "/" + yyyy;
      return today;
    }

    getDateToday();

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
      MyApp.produk = selectProduk.value;
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
      const nomor = randNomor();

      //cari apakah nomor aktif atau tidak
      const q = query(collection(db, "kontak"), where("nomor", "!=", null));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        var allNomor = doc.data().nomor;
        if (nomor == allNomor) {
          getRandNomor();
        }
      });
      var tag = getTag();
      console.log(`nomor ${nomor} disimpan Di Database `);
      var link = `http://wa.me/${[nomor]}` + `/?text=${MyApp.script}${tag}`;
      //   window.location = link;
      console.log(link);

      try {
        const docRef = await addDoc(collection(db, "kontak"), {
          nomor: nomor,

          Aktif: false,
        });
        console.log("Document written with ID: ", docRef.id);
        MyApp.idKontak = docRef.id;
      } catch (e) {
        console.error("Error adding document: ", e);
      }

      MyApp.nomor = nomor;
    }

    var count = 1;
    const idCount = document.getElementById("count");
    idCount.addEventListener("click", gantiAktif);
    function gantiAktif() {
      // menambahkan group Collection messageSentBy
      const kontakDoc = doc(db, "kontak", MyApp.idKontak);
      const messageSnap = doc(kontakDoc, "messageSentBy", userId);
      setDoc(messageSnap, {
        dateSend: getDateToday(),
        product: MyApp.produk,
        nomor: MyApp.nomor,
      });
      // mengganti status nomor aktif : true
      setDoc(kontakDoc, { Aktif: true }, { merge: true });
      console.log(MyApp.nomor + " : { aktif: true }");
      idCount.innerHTML = count++ + "/50";
    }
  }
});

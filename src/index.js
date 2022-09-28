import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyBfxInRUiNdDkyRoOonW3bWIib3Cd2JyAc",
  authDomain: "broadcast-a8f12.firebaseapp.com",
  databaseURL:
    "https://broadcast-a8f12-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "broadcast-a8f12",
  storageBucket: "broadcast-a8f12.appspot.com",
  messagingSenderId: "924296797447",
  appId: "1:924296797447:web:08512be33c47e92ca939a2",
  measurementId: "G-VHDG9XTXR3",
};

export const app = initializeApp(firebaseConfig);

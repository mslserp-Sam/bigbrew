// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-storage.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDP3Tij236musf3kULD8aTP5teb9u0272Q",
  authDomain: "bigbrew-6e020.firebaseapp.com",
  databaseURL: "https://bigbrew-6e020-default-rtdb.firebaseio.com",
  projectId: "bigbrew-6e020",
  storageBucket: "bigbrew-6e020.appspot.com",
  messagingSenderId: "225207262647",
  appId: "1:225207262647:web:b2343894d8b92b228edc32"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage();
import { ref as ref_database, get, getDatabase, ref, set, child, update, remove } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";
import { signInWithEmailAndPassword, getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import { ref as ref_storage, getDownloadURL, uploadBytesResumable  } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-storage.js";
import { storage } from "../database.js";
const db = getDatabase();
const dbref = ref(db);
const auth = getAuth();

$('#editProductForm').on('click', function(e){
    console.log(e.target.data+ "aaaaaaa");
})
import { get, getDatabase, ref, set, child, update, remove } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";
import { signInWithEmailAndPassword, getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
const db = getDatabase();
const dbref = ref(db);
const auth = getAuth();

get(child(dbref, `Product_List`)).then((snapchat)=>{
    $('#getCategory').append(`
        <option value="" selected>Choose Category</option>
    `);
    snapchat.forEach(element => {
        $('#getCategory').append(`
                    <option value="${element.key}">${element.key}</option>
        `);
    });
    
})

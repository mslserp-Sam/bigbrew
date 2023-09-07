import { get, getDatabase, ref, set, child, update, remove, push, onValue } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";
import { signInWithEmailAndPassword, getAuth, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
const db = getDatabase();
const dbref = ref(db);
const auth = getAuth();
const date = new Date();
const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const theYear = date.getFullYear();
const theMonth = date.getMonth();
const theDate = date.getDate();
const theDay = date.getDay();
// onValue(child(dbref, `Transactions/${theYear}/${theMonth+1}/${theDate}/1/`),(snapchat) => {
//     snapchat.forEach(element => {
     
//         $('#sales').text(element.val().Sales)
//         $('#cups').text(element.val().Cups)
//     });
// },{

// });


onValue(child(dbref, `Transactions/${theYear}/${theMonth+1}/${theDate}/1/`),(snapchat) => {
    var cups = 0;
    var sales = 0;
    var trans = 0;
    snapchat.forEach(element => {
        element.forEach(data =>{
            trans += 1;
            data.forEach(data2 =>{
                sales += parseInt(data2.val().productTotal.replace('₱ ', ''));
                cups += parseInt(data2.val().productQty);
            })
        })
    });
    $('#transactions').text(trans -2)
    $('#cups').text(cups)
    $('#sales').text(sales)
},{

});




import { get, getDatabase, ref, set, child, update, remove } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";
import { signInWithEmailAndPassword, getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
const db = getDatabase();
const dbref = ref(db);
const auth = getAuth();
// signOut(auth).then(() => {
//     // Sign-out successful.
//   }).catch((error) => {
//     // An error happened.
//   });
  
onAuthStateChanged(auth, (user) => {
    if (user) {
      $('#errorLabel').hide()
      const uid = user.uid;
      
      get(child(dbref, `Account/info/${uid}`)).then((snapchat)=>{
            console.log(snapchat.val().userType)
            if(snapchat.val().userType == 2){
                location.replace("../posLogin.html")
            }else{
                location.replace("../admin/adminDashboard/dashboard.html")
            }
      })
 
    } else {
    
    }
  });

$('#loginClick').on('click', function(){
    var username = $('#email').val() + '@bigbrew.com';
    var password = $('#password').val();
    signInWithEmailAndPassword(auth, username, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        $('#errorLabel').hide()
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + errorMessage)
        $('#errorLabel').show()
    });
})
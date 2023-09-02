import { get, getDatabase, ref, set, child, update, remove } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";
import { signInWithEmailAndPassword, getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
const db = getDatabase();
const dbref = ref(db);
const auth = getAuth();
    $(document).ready(function() {
        // var pin = (+!![] + []) + (!+[] + !![] + []) + (!+[] + !![] + !![] + []) + (!+[] + !![] + !![] + !![] + []);
        var pin = "";
        var enterCode = "";
            onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/auth.user
                const uid = user.uid;
                get(child(dbref, `Account/info/${uid}`)).then((snapchat)=>{
                    console.log(snapchat.val().pinPassword)
                    pin = snapchat.val().pinPassword;
                })
                // ...
            } else {
                // User is signed out
                // ...
            }
        });
      // http://www.jsfuck.com/
//       signOut(auth).then(() => {
//     // Sign-out successful.
//   }).catch((error) => {
//     // An error happened.
//   });
      enterCode.toString();
      $('#anleitung').html("");
      $("#numbers button").click(function() {
        var clickedNumber = $(this).text().toString();
        enterCode = enterCode + clickedNumber;
        var lengthCode = parseInt(enterCode.length);
        lengthCode--;
        $("#fields .numberfield:eq(" + lengthCode + ")").addClass("active");
  
        if (lengthCode == 3) {
  
          // Check the PIN
          if (enterCode == pin) {
            // Right PIN!
            $("#fields .numberfield").addClass("right");
            $("#numbers").addClass("hide");
            $("#anleitung p").html("Amazing!<br>You entered the correct Code!");
          
            Swal.fire({
                title: 'Onhand Cash',
                input: 'text',
                inputAttributes: {
                  autocapitalize: 'off'
                },
                showCancelButton: true,
                confirmButtonText: 'Submit',
                confirmButtonColor: "#6C4A3F",
                showLoaderOnConfirm: true,
              }).then((result) => {
                if (result.isConfirmed) {
                  location.replace('pos.html')
                }
              })
          } else {
            // Wrong PIN!
            $("#fields").addClass("miss");
            enterCode = "";
            setTimeout(function() {
              $("#fields .numberfield").removeClass("active");
            }, 200);
            setTimeout(function() {
              $("#fields").removeClass("miss");
            }, 500);
            $('#anleitung').html("<p><strong>Please enter the correct PIN-Code.</strong></p>");
          }
  
        } else {}
  
      });
      
      $("#restartbtn").click(function(){
        enterCode = "";
        $("#fields .numberfield").removeClass("active");
        $("#fields .numberfield").removeClass("right");
        $("#numbers").removeClass("hide");
        // $("#anleitung p").html("<strong>Please enter the correct PIN-Code.</strong>");
      });
    });

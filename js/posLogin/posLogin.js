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
      
      enterCode.toString();      
      var counter;

      get(child(dbref, `Security/Pin/1`)).then((snapchat)=>{
        counter = snapchat.val().Pass_attempt;
      })
      .then(()=>{
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btnbtn',
          },
          buttonsStyling: false
        })       
        if(counter == "last")
        {
          $('#anleitung').html(`<span style="color: rgb(185, 35, 35);" id="adminWarn"><strong>Please contact Admin for this issue.</strong></span>`);
          $('#pincodeCircle').hide();
          swalWithBootstrapButtons.fire({
            title:'Warning',
            text:'Exceeded maxium login attempts',
            icon: 'warning',
            confirmButtonText: 'Confirm',
          })
        }
        else{
          $('#anleitung').html(` <strong>Please enter the correct PIN-Code.</strong>`);
          $('#pincodeCircle').show();
        }
        $("#numbers button").click(function() {
          
          var clickedNumber = $(this).text().toString();
          enterCode = enterCode + clickedNumber;
          var lengthCode = parseInt(enterCode.length);
          lengthCode--;
          $("#fields .numberfield:eq(" + lengthCode + ")").addClass("active");
    
          if (lengthCode == 3 && counter != 'last') {
    
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
              if(counter == 'last')
              {
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
                })
              }
              else
              {
                counter-=1;
                counter==1? counter = 'last': counter;
                // Wrong PIN!
                $("#fields").addClass("miss");
                enterCode = "";
                setTimeout(function() {
                  $("#fields .numberfield").removeClass("active");
                }, 200);
                setTimeout(function() {
                  $("#fields").removeClass("miss");
                }, 500);
                $('#anleitung').html(`<strong>Incorrect PIN-Code ${counter} remaining attempt</strong>`);
                  update(child(dbref, `Security/Pin/1`), {
                    Pass_attempt: counter
                })
              }
  
            }
    
          } else {}
    
        });
      })
      
      
      $("#restartbtn").click(function(){
        enterCode = "";
        $("#fields .numberfield").removeClass("active");
        $("#fields .numberfield").removeClass("right");
        $("#numbers").removeClass("hide");
        // $("#anleitung p").html("<strong>Please enter the correct PIN-Code.</strong>");
      });
    });

import { get, getDatabase, ref, set, child, update, remove } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";
import { signInWithEmailAndPassword, getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
const db = getDatabase();
const dbref = ref(db);
const auth = getAuth();
$(document).ready(function() 
{
  function generateSerial() {
      'use strict';
      var chars = '1234567890',
          serialLength = 10,
          randomSerial = "",
          i,
          randomNumber;
      
      for (i = 0; i < serialLength; i = i + 1) {
          
          randomNumber = Math.floor(Math.random() * chars.length);
          
          randomSerial += chars.substring(randomNumber, randomNumber + 1);
          
      }
      return randomSerial;
  }
  localStorage.clear()
  const date = new Date();
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const theYear = date.getFullYear();
  const theMonth = date.getMonth();
  const theDate = date.getDate();
  const theDay = date.getDay();

  var pin = [], enterCode = "", uid = '';
  get(child(dbref, `Pos_Accounts`)).then((snapchat)=>{
    snapchat.forEach(element => {          
      pin.push(element.val().pin);
    });
  }).then(()=>{        
    localStorage.setItem('nip',JSON.stringify(pin));
  })
  
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
    else
    {
      $('#anleitung').html(`<strong>Please enter the correct PIN-Code.</strong>`);
      $('#pincodeCircle').show();
      $("#numbers button").click(function() {
      
        var clickedNumber = $(this).text().toString();
        enterCode = enterCode + clickedNumber;
        var lengthCode = parseInt(enterCode.length);
        lengthCode--;
        $("#fields .numberfield:eq(" + lengthCode + ")").addClass("active");
        if (lengthCode == 3) {
          var pins = localStorage.getItem('nip'), pinParse = JSON.parse(pins);

          if (pinParse.includes(enterCode)) {
            // Right PIN!
            $("#fields .numberfield").addClass("right");
            $("#numbers").addClass("hide");
            $("#anleitung").html("<strong>Welcome<strong>");
          
            update(child(dbref, `Security/Pin/1`), {
              Pass_attempt: 4
            })
            get(child(dbref, `Transactions/${theYear}/${theMonth+1}/${theDate}/1`)).then((snapchat)=>{                  
              if(!snapchat.val())
              {
                Swal.fire({
                  title: 'Onhand Cash',
                  input: 'number',
                  inputAttributes: {
                    autocapitalize: 'off'
                  },
                  showCancelButton: false,
                  confirmButtonText: 'Submit',
                  confirmButtonColor: "#6C4A3F",
                  showLoaderOnConfirm: true,
                }).then((result) => {
                  if (result.isConfirmed) {
                    var trans = generateSerial();
                    localStorage.setItem('trans',trans)
                    location.replace('pos.html')
                    update(child(dbref, `Transactions/${theYear}/${theMonth+1}/${theDate}/1/`+trans), {
                      Cash_onhand: result.value
                    })
                  }
                  else{
                    location.reload();                      
                  }
                })
              }
              else
              {
                  location.replace('pos.html')
              }
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
  
        } else {}
  
      });
    }
  })
  
  
  $("#restartbtn").click(function(){
    enterCode = "";
    $("#fields .numberfield").removeClass("active");
    $("#fields .numberfield").removeClass("right");
    $("#numbers").removeClass("hide");
    // $("#anleitung p").html("<strong>Please enter the correct PIN-Code.</strong>");
  });
});

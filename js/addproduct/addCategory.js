import { ref as ref_database, get, getDatabase, ref, set, child, update, remove } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";
import { signInWithEmailAndPassword, getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import { ref as ref_storage, getDownloadURL, uploadBytesResumable  } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-storage.js";
import { storage } from "../database.js";
const db = getDatabase();
const dbref = ref(db);
const auth = getAuth();

$(document).ready(function(){
  
    $('#SubmitBtnCategory').on('click', function(){
        var reloader = $("#reloaderT").val();
        var categoryName = $('#categoryName').val();
        if(categoryName == ""){
            $('#errorCategory').css("color", "red")
            $('#errorCategory').html(`This field is required`)
        }else{
            $('#errorCategory').html(``)
        }
        if(categoryName != ""){
            var checkCategory = [];
            get(child(dbref, `Product_Category/`)).then((snapchat)=>{
                snapchat.forEach(element => {
                    element.forEach(date => {
                        checkCategory.push(date.val())
                    })
                });
            }).then(()=>{
                var checkSku = checkCategory.includes(categoryName);
                console.log(checkCategory)
                console.log(checkSku)
                if(checkSku == true){
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: `Already have Category ${categoryName} `,
                      })
                }else{
                    var result           = '';
                    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    var charactersLength = characters.length;
                    for ( var i = 0; i < 6; i++ ) {
                        result += characters.charAt(Math.floor(Math.random() * charactersLength));
                    }
                    update(child(dbref, `Product_Category/${result}`),{
                        category: categoryName
                    }).then(()=>{
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: `${categoryName} Successfully Added`,
                            showConfirmButton: false,
                            timer: 1500
                        }).then(()=>{
                            $('#categoryName').val("");
                            if(reloader == "0"){
                                $("#reloaderT").val("1");
                            }else{
                                $("#reloaderT").val("0");
                            }
                            location.reload();
                        })
                    })
                 
                }
            })
        }else{
            return;
        }

    })
})
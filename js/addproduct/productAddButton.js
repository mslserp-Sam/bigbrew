import { ref as ref_database, get, getDatabase, ref, set, child, update, remove } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";
import { signInWithEmailAndPassword, getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import { ref as ref_storage, getDownloadURL, uploadBytesResumable  } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-storage.js";
import { storage } from "../database.js";
const db = getDatabase();
const dbref = ref(db);
const auth = getAuth();


$(document).ready(function(){
    var fileItem;
    var fileName;
    $('#productImage').change(function(e){
        fileItem = e.target.files[0];
        fileName = fileItem.name;
        console.log(fileItem);
        console.log(fileName);
    })
    $('#SubmitBtn').on('click', function(){
        var productName = $('#productName').val();
        var productCategory = $('#getCategory').val();
        var prodctSku = $('#productSku').val();
        var productStatus = $('#productStatus').val();
        var productImage = $('#productImage').val();
        var productGrande = $('#productGrande').val();
        var productMedio = $('#productMedio').val();
        if(productName == ""){
            $('#errorProdName').css("color", "red")
            $('#errorProdName').html(`This field is required`)
        }else{
            $('#errorProdName').html(``)
        }
        if(productCategory == ""){
            $('#errorCategory').css("color", "red")
            $('#errorCategory').html(`This field is required`)
        }else{
            $('#errorCategory').html(``)
        }
        if(prodctSku == ""){
            $('#errorSku').css("color", "red")
            $('#errorSku').html(`This field is required`)
        }else{
            $('#errorSku').html(``)
        }
        if(productStatus == ""){
            $('#errorStatus').css("color", "red")
            $('#errorStatus').html(`This field is required`)
        }else{
            $('#errorStatus').html(``)
        }
        if(productImage == ""){
            $('#errorImage').css("color", "red")
            $('#errorImage').html(`This field is required`)
        }else{
            $('#errorImage').html(``)
        }
        if(productGrande == ""){
            $('#errorGrande').css("color", "red")
            $('#errorGrande').html(`This field is required`)
        }else{
            $('#errorGrande').html(``)
        }
        if(productMedio == ""){
            $('#errorMedio').css("color", "red")
            $('#errorMedio').html(`This field is required`)
        }else{
            $('#errorMedio').html(``)
        }
        // 
        if(productName != "" && productCategory != "" && prodctSku != "" 
        && productStatus != "" && productImage != "" && productMedio != "" && productGrande != ""){
            var CheckProduct = [];
            get(child(dbref, `Product_List/${productCategory}`)).then((snapchat)=>{
                snapchat.forEach(element => {
                    CheckProduct.push(element.key)
                });
                
            }).then(()=>{
                var checkSku = CheckProduct.includes(prodctSku);
                console.log(checkSku);
                if(checkSku == true){
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: `Already have product with SKU ${prodctSku} `,
                      })
                }else{
                    console.log(productImage.productName)
                    console.log('jabi2222')
                    const storageRef = ref_storage(storage, `Storage_Products/${productCategory}/${fileName}`);
                    const uploadTask = uploadBytesResumable(storageRef, fileItem);
                   
                    uploadTask.on('state_changed', 
                        (snapshot) => {        
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log('Upload is ' + progress + '% done');
                            switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                            }
                        }, 
                        (err) => {
                            // setToastData(()=>{
                            //     return {toastHeader: 'Something went wrong...', toastBody: err}
                            // })
                            // setShowError(true)
                            // setShowToastBg('danger')
                            // setShowToast(true)
                        }, 
                        () => {        
                            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                fileItem = "";
                                update(child(dbref, `Product_List/${productCategory}/${prodctSku}`),{

                                    Product_Category: productCategory,
                                    Product_Id: prodctSku,
                                    Product_Image: downloadURL,
                                    Product_Name: productName,
                                    Product_Status: productStatus
                                }).then(()=>{
                                    update(child(dbref, `Product_List/${productCategory}/${prodctSku}/Price_Size`),{
                                        Grande: productGrande,
                                        Medio: productMedio
                                    }).then(()=>{
                                        Swal.fire({
                                            position: 'center',
                                            icon: 'success',
                                            title: `${productCategory} Successfully Added`,
                                            showConfirmButton: false,
                                            timer: 1500
                                          }).then(()=>{
                                            $('#productName').val("");
                                            $('#productSku').val("");
                                            $('#productImage').val("");
                                            $('#productGrande').val("");
                                            $('#productMedio').val("");
                                          })
                                    })
                                })
                            });
                        }
                    );

                    
                }
            })

        }else{
            return;
        }
        

    })
})
import { ref as ref_database, get, getDatabase, ref, set, child, update, remove } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";
import { signInWithEmailAndPassword, getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import { ref as ref_storage, getDownloadURL, uploadBytesResumable  } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-storage.js";
import { storage } from "../database.js";
const db = getDatabase();
const dbref = ref(db);
const auth = getAuth();

$(document).ready(function(){
    // $("#reloaderT").on("change", function() {
    //     cateDatatable();
    //     console.log("hakdog")
    // });
    function productList(){
        get(child(dbref, `Product_List/`)).then((snapchat)=>{
            snapchat.forEach(element => {
                element.forEach(date => {
                   
                    $('#catList').append(`
                        <tr>
                            <td>
                                <label class="checkboxs">
                                    <input type="checkbox">
                                    <span class="checkmarks"></span>
                                </label>
                            </td>
                            <td class="productimgname">
                                <a href="javascript:void(0);" class="product-img">
                                    <img src="${date.val().Product_Image}" alt="product">
                                </a>
                                <a href="javascript:void(0);">${date.val().Product_Name}</a>
                            </td>
                            <td>${element.key}</td>
                            <td>Grande:${date.val().Price_Size.Grande} - Medio:${date.val().Price_Size.Medio}</td>
                            <td>
                                <a class="me-3 editClick" data-dataVal="${element.key}" data-dataName="${date.val()}">
                                    <img src="../assets/img/icons/edit.svg" alt="img">
                                </a>
                                <a class="me-3 confirm-text deleteClick" data-valDelete="${element.key}">
                                    <img src="../assets/img/icons/delete.svg" alt="img">
                                </a>
                            </td>
                        </tr>`)
                })
                $
            });
        }).then(()=>{
            if ($(".dataCatList").length > 0) {
                $(".dataCatList").DataTable({
                  bFilter: true,
                  sDom: "fBtlpi",
                  pagingType: "numbers",
                  ordering: true,
                  language: {
                    search: " ",
                    sLengthMenu: "_MENU_",
                    searchPlaceholder: "Search...",
                    info: "_START_ - _END_ of _TOTAL_ items",
                  },
                  initComplete: (settings, json) => {
                    $(".dataTables_filter").appendTo("#tableSearch");
                    $(".dataTables_filter").appendTo(".search-input");
                  },
                });
            }
            $('.editClick').on('click', function(){
                var dataid = $(this).attr('data-dataVal');
                var dataName = $(this).attr('data-dataName');
                Swal.fire({
                    title: `Edit Product`,
                    html:`
                    <div class="row">
                        <div class="col-6 float-left">
                            
                            <div class="form-group mt-2">
                            <label class="float-left">Product Name<label>
                                <input type="text" id="editNameId" value="">
                            </div>
                        </div>
                        <div class="col-6">
                            <label>Product Category<label>
                            <div class="form-group mt-2">
                                <input type="text" id="editNameId" value="">
                            </div>
                        </div>
                    </div>
                    `,
                    showDenyButton: false,
                    showCancelButton: true,
                    confirmButtonColor: '#4A332D',
                    confirmButtonText: 'Save Changes',
                    denyButtonText: `Don't save`,
                }).then((result) => {
                    var newCategory = $('#editNameId').val();
                    if (result.isConfirmed) {
                        // update(child(dbref, `Product_Category/${dataid}`),{
                        //     category: newCategory
                        // }).then(()=>{
                        //     Swal.fire('Saved!', '', 'success').then(()=>{
                        //         location.reload();
                        //     })
                        // })
                    } else if (result.isDenied) {
                    Swal.fire('Changes are not saved', '', 'info')
                    }
                })
                
            })
            // $('.deleteClick').on('click', function(){
            //     var delId = $(this).attr('data-valDelete');
            //     Swal.fire({
            //         title: 'Are you sure?',
            //         text: "You won't be able to revert this!",
            //         icon: 'warning',
            //         showCancelButton: true,
            //         confirmButtonColor: '#3085d6',
            //         cancelButtonColor: '#d33',
            //         confirmButtonText: 'Yes, delete it!'
            //       }).then((result) => {
            //         if (result.isConfirmed) {
            //             remove(child(dbref, `Product_Category/${delId}`)).then(()=>{
            //                 Swal.fire(
            //                     'Deleted!',
            //                     'Category has been deleted.',
            //                     'success'
            //                   ).then(()=>{
            //                     location.reload();
            //                   })
            //             })
                      
            //         }
            //       })
            // })
        })
    }
    productList()
})
    


/**
 * Page User List
 */
'use strict';
import { ref as ref_database, get, getDatabase, ref, set, child, update, remove } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";
import { signInWithEmailAndPassword, getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import { ref as ref_storage, getDownloadURL, uploadBytesResumable  } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-storage.js";
import { storage } from "../database.js";
const db = getDatabase();
const dbref = ref(db);
const auth = getAuth();
$('#skuError').hide();
$('#productError').hide();
$('#successHeader').hide();
$('#loaderHeader').hide();
$('#successHeader2').hide();
$('#loaderHeader2').hide();

var fileItem;
var fileName;
var filesize;
var img, file;

var _URL = window.URL || window.webkitURL;
$('#productImage').change(function(e){
    fileItem = e.target.files[0];
    fileName = fileItem.name;
    filesize = fileItem.size;

    if ((file = e.target.files[0])) {
        img = new Image();
        var objectUrl = _URL.createObjectURL(file);
        img.onload = function () {
            
            if(this.width != 500 && this.height != 500){
              $('#productImage').val('');
              $('#errorImage').html(`Image must be 500x500 pixel size`)
            }else{
              $('#errorImage').hide();
            }
            _URL.revokeObjectURL(objectUrl);
        };
        img.src = objectUrl;
        
    }
   
})
$('#addNewUserForm').on('submit', function(){
    $('#skuError').hide();
    $('#productError').hide();
    var category = $('#selectCategory').val()
    var prodctSku = $('#productSku').val()
    var productName = $('#productName').val()
    var productGrande = $('#productGrande').val()
    var productMedio = $('#productMedio').val()
    var productStatus = $('#status').val()
    var CheckProductSku = [];
    var CheckProduct = [];
    get(child(dbref, `Product_List/${category}`)).then((snapchat)=>{
      snapchat.forEach(element => {
        CheckProductSku.push(element.key)
        CheckProduct.push(element.val().Product_Name)
      });
    }).then(()=>{
        var checkSku = CheckProductSku.includes(prodctSku);
        var checkProd = CheckProduct.includes(productName);
      
        if(checkSku == true){
          $('#skuError').show();
          $('#skuError').html(`Already have product with SKU ${prodctSku}`);
        }
        if(checkProd == true){
          $('#productError').show();
          $('#productError').html(`Already have product name ${productName}`);
        }
        if(checkSku == false && checkProd == false){
          const storageRef = ref_storage(storage, `Storage_Products/${category}/${fileName}`);
          const uploadTask = uploadBytesResumable(storageRef, fileItem);
          
          uploadTask.on('state_changed', 
              (snapshot) => {        
                  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log('Upload is ' + progress + '% done');
                  $('#loaderHeader').show();
                  $('#loaderHeader').html(``);
                  $('#loaderHeader').append(`Upload is ${progress}% done`);
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
                      update(child(dbref, `Product_List/${category}/${prodctSku}`),{
                          Product_Category: category,
                          Product_Id: prodctSku,
                          Product_Image: downloadURL,
                          Product_Name: productName,
                          Product_Status: productStatus
                      }).then(()=>{
                          update(child(dbref, `Product_List/${category}/${prodctSku}/Price_Size`),{
                              Grande: productGrande,
                              Medio: productMedio
                          }).then(()=>{
                              console.log("success")
                              $('#successHeader').show();
                              $('#loaderHeader').hide();
                              $('.datatables-users').DataTable().destroy();
                              $('#dataTable tbody').empty();
                              getDataAll()
                          })
                      })
                  });
              }
          );
        }
    })
})
$('#editProductForm').on('submit', ()=>{
  var product_name1 = $('#modal-product-name').val();
  var product_category1 = $("#modal-product-category").val();
  var product_grande1 = $('#modal-product-grande').val();
  var product_medio1 = $('#modal-product-medio').val();
  var product_sku1 = $('#modal-product-sku').val();
  var product_status1 = $('#modal-product-status').is(':checked');

  var product_old_sku1 = $('#modal-product-oldsku').val();
  var product_old_image1 = $('#modal-product-oldimage').val();
  var product_old_category1 = $('#modal-product-oldcategory').val();
  var newStatus;
  if(product_status1 == true){
    newStatus = "Open"
  }else{
    newStatus = "Close"
  }
  remove(child(dbref, `Product_List/${product_old_category1}/${product_old_sku1}`)).then(()=>{
   
  }).then(()=>{
    update(child(dbref, `Product_List/${product_category1}/${product_sku1}`),{
      Product_Name:product_name1,
      Product_Category:product_category1,
      Product_Id:product_sku1,
      Product_Image:product_old_image1,
      Product_Status:newStatus
    }).then(()=>{
      update(child(dbref, `Product_List/${product_category1}/${product_sku1}/Price_Size`),{
          Grande:product_grande1,
          Medio:product_medio1
      }).then(()=>{
        $('#successHeader2').show();
        $('.datatables-users').DataTable().destroy();
        $('#dataTable tbody').empty();
        getDataAll()
      })
    })

  })

})
get(child(dbref, `Product_Category`)).then((snapchat)=>{
  snapchat.forEach(element =>{
   
    $('#modal-product-category').append(`
      <option value="${element.key}">${element.val().category}</option>
    `)
    $('#selectCategory').append(`
      <option value="${element.key}">${element.val().category}</option>
    `)
    
  })

}).then(()=>{
  
})

function getDataAll(){
  
  var tableData = [];
  get(child(dbref, `Product_List`)).then((snapchat)=>{
    snapchat.forEach(element => {
      element.forEach(date => {
        var tempCat = '';
        get(child(dbref, `Product_Category/${element.key}`)).then((val)=>{
          tempCat = val.val().category;
        }).then(()=>{
          tableData.push({
            "id": date.key,
              "product_category": date.val().Product_Category,
              "product_name": date.val().Product_Name,
              "status": date.val().Product_Status,
              "avatar": date.val().Product_Image,
              "product_medio": date.val().Price_Size.Medio,
              "product_grande": date.val().Price_Size.Grande,
              "product_sku": date.key,
              "product_category_name": tempCat
          })
          localStorage.setItem('dataTable', JSON.stringify(tableData));
          
          // console.log(tableData)
        })        
      })
    });
     
  }).then(()=>{
    var tableDatas = JSON.parse(localStorage.getItem('dataTable'));
    // console.log(tableDatas)
    let borderColor, bodyBg, headingColor;
    if (isDarkStyle) {
      borderColor = config.colors_dark.borderColor;
      bodyBg = config.colors_dark.bodyBg;
      headingColor = config.colors_dark.headingColor;
    } else {
      borderColor = config.colors.borderColor;
      bodyBg = config.colors.bodyBg;
      headingColor = config.colors.headingColor;
    }
  
    // Variable declaration for table
    var dt_user_table = $('.datatables-users'),
      select2 = $('.select2'),
      userView = 'app-user-view-account.html',
      statusObj = {
        "Open": { title: 'Active', class: 'bg-label-success' },
        "Close": { title: 'Inactive', class: 'bg-label-secondary' }
      };
  
    if (select2.length) {
      var $this = select2;
      $this.wrap('<div class="position-relative"></div>').select2({
        placeholder: 'Select Country',
        dropdownParent: $this.parent()
      });
    }
  
    
    // Users datatable
    if (dt_user_table.length) {
      var dt_user = dt_user_table.DataTable({
        // ajax: assetsPath + 'json/user-list.json', // JSON file to add data
        columns: [
          // columns according to JSON
          { data: '' },
          { data: 'product_category' },
          { data: 'product_name' },
          { data: 'status' },
          { data: 'action' }
        ],
        data: tableDatas,
        columnDefs: [
          {
            // For Responsive
            className: 'control',
            searchable: false,
            orderable: false,
            responsivePriority: 2,
            targets: 0,
            render: function (data, type, full, meta) {
              return '';
            }
          },
          {
            targets: 1,
            responsivePriority: 4,
            render: function (data, type, full, meta) {
              
              var $name = full['product_category_name'],
                $image = null;
              if ($image) {
                // For Avatar image
                var $output =
                  '<img src="' + $image + '" alt="Avatar" class="rounded-circle">';
              } else {
                // For Avatar badge
                var stateNum = Math.floor(Math.random() * 6);
                var states = ['success', 'danger', 'warning', 'info', 'primary', 'secondary'];
                var $state = states[stateNum],
                  $name = full['product_category_name'],
                  $initials = $name.match(/\b\w/g) || [];
                $initials = (($initials.shift() || '') + ($initials.pop() || '')).toUpperCase();
                $output = '<span class="avatar-initial rounded-circle bg-label-' + $state + '">' + $initials + '</span>';
              }
              // Creates full output for row
              var $row_output =
                '<div class="d-flex justify-content-start align-items-center user-name">' +
                '<div class="avatar-wrapper">' +
                '<div class="avatar me-3">' +
                $output +
                '</div>' +
                '</div>' +
                '<div class="d-flex flex-column">' +
                '<a href="' +
                userView +
                '" class="text-body text-truncate"><span class="fw-medium">' +
                $name +
                '</span></a>' +
                '</div>' +
                '</div>';
              return $row_output;
            }
          },
          {
            // User full name and email
            targets: 2,
            responsivePriority: 4,
            render: function (data, type, full, meta) {
              var $name = full['product_name'],
                $image = full['avatar'];
              if ($image) {
                // For Avatar image
                var $output =
                  '<img src="' + $image + '" alt="Avatar" class="rounded-circle">';
              } else {
                // For Avatar badge
                var stateNum = Math.floor(Math.random() * 6);
                var states = ['success', 'danger', 'warning', 'info', 'primary', 'secondary'];
                var $state = states[stateNum],
                  $name = full['product_name'],
                  $initials = $name.match(/\b\w/g) || [];
                $initials = (($initials.shift() || '') + ($initials.pop() || '')).toUpperCase();
                $output = '<span class="avatar-initial rounded-circle bg-label-' + $state + '">' + $initials + '</span>';
              }
              // Creates full output for row
              var $row_output =
                '<div class="d-flex justify-content-start align-items-center user-name">' +
                '<div class="avatar-wrapper">' +
                '<div class="avatar me-3">' +
                $output +
                '</div>' +
                '</div>' +
                '<div class="d-flex flex-column">' +
                '<a href="' +
                userView +
                '" class="text-body text-truncate"><span class="fw-medium">' +
                $name +
                '</span></a>' +
                '</div>' +
                '</div>';
              return $row_output;
            }
          },
          {
            // User Status
            targets: 3,
            render: function (data, type, full, meta) {
              var $status = full['status'];
  
              return (
                '<span class="badge ' +
                statusObj[$status].class +
                '" text-capitalized>' +
                statusObj[$status].title +
                '</span>'
              );
            }
          },
          {
            // Actions
            targets: 4,
            title: 'Actions',
            searchable: false,
            orderable: false,
            render: function (data, type, full, meta) {
              return (
                '<div class="d-flex align-items-center">' +
                `<a href="javascript:;" class="text-body EditClick" 
                data-data-category="${full['product_category']}"
                data-data-name="${full['product_name']}"
                data-data-status="${full['status']}"
                data-data-grande="${full['product_grande']}"
                data-data-medio="${full['product_medio']}"
                data-data-image="${full['avatar']}"
                data-data-sku="${full['product_sku']}"
                data-bs-toggle="modal" data-bs-target="#editUser"><i class="ti ti-edit ti-sm me-2"></i></a>` +
                `<a href="javascript:;" class="text-body delete-record" 
                data-data-skuid="${full['product_sku']}"
                data-data-categoryid="${full['product_category']}"><i class="ti ti-trash ti-sm mx-2"></i></a>` +
                '<a href="javascript:;" class="text-body dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-sm mx-1"></i></a>' +
                '<div class="dropdown-menu dropdown-menu-end m-0">' +
                '<a href="' +
                userView +
                '" class="dropdown-item">View</a>' +
                '<a href="javascript:;" class="dropdown-item">Suspend</a>' +
                '</div>' +
                '</div>'
              );
            }
          }
        ],
        order: [[1, 'desc']],
        dom:
          '<"row me-2"' +
          '<"col-md-2"<"me-3"l>>' +
          '<"col-md-10"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-3 mb-md-0"fB>>' +
          '>t' +
          '<"row mx-2"' +
          '<"col-sm-12 col-md-6"i>' +
          '<"col-sm-12 col-md-6"p>' +
          '>',
        language: {
          sLengthMenu: '_MENU_',
          search: '',
          searchPlaceholder: 'Search..'
        },
        // Buttons with Dropdown
        buttons: [
          {
            extend: 'collection',
            className: 'btn btn-label-secondary dropdown-toggle mx-3',
            text: '<i class="ti ti-screen-share me-1 ti-xs"></i>Export',
            buttons: [
              {
                extend: 'print',
                text: '<i class="ti ti-printer me-2" ></i>Print',
                className: 'dropdown-item',
                exportOptions: {
                  columns: [1, 2, 3, 4, 5],
                  // prevent avatar to be print
                  format: {
                    body: function (inner, coldex, rowdex) {
                      if (inner.length <= 0) return inner;
                      var el = $.parseHTML(inner);
                      var result = '';
                      $.each(el, function (index, item) {
                        if (item.classList !== undefined && item.classList.contains('user-name')) {
                          result = result + item.lastChild.firstChild.textContent;
                        } else if (item.innerText === undefined) {
                          result = result + item.textContent;
                        } else result = result + item.innerText;
                      });
                      return result;
                    }
                  }
                },
                customize: function (win) {
                  //customize print view for dark
                  $(win.document.body)
                    .css('color', headingColor)
                    .css('border-color', borderColor)
                    .css('background-color', bodyBg);
                  $(win.document.body)
                    .find('table')
                    .addClass('compact')
                    .css('color', 'inherit')
                    .css('border-color', 'inherit')
                    .css('background-color', 'inherit');
                }
              },
              {
                extend: 'csv',
                text: '<i class="ti ti-file-text me-2" ></i>Csv',
                className: 'dropdown-item',
                exportOptions: {
                  columns: [1, 2, 3, 4, 5],
                  // prevent avatar to be display
                  format: {
                    body: function (inner, coldex, rowdex) {
                      if (inner.length <= 0) return inner;
                      var el = $.parseHTML(inner);
                      var result = '';
                      $.each(el, function (index, item) {
                        if (item.classList !== undefined && item.classList.contains('user-name')) {
                          result = result + item.lastChild.firstChild.textContent;
                        } else if (item.innerText === undefined) {
                          result = result + item.textContent;
                        } else result = result + item.innerText;
                      });
                      return result;
                    }
                  }
                }
              },
              {
                extend: 'excel',
                text: '<i class="ti ti-file-spreadsheet me-2"></i>Excel',
                className: 'dropdown-item',
                exportOptions: {
                  columns: [1, 2, 3, 4, 5],
                  // prevent avatar to be display
                  format: {
                    body: function (inner, coldex, rowdex) {
                      if (inner.length <= 0) return inner;
                      var el = $.parseHTML(inner);
                      var result = '';
                      $.each(el, function (index, item) {
                        if (item.classList !== undefined && item.classList.contains('user-name')) {
                          result = result + item.lastChild.firstChild.textContent;
                        } else if (item.innerText === undefined) {
                          result = result + item.textContent;
                        } else result = result + item.innerText;
                      });
                      return result;
                    }
                  }
                }
              },
              {
                extend: 'pdf',
                text: '<i class="ti ti-file-code-2 me-2"></i>Pdf',
                className: 'dropdown-item',
                exportOptions: {
                  columns: [1, 2, 3, 4, 5],
                  // prevent avatar to be display
                  format: {
                    body: function (inner, coldex, rowdex) {
                      if (inner.length <= 0) return inner;
                      var el = $.parseHTML(inner);
                      var result = '';
                      $.each(el, function (index, item) {
                        if (item.classList !== undefined && item.classList.contains('user-name')) {
                          result = result + item.lastChild.firstChild.textContent;
                        } else if (item.innerText === undefined) {
                          result = result + item.textContent;
                        } else result = result + item.innerText;
                      });
                      return result;
                    }
                  }
                }
              },
              {
                extend: 'copy',
                text: '<i class="ti ti-copy me-2" ></i>Copy',
                className: 'dropdown-item',
                exportOptions: {
                  columns: [1, 2, 3, 4, 5],
                  // prevent avatar to be display
                  format: {
                    body: function (inner, coldex, rowdex) {
                      if (inner.length <= 0) return inner;
                      var el = $.parseHTML(inner);
                      var result = '';
                      $.each(el, function (index, item) {
                        if (item.classList !== undefined && item.classList.contains('user-name')) {
                          result = result + item.lastChild.firstChild.textContent;
                        } else if (item.innerText === undefined) {
                          result = result + item.textContent;
                        } else result = result + item.innerText;
                      });
                      return result;
                    }
                  }
                }
              }
            ]
          },
          {
            text: '<i class="ti ti-plus me-0 me-sm-1 ti-xs"></i><span class="d-none d-sm-inline-block">Add New Product</span>',
            className: 'add-new btn btn-primary',
            attr: {
              'data-bs-toggle': 'offcanvas',
              'data-bs-target': '#offcanvasAddUser'
            }
          }
        ],
        // For responsive popup
        responsive: {
          details: {
            display: $.fn.dataTable.Responsive.display.modal({
              header: function (row) {
                var data = row.data();
                return 'Details of ' + data['product_name'];
              }
            }),
            type: 'column',
            renderer: function (api, rowIdx, columns) {
              var data = $.map(columns, function (col, i) {
                return col.title !== '' // ? Do not show row in modal popup if title is blank (for check box)
                  ? '<tr data-dt-row="' +
                      col.rowIndex +
                      '" data-dt-column="' +
                      col.columnIndex +
                      '">' +
                      '<td>' +
                      col.title +
                      ':' +
                      '</td> ' +
                      '<td>' +
                      col.data +
                      '</td>' +
                      '</tr>'
                  : '';
              }).join('');
  
              return data ? $('<table class="table"/><tbody />').append(data) : false;
            }
          }
        },
        initComplete: function () {
          // Adding role filter once table initialized
          // Adding plan filter once table initialized
         
          // Adding status filter once table initialized
         
        }
      });
    }
  
    // Delete Record
    $('.datatables-users tbody').on('click', '.delete-record', function () {
      var skuid = $(this).data('data-skuid'),
          categoryid = $(this).data('data-categoryid');
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          remove(child(dbref, `Product_List/${categoryid}/${skuid}`),{
           
          }).then(()=>{
            Swal.fire(
              'Deleted!',
              'Your product has been deleted.',
              'success'
            )
            dt_user.row($(this).parents('tr')).remove().draw();
          })
          
        }
      })
      // dt_user.row($(this).parents('tr')).remove().draw();
    });
    $('.EditClick').on('click', function(e){
        var category = $(this).data('data-category');
        var name = $(this).data('data-name');
        var status = $(this).data('data-status');
        var medio = $(this).data('data-medio');
        var grande = $(this).data('data-grande');
        var image = $(this).data('data-image');
        var sku = $(this).data('data-sku');
        $('#modal-product-name').val(name);
        $("#modal-product-category").val(category).change();
        $('#modal-product-grande').val(grande);
        $('#modal-product-medio').val(medio);
        $('#modal-product-sku').val(sku);
        $('#modal-product-oldimage').val(image);
        $('#modal-product-oldcategory').val(category);
        $('#modal-product-oldsku').val(sku);
        if(status == "Open"){
          $( "#modal-product-status" ).prop( "checked", true );
        }else{
          $( "#modal-product-status" ).prop( "checked", false );
        }
        
    })
    
   
 
    // Filter form control to default size
    // ? setTimeout used for multilingual table initialization
    setTimeout(() => {
      $('.dataTables_filter .form-control').removeClass('form-control-sm');
      $('.dataTables_length .form-select').removeClass('form-select-sm');
    }, 300);
  });
}

getDataAll();
// Validation & Phone mask
(function () {
  const phoneMaskList = document.querySelectorAll('.phone-mask'),
    addNewUserForm = document.getElementById('addNewUserForm');

  // Phone Number
  if (phoneMaskList) {
    phoneMaskList.forEach(function (phoneMask) {
      new Cleave(phoneMask, {
        phone: true,
        phoneRegionCode: 'US'
      });
    });
  }
  // Add New User Form Validation
  const fv = FormValidation.formValidation(addNewUserForm, {
    fields: {
      userFullname: {
        validators: {
          notEmpty: {
            message: 'Please enter fullname '
          }
        }
      },
      userEmail: {
        validators: {
          notEmpty: {
            message: 'Please enter your email'
          },
          emailAddress: {
            message: 'The value is not a valid email address'
          }
        }
      }
    },
    plugins: {
      trigger: new FormValidation.plugins.Trigger(),
      bootstrap5: new FormValidation.plugins.Bootstrap5({
        // Use this for enabling/changing valid/invalid class
        eleValidClass: '',
        rowSelector: function (field, ele) {
          // field is the field name & ele is the field element
          return '.mb-3';
        }
      }),
      submitButton: new FormValidation.plugins.SubmitButton(),
      // Submit the form when all fields are valid
      // defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
      autoFocus: new FormValidation.plugins.AutoFocus()
    }
  });
})


// Datatable (jquery)

  


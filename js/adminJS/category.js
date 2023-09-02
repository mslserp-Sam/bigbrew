/**
 * Page User List
 */
'use strict';
import { get, getDatabase, ref, set, child, update, remove, push } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";
import { signInWithEmailAndPassword, getAuth, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
const db = getDatabase();
const dbref = ref(db);
const auth = getAuth();
$('#catError').hide();
$('#catError2').hide();
$('#successHeader').hide();
$('#successHeaderUpdate').hide();
$('#addNewUserForm').on('submit', function(){
  var cateName = $('#categoryName').val();
  var checkCategory = [];
  get(child(dbref, `Product_Category/`)).then((snapchat)=>{
      snapchat.forEach(element => {
          element.forEach(date => {
              checkCategory.push(date.val())
          })
      });
  }).then(()=>{
      var checkSku = checkCategory.includes(cateName);
      if(checkSku == true){
        $('#catError').show();
        $('#catError').html(`Already have Category ${cateName}`);
      }else{
          $('#catError').hide();
          $('#catError').html("");
          
          push(child(dbref, `Product_Category`),{
              category: cateName
          }).then(()=>{
            // success
            $('#successHeader').show();
            $('.datatables-users').DataTable().destroy();
            $('#dataTable tbody').empty();
            getDataAll();
          })
      }
  })
})
$('#updateCategory').on('submit', function(){
  var cateName = $('#modal-category').val();
  var cateid = $('#modal-id').val();
  var checkCategory = [];
  get(child(dbref, `Product_Category/`)).then((snapchat)=>{
      snapchat.forEach(element => {
          element.forEach(date => {
              checkCategory.push(date.val())
          })
      });
  }).then(()=>{
      var checkSku = checkCategory.includes(cateName);
      if(checkSku == true){
          $('#catError2').show();
        $('#catError2').html(`Already have Category ${cateName}`);
      }else{
          $('#catError2').hide();
          $('#catError2').html("");
          
          update(child(dbref, `Product_Category/${cateid}`),{
              category: cateName
          }).then(()=>{
            // success
            $('#successHeaderUpdate').show();
            $('.datatables-users').DataTable().destroy();
            $('#dataTable tbody').empty();
            getDataAll();
          })
      }
  })
})
get(child(dbref, `Branches`)).then((snapchat)=>{
  
  snapchat.forEach(element =>{
    $('#user-branch').append(`
      <option value="${element.key}">${element.val().Branch_Name}</option>
    `)
  })

}).then(()=>{
  
})
function getDataAll(){
  var tableData = [];
  get(child(dbref, `Product_Category`)).then((snapchat)=>{
    snapchat.forEach(element => {
        tableData.push({
              "id": element.key,
                "category_name": element.val().category,
                "status": "3",
                "avatar": ""
            })
      
    });
     
  }).then(()=>{
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
        1: { title: 'Pending', class: 'bg-label-warning' },
        2: { title: 'Active', class: 'bg-label-success' },
        3: { title: 'Inactive', class: 'bg-label-secondary' }
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
          { data: 'category_name' },
          { data: 'action' }
        ],
        data: tableData,
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
            // User full name and email
            targets: 1,
            responsivePriority: 4,
            render: function (data, type, full, meta) {
              var $name = full['category_name'],
                $image = full['avatar'];
              if ($image) {
                // For Avatar image
                var $output =
                  '<img src="' + assetsPath + 'img/avatars/' + $image + '" alt="Avatar" class="rounded-circle">';
              } else {
                // For Avatar badge
                var stateNum = Math.floor(Math.random() * 6);
                var states = ['success', 'danger', 'warning', 'info', 'primary', 'secondary'];
                var $state = states[stateNum],
                  $name = full['category_name'],
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
            // Actions
            targets: 2,
            title: 'Actions',
            searchable: false,
            orderable: false,
            render: function (data, type, full, meta) {
              return (
                '<div class="d-flex align-items-center">' +
                `<a href="javascript:;" class="text-body editClick"
                data-data-id="${full['id']}"
                data-data-category="${full['category_name']}"
                data-bs-toggle="modal" data-bs-target="#editUser"
                ><i class="ti ti-edit ti-sm me-2"></i></a>` +
                `<a href="javascript:;" class="text-body delete-record"
                data-data-categoryid="${full['id']}"
                ><i class="ti ti-trash ti-sm mx-2"></i></a>` +
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
            text: '<i class="ti ti-plus me-0 me-sm-1 ti-xs"></i><span class="d-none d-sm-inline-block">Add New Category</span>',
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
                return 'Details of ' + data['category_name'];
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
      var categoryid = $(this).data('data-categoryid');
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
          remove(child(dbref, `Product_Category/${categoryid}`),{
           
          }).then(()=>{
            Swal.fire(
              'Deleted!',
              'Your Category has been deleted.',
              'success'
            )
            dt_user.row($(this).parents('tr')).remove().draw();
          })
          
        }
      })
      // dt_user.row($(this).parents('tr')).remove().draw();
    });
  
    $('.datatables-users tbody').on('click', '.editClick', function () {
      var categorid = $(this).data('data-id');
      var category = $(this).data('data-category');
      console.log(categorid)
      $('#modal-category').val(category);
      $('#modal-id').val(categorid);
    });
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

  


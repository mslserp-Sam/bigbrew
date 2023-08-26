import { get, getDatabase, ref, set, child, update, remove } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";
import { signInWithEmailAndPassword, getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
const db = getDatabase();
const dbref = ref(db);
const auth = getAuth();
//category
get(child(dbref, `Product_List`)).then((snapchat)=>{
    snapchat.forEach(category => {
        var TheCat = category.key; 
        var datacat = TheCat.replaceAll(' ', '');
        $(".category_container").append(`
            <li class="categoryClick" id="${datacat}" data-dataclick="${category.key}" data-datacheck="" style="margin-right: 10px;">
                <div class="product-details ">
                    <h6>${category.key}</h6>
                </div>
            </li>`);
    });
}).then(()=>{
    $('.categoryClick').on('click', function(){
        var thisDataValue = $(this).data('dataclick');
        $('.category_container li').removeClass('active');
        $(this).addClass('active');
        $('.all_products').show();
        allProducts(thisDataValue);
    })
    $('#all_products').on('click', function(){
        $('.allprod').html('');
        $('.all_products').show();
        $('.category_container li').removeClass('active');
        $(this).addClass('active')
        allProducts('wala');
    });
    
})


//get all products
function allProducts(key){
    var listKey = key;
    $('.allprod').html('');
    if(listKey == 'wala'){
        get(child(dbref, `Product_List`)).then((snapchat)=>{
            snapchat.forEach(element => {
                element.forEach(datas=>{
                    $('.allprod').append(`
                    <div class="col-lg-3 d-flex Container5">
                        <div class="productset flex-fill"
                                data-data-productname="${datas.val().Product_Name}"
                                data-data-productgrande="${datas.val().Price_Size.Grande}"
                                data-data-productmedio="${datas.val().Price_Size.Medio}"
                                data-data-productImage="${datas.val().Product_Image}">

                            <div class="productsetimg">
                                <img src="${datas.val().Product_Image}" alt="img">
                                <h6>Qty: 5.00</h6>
                                <div class="check-product">
                                    <i class="fa fa-check"></i>
                                </div>
                            </div>
                            <div class="productsetcontent">
                                <h4>${datas.val().Product_Name}</h4>
                            </div>
                        </div>
                    </div>`)
                    // datas.forEach(nelement => {
                    //       console.log(datas.val())
                        
                    // });
                })
            });
        }).then(()=>{
            $('.productset').on('click', function(){
                var prodName = $(this).data('data-productname');
                var prodGrande = $(this).data('data-productgrande');
                var prodMedio = $(this).data('data-productmedio');
                var forImage = $(this).data('data-productimage');
                var prodAdds = 9;
                var price = 0;
                var totalPrice = prodGrande;
                var totalQuan = 1;
                var basePrice = prodGrande;
                var baseQuantity = 1;
                var totallPrice = 0;
                $('.addsOnClass').html('');
                
                Swal.fire({
                    title: prodName,
                    html: `
                    <hr>
                    <div>
                        <div class="row">
                            <div class="col-6">
                                <div>
                                    <label >Quantity</label>
                                        <div class="pt-2 pb-3">
                                            <button type="button" class="btn-minus btn btn-light" style="background-color: #4A332D !important; color: #fff;">-</button>
                                            <label class="p-2 quan" style="font-weight: 900; font-size: 20px;">${totalQuan}</label>
                                            <button type="button" class="btn-add btn btn-light" style="background-color: #4A332D !important; color: #fff;">+</button>
                                        </div>
                                    </div>
                                </div>
                            <div class="col-6">
                                <label >Add-Ons</label>
                                <div class="addsOnClass justify-content-start w-100">
                                </div>
                            </div>
                        </div>

                        
                        <hr>
                        <label class="justify-content-start">Size</label>
                        <div class="d-flex justify-content-center pb-2">
                            <div id="checklist" class="size1">
                                <input  value="1" name="r" type="radio" checked="" id="01">
                                <label for="01">Grande -Price: ${prodGrande}</label>
                                <input type="hidden" id="grandeCb" value="1"/>
                                <input type="hidden" id="gandePriceV" value="${prodGrande}"/>
                            </div>
                            <div id="checklist" class="size2">
                                <input  value="2" name="r" type="radio" id="02">
                                <label for="02">Medio -Price: ${prodMedio}</label>
                                <input type="hidden" id="medioCb" value="0"/>
                                <input type="hidden" id="medioPriceV" value="${prodMedio}"/>
                            </div>
                        </div>
                            
                        <div>
                        <div>
                        <hr>
                        <div id="sweetCard" class="p-2">
                            <label style="float: left; font-weight: 900;">Total Price:</label>
                            <label style="float: right; font-weight: 900;" id="getTotal">${prodGrande}</label>
                        </div>
                    </div>
                    <input type="hidden" id="forImage" value="${forImage}" />
                    <input type="hidden" id="forName" value="${prodName}" />
                    
                    `,
                    showCancelButton: true,
                    confirmButtonColor: '#4A332D',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Confirm'
                }).then((result) => {
                    if (result.isConfirmed) {
                        var getTotalPrice = parseInt($('#getTotal').html());
                        var getImage = $('#forImage').val();
                        var getName = $('#forName').val();
                        var getQuantity = parseInt($('.quan').html());
                        $('.product-table').append(`
                                <ul class="product-lists">
                                    <li>
                                        <div class="productimg">
                                            <div class="productimgs">
                                                <img src="${getImage}" alt="img">
                                            </div>
                                            <div class="productcontet">
                                                <h4>${getName}
                                                    <a href="javascript:void(0);" class="ms-2"
                                                        data-bs-toggle="modal" data-bs-target="#edit"><img
                                                            src="assets/img/icons/edit-5.svg" alt="img"></a>
                                                </h4>
                                                <div class="productlinkset">
                                                    <h5 class="h5Price">₱ ${getTotalPrice}</h5>
                                                    <h5>Qty. ${getQuantity}</h5>
                                                </div>
                                              
                                            </div>
                                        </div>
                                    </li>
                                    <li></li>
                                    <li><a class="confirm-text" href="javascript:void(0);"><img
                                                src="assets/img/icons/delete-2.svg" alt="img"></a></li>
                                                <input type="hidden" value="${getTotalPrice}" data-data-quan="${getQuantity}" data-data-name="${getName}"/>
                                </ul>
                        `)
                        var getallPrice = document.getElementsByClassName('h5Price');
                        $('.h4Items').html(`Total items : ${getallPrice.length}`);
                        var oo = 0;
                        $('.product-table input[type="hidden"]').each(function() {
                            console.log($(this).data('data-name'));
                            oo += parseInt($(this).val())
                            $('.totalCash').html(oo);
                            $('#printBody').append(`
                            <tr class="trx">
                                <td class=" quantityx tdx">${$(this).data('data-quan')}</td>
                                <td class=" description tdx">${$(this).data('data-name')}</td>
                                <td class=" pricex tdx">${$(this).val()}</td>
                            </tr>
                            `)
                        });
                       
                    }
                
                })
                var count = 3;
                get(child(dbref, `Adds_on`)).then((snapchat)=>{
                    snapchat.forEach(data =>{
                        count++
                        $('.addsOnClass').append(`
                        <div id="checklist" class="addsOnPlus" data-data-value="${data.val().Price}">
                            <input  value="${count}" name="r" type="checkbox" id="0${count}">
                            <label for="0${count}">${data.val().Name} - ${data.val().Price}</label>
                            <input type="hidden" value="0"/>
                        </div>
                        `)
                    })
                }).then(()=>{
                    var getadds = document.getElementsByClassName('addsOnPlus');

                    $('.addsOnPlus').on('click', function(){
                       console.log( $(this).data('data-value'))
                    })
                })
           
                $('#cashPupop').on('click', function(){
               
                    Swal.fire({
                        
                        title: 'Cash Amount',
                        html: `
                                <div class="form-group">
                                    <label style="float: left; ">Total Price: ${$('.totalCash').html()}</label>
                                    <input type="number" class="form-control" id="insertedCashAmount" required>
                                </div>
                                `,
                        showCancelButton: true,
                        confirmButtonColor: '#4A332D',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Confirm'
                        
                    }).then((result) => {
                        if (result.isConfirmed) {
                            if($('#insertedCashAmount').val() < parseInt($('.totalCash').html())){
                                Swal.fire({
                                    icon: 'error',
                                    text: 'Insufficient cash amount',
                             
                                  })
                            }else{
                                var cashAm = $('#insertedCashAmount').val();
                                var totalAm = $('.totalCash').html();
                                var changeAm = cashAm - totalAm;
                                $('#totalCashChange').append(`
                            
                                <div class="m-2 divDashed">
                                    <label class="totalLabel">
                                        Total
                                    </label>
                                    <label class="totalLabel" style="float: right;">
                                        ${totalAm}
                                    </label>
                                </div>
                                <p class="centered" style="font-size: 15px;">Payment Receipt</p>
                                <div class="divMargins">
                                    <label >
                                        Cash
                                    </label>
                                    <label style="float: right;">
                                        ${cashAm}
                                    </label>
                                </div>
                                <div class="m-2">
                                    <label >
                                        Change
                                    </label>
                                    <label style="float: right;">
                                        ${changeAm}
                                    </label>
                                </div>
                                `)
                                var printableDiv = document.getElementById('printableDiv').innerHTML;
                                var originalContent = document.body.innerHTML;
                                document.body.innerHTML = printableDiv;
                                window.print();
                                document.body.innerHTML = originalContent;
                                
                                // var divElements = $("#printableDiv").html();
                                // var popupWin = window.open("", "_blank", "width=800,height=500");
                                // popupWin.document.open();
                                // popupWin.document.write(
                                //     '<html><body onload="window.print()">' + divElements + "</html>"
                                // );
                                // popupWin.document.close();
                                // var $printerDiv = $('<div class="printContainer"></div>'); // create the div that will contain the stuff to be printed
                                // $printerDiv.html($("#printableDiv").html()); // add the content to be printed
                                // $('body').append($printerDiv).addClass("printingContent"); // add the div to body, and make the body aware of printing (we apply a set of css styles to the body to hide its contents)
                            
                                // window.print(); // call print
                                // $printerDiv.remove(); // remove the div
                                // $("#printableDiv").html()
                                // $('body').removeClass("printingContent");
                            }
                            
                        }
                    
                    })
                   

                })
                $('#printButton').on('click', function(){
                   
                        var printableDiv = document.getElementById('printableDiv').innerHTML;
                        var originalContent = document.body.innerHTML;
                        document.body.innerHTML = printableDiv;
                        window.print();
                        document.body.innerHTML = originalContent;
                   
                })
               
                $('.size1').on('click', function(){
                    $('#grandeCb').val("1")
                    $('#medioCb').val("0")
                    basePrice = parseInt($('#gandePriceV').val());
               
                    totallPrice = basePrice*baseQuantity;
                    console.log(totallPrice)
                    $('#getTotal').html(totallPrice)
                 });
                 $('.size2').on('click', function(){
                     $('#grandeCb').val("0")
                     $('#medioCb').val("1")
                     basePrice = parseInt($('#medioPriceV').val());
              
                     totallPrice = basePrice*baseQuantity;
                     console.log(totallPrice)
                     $('#getTotal').html(totallPrice)
                 });
                $('.btn-add').on('click', function(){
                    totalQuan++
                    $('.quan').html(totalQuan)
                    baseQuantity = totalQuan
                  
                    totallPrice = basePrice*baseQuantity;
                    console.log(totallPrice)
                    $('#getTotal').html(totallPrice)
                });
                $('.btn-minus').on('click', function(){
                    if(totalQuan <= 1){
                        return;
                    }
                    totalQuan--
                    $('.quan').html(totalQuan)
                    baseQuantity = totalQuan
                  
                    totallPrice = basePrice*baseQuantity;
                    console.log(totallPrice)
                    $('#getTotal').html(totallPrice)
                });
               
                
                
                
            })
        })
       
    }else{
        get(child(dbref, `Product_List/${listKey}`)).then((snapchat)=>{
            snapchat.forEach(element => {
                console.log(element.val())
                $('.allprod').append(`
                <div class="col-lg-3 d-flex Container5">
                    <div class="productset flex-fill"
                                data-data-productname="${element.val().Product_Name}"
                                data-data-productgrande="${element.val().Price_Size.Grande}"
                                data-data-productmedio="${element.val().Price_Size.Medio}"
                                data-data-productImage="${element.val().Product_Image}">
                        <div class="productsetimg">
                            <img src="${element.val().Product_Image}" alt="img">
                            <h6>Qty: 5.00</h6>
                            <div class="check-product">
                                <i class="fa fa-check"></i>
                            </div>
                        </div>
                        <div class="productsetcontent">
                            <h4>${element.val().Product_Name}</h4>
                        </div>
                    </div>
                </div>`)
            });
            
        }).then(()=>{
            $('.productset').on('click', function(){
                var prodName = $(this).data('data-productname');
                var prodGrande = $(this).data('data-productgrande');
                var prodMedio = $(this).data('data-productmedio');
                var forImage = $(this).data('data-productimage');
                var prodAdds = 9;
                var price = 0;
                var totalPrice = prodGrande;
                var totalQuan = 1;
                var basePrice = prodGrande;
                var baseQuantity = 1;
                var totallPrice = 0;
                $('.addsOnClass').html('');
                
                Swal.fire({
                    title: prodName,
                    html: `
                    <hr>
                    <div>
                        <div class="row">
                            <div class="col-6">
                                <div>
                                    <label >Quantity</label>
                                        <div class="pt-2 pb-3">
                                            <button type="button" class="btn-minus btn btn-light" style="background-color: #4A332D !important; color: #fff;">-</button>
                                            <label class="p-2 quan" style="font-weight: 900; font-size: 20px;">${totalQuan}</label>
                                            <button type="button" class="btn-add btn btn-light" style="background-color: #4A332D !important; color: #fff;">+</button>
                                        </div>
                                    </div>
                                </div>
                            <div class="col-6">
                                <label >Add-Ons</label>
                                <div class="addsOnClass justify-content-start w-100">
                                </div>
                            </div>
                        </div>

                        
                        <hr>
                        <label class="justify-content-start">Size</label>
                        <div class="d-flex justify-content-center pb-2">
                            <div id="checklist" class="size1">
                                <input  value="1" name="r" type="radio" checked="" id="01">
                                <label for="01">Grande -Price: ${prodGrande}</label>
                                <input type="hidden" id="grandeCb" value="1"/>
                                <input type="hidden" id="gandePriceV" value="${prodGrande}"/>
                            </div>
                            <div id="checklist" class="size2">
                                <input  value="2" name="r" type="radio" id="02">
                                <label for="02">Medio -Price: ${prodMedio}</label>
                                <input type="hidden" id="medioCb" value="0"/>
                                <input type="hidden" id="medioPriceV" value="${prodMedio}"/>
                            </div>
                        </div>
                            
                        <div>
                        <div>
                        <hr>
                        <div id="sweetCard" class="p-2">
                            <label style="float: left; font-weight: 900;">Total Price:</label>
                            <label style="float: right; font-weight: 900;" id="getTotal">${prodGrande}</label>
                        </div>
                    </div>
                    <input type="hidden" id="forImage" value="${forImage}" />
                    <input type="hidden" id="forName" value="${prodName}" />
                    
                    `,
                    showCancelButton: true,
                    confirmButtonColor: '#4A332D',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Confirm'
                }).then((result) => {
                    if (result.isConfirmed) {
                        var getTotalPrice = parseInt($('#getTotal').html());
                        var getImage = $('#forImage').val();
                        var getName = $('#forName').val();
                        var getQuantity = parseInt($('.quan').html());
                        $('.product-table').append(`
                                <ul class="product-lists">
                                    <li>
                                        <div class="productimg">
                                            <div class="productimgs">
                                                <img src="${getImage}" alt="img">
                                            </div>
                                            <div class="productcontet">
                                                <h4>${getName}
                                                    <a href="javascript:void(0);" class="ms-2"
                                                        data-bs-toggle="modal" data-bs-target="#edit"><img
                                                            src="assets/img/icons/edit-5.svg" alt="img"></a>
                                                </h4>
                                                <div class="productlinkset">
                                                    <h5 class="h5Price">₱ ${getTotalPrice}</h5>
                                                    <h5>Qty. ${getQuantity}</h5>
                                                </div>
                                              
                                            </div>
                                        </div>
                                    </li>
                                    <li></li>
                                    <li><a class="confirm-text" href="javascript:void(0);"><img
                                                src="assets/img/icons/delete-2.svg" alt="img"></a></li>
                                    
                                                <input type="hidden" value="${getTotalPrice}" />
                                </ul>
                        `)
                        var getallPrice = document.getElementsByClassName('h5Price');
                        $('.h4Items').html(`Total items : ${getallPrice.length}`)
                        var oo = 0;
                        $('.product-table input[type="hidden"]').each(function() {
                            console.log(oo);
                            oo += parseInt($(this).val())
                            $('.totalCash').html(oo);
                        });
                        
                    }
                
                })
                var count = 3;
                get(child(dbref, `Adds_on`)).then((snapchat)=>{
                    snapchat.forEach(data =>{
                        count++
                        $('.addsOnClass').append(`
                        <div id="checklist" class="addsOnPlus" data-data-value="${data.val().Price}">
                            <input  value="${count}" name="r" type="checkbox" id="0${count}">
                            <label for="0${count}">${data.val().Name} - ${data.val().Price}</label>
                            <input type="hidden" value="0"/>
                        </div>`)
                    })
                }).then(()=>{
                    var getadds = document.getElementsByClassName('addsOnPlus');

                    $('.addsOnPlus').on('click', function(){
                       console.log( $(this).data('data-value'))
                    })
                })
              
                
                $('.size1').on('click', function(){
                    $('#grandeCb').val("1")
                    $('#medioCb').val("0")
                    basePrice = parseInt($('#gandePriceV').val());
               
                    totallPrice = basePrice*baseQuantity;
                    console.log(totallPrice)
                    $('#getTotal').html(totallPrice)
                 });
                 $('.size2').on('click', function(){
                     $('#grandeCb').val("0")
                     $('#medioCb').val("1")
                     basePrice = parseInt($('#medioPriceV').val());
              
                     totallPrice = basePrice*baseQuantity;
                     console.log(totallPrice)
                     $('#getTotal').html(totallPrice)
                 });
                $('.btn-add').on('click', function(){
                    totalQuan++
                    $('.quan').html(totalQuan)
                    baseQuantity = totalQuan
                  
                    totallPrice = basePrice*baseQuantity;
                    console.log(totallPrice)
                    $('#getTotal').html(totallPrice)
                });
                $('.btn-minus').on('click', function(){
                    if(totalQuan <= 1){
                        return;
                    }
                    totalQuan--
                    $('.quan').html(totalQuan)
                    baseQuantity = totalQuan
                  
                    totallPrice = basePrice*baseQuantity;
                    console.log(totallPrice)
                    $('#getTotal').html(totallPrice)
                });
               
                
                
                
            })
        })
    }
    
}

allProducts('wala');

//get category



//get all products

// get(child(dbref, `Product_List`)).then((snapchat)=>{
//     snapchat.forEach(category => {
//         $('.product_container').append(` 
//         <div class="tab_content" data-tab="${category.key}">
//             <div class="row ">
//                    ASDASD
//             </div>  
//         </div>`)
//         get(child(dbref, `Product_List/${category.key}`)).then((snapchat)=>{
//             snapchat.forEach(items => {
//                 console.log(items.key)
            
//             });
//         })
    
//     });
// })







{/* <li class="" id="headphone">
<div class="product-details ">
    <h6>yeah</h6>
</div>
</li> */}
   

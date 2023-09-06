import { get, getDatabase, ref, set, child, update, remove, push} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";
import { signInWithEmailAndPassword, getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
const db = getDatabase();
const dbref = ref(db);
const auth = getAuth();
const date = new Date();
const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const theYear = date.getFullYear();
const theMonth = date.getMonth();
const theDate = date.getDate();
const theDay = date.getDay();
localStorage.removeItem('arrSell');

get(child(dbref, `Transactions/${theYear}/${theMonth+1}/${theDate}/1/`)).then((snapchat)=>{                  
    if(!snapchat.val())
    {
        location.href = "/poslogin.html";
    }
    else
    {
        snapchat.forEach((cashData)=>{
            localStorage.setItem('cash',cashData.key)
        })
    }
})
$('#transacDate').text(`${days[theDay]}, ${months[theMonth]} ${theDate},  ${theYear}`)

get(child(dbref, `Pos_Accounts`)).then((snapchat)=>{
    snapchat.forEach(element => {       
      if(element.val().Pin == localStorage.getItem('cashier'))
      {
        $('#cashierName').text(element.val().FullName);
        $('#pangalan').text(element.val().FullName);
      }
    });
  })
generateSerial()

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
    $('#transacId').html(randomSerial);
    $('#transac').html(randomSerial);
}

localStorage.removeItem('prod');
get(child(dbref, `Product_Category`)).then((snapchat)=>{
    snapchat.forEach(category => {
        var TheCat = category.key; 
        var datacat = TheCat.replaceAll(' ', '');
        $(".category_container").append(`
            <li class="categoryClick" id="${datacat}" data-dataclick="${category.key}" data-datacheck="" style="margin-right: 10px;">
                <div class="product-details ">
                    <h6>${category.val().category}</h6>
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
function allProducts(key)
{    
    $('.allprod').html('');
    get(child(dbref, `Product_List`)).then((snapchat)=>{
        snapchat.forEach(element => {
            element.forEach(datas=>{
                if(key == element.key)
                {
                    $('.allprod').append(`
                        <div class="col-lg-3 d-flex Container5">
                            <div class="productset flex-fill"
                                    data-data-productname="${datas.val().Product_Name}"
                                    data-data-productgrande="${datas.val().Price_Size.Grande}"
                                    data-data-productmedio="${datas.val().Price_Size.Medio}"
                                    data-data-productImage="${datas.val().Product_Image}">

                                <div class="productsetimg">
                                    <img src="${datas.val().Product_Image}" alt="img">
                                    <h6>Avail</h6>
                                    <div class="check-product">
                                        <i class="fa fa-check"></i>
                                    </div>
                                </div>
                                <div class="productsetcontent">
                                    <h4>${datas.val().Product_Name}</h4>
                                </div>
                            </div>
                        </div>`)
                }
                else{
                   if(key == 'wala')
                   {
                    $('.allprod').append(`
                        <div class="col-lg-3 d-flex Container5">
                            <div class="productset flex-fill"
                                    data-data-productname="${datas.val().Product_Name}"
                                    data-data-productgrande="${datas.val().Price_Size.Grande}"
                                    data-data-productmedio="${datas.val().Price_Size.Medio}"
                                    data-data-productImage="${datas.val().Product_Image}">

                                <div class="productsetimg">
                                    <img src="${datas.val().Product_Image}" alt="img">
                                    <h6>Avail</h6>
                                    <div class="check-product">
                                        <i class="fa fa-check"></i>
                                    </div>
                                </div>
                                <div class="productsetcontent">
                                    <h4>${datas.val().Product_Name}</h4>
                                </div>
                            </div>
                        </div>`)
                   }
                }
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
            var count = 3;
                    get(child(dbref, `Adds_on`)).then((snapchat)=>{
                        snapchat.forEach(data =>{
                            count++
                            $('.addOnsData').append(`
                            <div class="col-6">
                                <div id="" class="size1 checklist" style="zoom: 0.9;">
                                    <input value="9" data-label="${data.val().Name}" name="adds" type="checkbox" id="${data.key}">
                                    <label for="${data.key}">${data.val().Name}</label>
                                </div>
                            </div>`)
                        })
                    })
                    
            Swal.fire({
                title: prodName,
                html: `
                <hr>
                <div>
                    <div class="row">
                        <div class="col-6">
                            <img src="${forImage}" alt="img" style="height: 100%;">
                        </div>
                        <div class="col-6">
                            <div>
                                <label >Quantity</label><hr>
                                <div class="py-1">
                                    <button type="button" class="btn-minus btn btn-light" style="border-color: #4A332D !important; color: #4A332D;">-</button>
                                    <label class="p-2 quan" style="font-weight: 900; font-size: 20px;">${totalQuan}</label>
                                    <button type="button" class="btn-add btn btn-light" style="border-color: #4A332D !important; color: #4A332D;">+</button>
                                </div>
                                <div><hr>
                                    <div id="" class="size1 checklist" style="zoom: 0.9;">
                                        <input  value="1" name="r" type="radio" checked="" id="01">
                                        <label for="01">Grande -Price: ${prodGrande}</label>
                                        <input type="hidden" id="grandeCb" value="1"/>
                                        <input type="hidden" id="gandePriceV" value="${prodGrande}"/>
                                    </div>
                                    <div id="" class="size2 checklist" style="zoom: 0.9;">
                                        <input  value="2" name="r" type="radio" id="02">
                                        <label for="02">Medio &nbsp;&nbsp;-Price: ${prodMedio}</label>
                                        <input type="hidden" id="medioCb" value="0"/>
                                        <input type="hidden" id="medioPriceV" value="${prodMedio}"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>    
                    <div>
                    <div>
                        <hr>
                        <label>Add-Ons</label>
                        <div class="row my-3 addOnsData">
                            
                        </div>
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
                    var addOnsArr = [];
                    var addOnsTotal = 0;
                    $("input:checkbox[name=adds]:checked").each(function(){
                        addOnsArr.push($(this).attr('data-label'));
                        addOnsTotal += parseInt($(this).val())
                    });
                    console.log(addOnsArr,addOnsTotal)
                    var getTotalPrice = parseInt($('#getTotal').html());
                    var getImage = $('#forImage').val();
                    var getName = $('#forName').val();
                    var getQuantity = parseInt($('.quan').html());
                    
                    displayProd(getName,getImage,getTotalPrice,getQuantity,addOnsTotal,addOnsArr);
                    
                    $('#'+`${btoa(getName).replace(/[^a-zA-Z ]/g, "")}removebtn`).on('click',(e)=>{
                        var checker2 = localStorage.getItem("prod");
                        var fullData = JSON.parse(checker2);
                        const indexz = fullData.indexOf(btoa(getName).replace(/[^a-zA-Z ]/g, "")); 

                        console.log(checker2,indexz);

                        if(indexz > -1) 
                        {
                            var tempPrice = parseInt($('.totalCash').html()), h4Items = $('.h4Items').text();
                            fullData.splice(indexz, 1);
                            localStorage.setItem('prod',JSON.stringify(fullData))               
                            $('#'+`${btoa(getName).replace(/[^a-zA-Z ]/g, "")}remove`).remove();
                            $('#'+`${btoa(getName).replace(/[^a-zA-Z ]/g, "")}print`).remove();
                            tempPrice = (parseInt(tempPrice) - parseInt(getTotalPrice)) - parseInt(addOnsTotal);;
                            $('.totalCash').html(tempPrice);
                            h4Items = parseInt(h4Items) - parseInt(getQuantity);
                            $('.h4Items').text(h4Items);
                        }
                    })
                    $('#'+`${btoa(getName).replace(/[^a-zA-Z ]/g, "")}removebtnAdds`+btoa(addOnsArr).replace(/[^a-zA-Z ]/g, "")).on('click',(e)=>{
                        var checker2 = localStorage.getItem("prod");
                        
                        var fullData = JSON.parse(checker2);
                        const indexz = fullData.indexOf(btoa(getName).replace(/[^a-zA-Z ]/g, "")+'Adds'+btoa(addOnsArr).replace(/[^a-zA-Z ]/g, "")); 
                        console.log(addOnsArr,getName,fullData,btoa(getName).replace(/[^a-zA-Z ]/g, "")+'Adds'+btoa(addOnsArr).replace(/[^a-zA-Z ]/g, ""))
                        if(indexz > -1) 
                        {
                            var tempPrice = parseInt($('.totalCash').html()), h4Items = $('.h4Items').text();
                            fullData.splice(indexz, 1);
                            localStorage.setItem('prod',JSON.stringify(fullData))
                            $('#'+`${btoa(getName).replace(/[^a-zA-Z ]/g, "")}removeAdds`+btoa(addOnsArr).replace(/[^a-zA-Z ]/g, "")).remove();
                            $('#'+`${btoa(getName).replace(/[^a-zA-Z ]/g, "")}printAdds`+btoa(addOnsArr).replace(/[^a-zA-Z ]/g, "")).remove();
                            tempPrice = (parseInt(tempPrice) - parseInt(getTotalPrice)) - parseInt(addOnsTotal);
                            $('.totalCash').html(tempPrice);
                            h4Items = parseInt(h4Items) - parseInt(getQuantity);
                            $('.h4Items').text(h4Items);
                        }
                    })
                }
            
            })
           
            $('#errorHandlerCash').hide();
            
           
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

allProducts('wala');
$('#proceedClick').on('click', ()=>{    
    var totalCASH = parseFloat($('.totalCash').html());
    $('#totalCashChange').html("");
    if(totalCASH >= 0){
        if($('#insertedCashAmount').val() < totalCASH){
            $('#errorHandlerCash').show();
        }
        else{
            $('#closeModal').trigger('click');
            $('#errorHandlerCash').hide();
            var cashAm = $('#insertedCashAmount').val();
            var totalAm = totalCASH;
            var changeAm = cashAm - totalAm;
            $('#totalCashChange').append(`                            
                    <tr class="m-2 divDashed" style="width: 100vw !important;">
                        <td style="font-size: 13px; width: 100vw !important;">
                            <label class="totalLabel">
                                Total
                            </label>
                            <label class="totalLabel" style="float: right;">
                                ₱ ${parseFloat(totalAm)}
                            </label>
                        </td>
                    </tr>
                    <tr class="divMargins" style="width: 100vw !important;">
                        <td style="font-size: 13px; width: 100vw !important;">
                            <label >
                                Cash
                            </label>
                            <label style="float: right;">
                                ₱ ${parseFloat(cashAm)}
                            </label>
                        </td>
                    </tr>
                    <tr class="m-2" style="width: 100vw !important;">
                        <td style="font-size: 18px; width: 100vw !important;">
                            <label >
                                Change
                            </label>
                            <label style="float: right; font-size: 18px !important">
                                ₱ ${parseFloat(changeAm)}
                            </label>
                        </td>
                    </tr>
                `)
            transactions()
            var printableDiv = document.getElementById('printableDiv').innerHTML;
            var winPrint = window.open('', '', 'left=0,top=0,width=800,height=600,toolbar=0,scrollbars=0,status=0');
            winPrint.document.write(`${printableDiv}`);
            winPrint.document.close();
            winPrint.focus();
            winPrint.print();
            winPrint.close(); 
        }
    }
})

function displayProd(getName,getImage,getTotalPrice,getQuantity,addOnsTotal,addOnsArr)
{
    var arrSell = [];
    arrSell.push(JSON.parse(localStorage.getItem('arrSell')));
    console.log(arrSell)
    var checker = localStorage.getItem("prod");
    var prods=[];
    if(checker)
    {
        var fullData = JSON.parse(checker);
        var ans = fullData.includes(btoa(getName).replace(/[^a-zA-Z ]/g, ""));   

        if(ans && addOnsArr.length == 0)
        {
            var qtys = $('#'+btoa(getName).replace(/[^a-zA-Z ]/g, "")+'qty').text(), prc = $('#'+btoa(getName).replace(/[^a-zA-Z ]/g, "")+'price').text();

            var printDataQty   = $('#'+btoa(getName).replace(/[^a-zA-Z ]/g, "")+'print td .printQty').text();
            var printDataTotal = $('#'+btoa(getName).replace(/[^a-zA-Z ]/g, "")+'print td .printTotal').text();

            printDataQty   = parseInt(printDataQty) + getQuantity;
            printDataTotal = parseInt(printDataTotal) + getTotalPrice;

            getQuantity = getQuantity + parseInt(qtys);
            getTotalPrice = getTotalPrice + parseInt(prc);
            $('#'+btoa(getName).replace(/[^a-zA-Z ]/g, "")+'qty').text(getQuantity);
            $('#'+btoa(getName).replace(/[^a-zA-Z ]/g, "")+'price').text(getTotalPrice);
            $('#'+btoa(getName).replace(/[^a-zA-Z ]/g, "")).val(getTotalPrice);
            var tempPrice = parseInt($('.totalCash').html()), h4Items = $('.h4Items').text();
            tempPrice = parseInt(tempPrice) + parseInt(getTotalPrice);
            $('.totalCash').html(tempPrice);
            h4Items = parseInt(h4Items) + parseInt(getQuantity);
            $('.h4Items').text(h4Items);

            $('#'+btoa(getName).replace(/[^a-zA-Z ]/g, "")+'print td .printQty').text(printDataQty)
            $('#'+btoa(getName).replace(/[^a-zA-Z ]/g, "")+'print td .printTotal').text(parseFloat(printDataTotal));
        }
        else
        {
            var dataArr = '';
            var addsOnArr = [];
            if(addOnsTotal != 0)
            {   
                dataArr = '<small class="fw-bold" style="font-size: 12px; margin: 0px !important">Add-ons</small>';
                addOnsArr.forEach((element)=>{
                    dataArr += `
                        <div style="margin: 0px !important">
                            <small class="adds-on-class" style="font-size: 12px; margin: 0px !important">${element}</small>
                        </div>
                    `;
                    addsOnArr.push(element);
                })
            }
            fullData.push(`${btoa(getName).replace(/[^a-zA-Z ]/g, "")}${addOnsTotal != 0  ? 'Adds'+btoa(addsOnArr).replace(/[^a-zA-Z ]/g, "") : ''}`);
            console.log(fullData)
            localStorage.setItem("prod",JSON.stringify(fullData));
            var prcID = btoa(getName).replace(/[^a-zA-Z ]/g, ""), qtyID = btoa(getName).replace(/[^a-zA-Z ]/g, "");
            $('.product-table').append(`
                    <ul class="product-lists" id="${btoa(getName).replace(/[^a-zA-Z ]/g, "")}remove${addOnsTotal != 0  ? 'Adds'+btoa(addsOnArr).replace(/[^a-zA-Z ]/g, "") : ''}">
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
                                    <div class="prints"> ${dataArr} </div>
                                    <div class="productlinkset mt-1">
                                        <h5 class="h5Price">₱ <span  id="${prcID}price">${getTotalPrice + parseInt(addOnsTotal)}</span></h5>
                                        <h5>Qty. <span id="${qtyID}qty">${getQuantity}</span></h5>
                                    </div>
                                
                                </div>
                            </div>
                        </li>
                        <li></li>
                        <li>
                            <a class="confirm-text" id="${btoa(getName).replace(/[^a-zA-Z ]/g, "")}removebtn${addOnsTotal != 0  ? 'Adds'+btoa(addsOnArr).replace(/[^a-zA-Z ]/g, "") : ''}">
                                <img src="assets/img/icons/delete-2.svg" alt="img">                                            
                            </a>
                        </li>
                        
                    </ul>
            `)
            var arrSellData = `{
                "prod": "${getName}",
                "qty": "${getQuantity}",
                "price" : "${getTotalPrice}",
                "addons" : "${addOnsTotal != 0  ? 'Yes' : 'No'}",
                "addonsPrice" : "${addOnsTotal != 0  ? addOnsTotal : 'No'}",
                "addonsItem" : "${addOnsTotal != 0  ? addOnsArr : 'No'}"
            }`
            arrSell.push(JSON.parse(arrSellData));
            console.log(arrSell)
            localStorage.setItem('arrSell',JSON.stringify(JSON.parse(arrSellData)));
            $('#printBody').append(`
                <tr id="${btoa(getName).replace(/[^a-zA-Z ]/g, "")}print${addOnsTotal != 0  ? 'Adds'+btoa(addOnsArr).replace(/[^a-zA-Z ]/g, "") : ''}">
                    <td>
                        <h4 class="printProd" style="font-size: 11px !important;">${getName}</h4>
                        <h4 class="printAdds" style="font-size: 11px !important; font-weight: 700;">${addOnsTotal != 0? dataArr:''}</h4>
                        <input type="hidden" class="add-ons" value="${btoa(addsOnArr)}">
                    </td>
                    <td style="text-align: center !important; border: 1px solid #fff;">
                        <h4 class="printQty">${getQuantity}</h4>
                    </td>
                    <td style="text-align: center !important; border: 1px solid #fff;">
                        <h4 class="printTotal" style="margin-right: 0 !important;">₱ ${getTotalPrice + parseInt(addOnsTotal)}</h4>
                    </td>
                </tr>
            `);
            var tempPrice = parseInt($('.totalCash').html()), h4Items = $('.h4Items').text();
            tempPrice = parseInt(tempPrice) + parseInt(getTotalPrice) + parseInt(addOnsTotal);
            $('.totalCash').html(tempPrice);
            h4Items = parseInt(h4Items) + parseInt(getQuantity);
            $('.h4Items').text(h4Items);
        }
    }
    else
    {
        var dataArr = '';
        var addsOnArr = [];
        if(addOnsTotal != 0)
        {   
            dataArr = '<small class="fw-bold" style="font-size: 12px; margin: 0px !important">Add-ons</small>';
            addOnsArr.forEach((element)=>{
                dataArr += `
                    <div style="margin: 0px !important">
                        <small class="adds-on-class" style="font-size: 12px; margin: 0px !important">${element}</small>
                    </div>
                `;
                addsOnArr.push(element);
            })
        }
        prods.push(`${btoa(getName).replace(/[^a-zA-Z ]/g, "")}${addOnsTotal != 0  ? 'Adds'+btoa(addsOnArr).replace(/[^a-zA-Z ]/g, "") : ''}`);

        console.log(prods,' tite',addsOnArr)
        var checker = localStorage.setItem("prod",JSON.stringify(prods));                         
    
        var prcID = btoa(getName).replace(/[^a-zA-Z ]/g, ""), qtyID = btoa(getName).replace(/[^a-zA-Z ]/g, "");
        
        $('.product-table').append(`
            <ul class="product-lists" id="${btoa(getName).replace(/[^a-zA-Z ]/g, "")}remove${addOnsTotal != 0  ? 'Adds'+btoa(addsOnArr).replace(/[^a-zA-Z ]/g, "") : ''}">
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
                            <div class="prints"> ${dataArr} </div>
                            <div class="productlinkset">
                                <h5 class="h5Price">₱ <span  id="${prcID}price">${getTotalPrice + parseInt(addOnsTotal)}</span></h5>
                                <h5>Qty. <span id="${qtyID}qty">${getQuantity}</span></h5>
                            </div>
                        
                        </div>
                    </div>
                </li>
                <li></li>
                <li>
                    <a class="confirm-text" id="${btoa(getName).replace(/[^a-zA-Z ]/g, "")}removebtn${addOnsTotal != 0  ? 'Adds'+btoa(addsOnArr).replace(/[^a-zA-Z ]/g, "") : ''}">
                        <img src="assets/img/icons/delete-2.svg" alt="img">                                            
                    </a>
                </li>
                
            </ul>
        `);
        var tempPrice = parseInt($('.totalCash').html()), h4Items = $('.h4Items').text();
        tempPrice = parseInt(tempPrice) + parseInt(getTotalPrice) + parseInt(addOnsTotal);
        $('.totalCash').html(tempPrice);
        h4Items = parseInt(h4Items) + parseInt(getQuantity);
        $('.h4Items').text(h4Items);
        
        var arrSellData = `{
            "prod": "${getName}",
            "qty": "${getQuantity}",
            "price" : "${getTotalPrice}",
            "addons" : "${addOnsTotal != 0  ? 'Yes' : 'No'}",
            "addonsPrice" : "${addOnsTotal != 0  ? addOnsTotal : 'No'}",
            "addonsItem" : "${addOnsTotal != 0  ? addOnsArr : 'No'}"
        }`
        arrSell.push(JSON.parse(arrSellData));
        console.log(arrSell)
        localStorage.setItem('arrSell',JSON.stringify(JSON.parse(arrSellData)));


        $('#printBody').append(`
            <tr id="${btoa(getName).replace(/[^a-zA-Z ]/g, "")}print${addOnsTotal != 0  ? 'Adds'+btoa(addOnsArr).replace(/[^a-zA-Z ]/g, "") : ''}">
                <td>
                    <h4 class="printProd" style="font-size: 11px !important; font-weight: 700;">${getName}</h4>
                    <h4 class="printAdds" style="font-size: 9px !important; font-weight: 700;">${addOnsTotal != 0? dataArr :''}</h4>
                    <input type="hidden" class="add-ons" value="${btoa(addsOnArr)}">
                </td>
                <td style="text-align: center !important;">
                    <h4 class="printQty">${getQuantity}</h4>
                </td>
                <td style="text-align: center !important;">
                    <h4 class="printTotal" style="margin-right: 0 !important;">₱ ${getTotalPrice + parseInt(addOnsTotal)}</h4>    
                </td>
            </tr>
        `);
    }
}
function transactions()
{  
    var gettable = $('#printBody tr');
    var trans = $('#transacId').html();
    var cash = localStorage.getItem('cash');
    var adds = $('#printBody').find('input').val();
    var totalCash = $('.totalCash').text();

    for(var i = 0; i<gettable.length; i++)
    {
        var product      = document.getElementsByClassName('printProd')[i].innerHTML;
        var productQty   = document.getElementsByClassName('printQty')[i].innerHTML;
        var productTotal = document.getElementsByClassName('printTotal')[i].innerHTML;
        var addons       = document.getElementsByClassName('add-ons')[i].value;
        push(child(dbref, `Transactions/${theYear}/${theMonth+1}/${theDate}/1/`+cash+'/'+trans+'/'), {
            product     : product,
            productAdds : addons ? JSON.stringify(atob(addons)) : 'No',
            productQty  : productQty,
            productTotal: productTotal
        })
        
    }
    var CurrentSale = 0;
    get(child(dbref, `Transactions/${theYear}/${theMonth+1}/${theDate}/1/${cash}`)).then((snapchat)=>{
        CurrentSale = snapchat.val().Sales
    }).then(()=>{
        update(child(dbref, `Transactions/${theYear}/${theMonth+1}/${theDate}/1/${cash}`), {
            Sales: parseInt(totalCash) + parseInt(CurrentSale)
        }).then(()=>{
            $('#printBody').html();
            $('#totalCashChange').html();
            generateSerial()
            $('.product-lists').remove();
            $('.totalCash').html('0');
            $('.h4Items').text(`0`);
            localStorage.removeItem('prod');
        })
    })
    
}
import { get, getDatabase, ref, set, child, update, remove, push, onValue } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";
import { signInWithEmailAndPassword, getAuth, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
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
// onValue(child(dbref, `Transactions/${theYear}/${theMonth+1}/${theDate}/1/`),(snapchat) => {
//     snapchat.forEach(element => {
     
//         $('#sales').text(element.val().Sales)
//         $('#cups').text(element.val().Cups)
//     });
// },{

// });
var list = '{';
onValue(child(dbref, `Sales_Product/${theYear}/${theMonth+1}/`),(snapchat) => {

    snapchat.forEach(element => {
        element.forEach(data =>{
            list +=`"${data.key}":${data.val().total},`;
        })
    });
        list=list.slice(0,-1)+'}';
    list=JSON.parse(list);
    let max = Object.entries(list).reduce((max, entry) => entry[1] >= max[1] ? entry : max, [0, -Infinity])
    let min = Object.entries(list).reduce((min, entry) => entry[1] <= min[1] ? entry : min, [0, +Infinity])

    console.log(max) 
    console.log(min) 
    $('#bestSeller').text(max[0]);
    $('#bestSellerPrice').text(max[1]);
},{

});

onValue(child(dbref, `Transactions/${theYear}/${theMonth+1}/${theDate}/1/`),(snapchat) => {
    var cups = 0;
    var sales = 0;
    var trans = 0;
    if(snapchat.val())
    {
        snapchat.forEach(element => {
            element.forEach(data =>{
                trans += 1;
                data.forEach(data2 =>{
                    sales += parseInt(data2.val().productTotal.replace('₱ ', ''));
                    cups += parseInt(data2.val().productQty);
                })
            })
        });
        $('#transactions').text(trans -2)
        $('#cups').text(cups)
        $('#sales').text(sales)
    }
},{

});

var html = "";
var counter = 0;
let sortable = '{';
onValue(child(dbref, `Transactions/${theYear}/${theMonth+1}`),(snapchat) => {
    snapchat.forEach(transacData=>{
        transacData.forEach((element1)=>{
            var quan = 0;
            element1.forEach(element => {
                element.forEach(data =>{
                    // $('#totalTransacMon').text(counter++)
                  
                    //sortable+=`'${data2.val().product}': ${parseInt(data2.val().productTotal.replace('₱ ', ''))},`;
                   
                  if(data.key != "Cups" && data.key != "Sales"){
                    html += `<li class="d-flex mb-3 pb-1 align-items-center">
                        <div class="badge bg-label-success rounded me-3 p-2">
                            <i class="ti ti-browser-check ti-sm"></i>
                        </div>
                        <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                            <div class="me-2">
                            <a data-bs-toggle="modal" data-bs-target="#ShowTrans" class="transClick"
                            data-data-transid="${data.key}"
                            data-data-cashier="${element1.key}"
                            data-data-onhand="${element.key}"
                            data-data-day="${transacData.key}"
                            >
                                <h6 class="mb-0">#${data.key}</h6>
                            </a>
                            </div>
                            <div class="user-progress d-flex align-items-center gap-1">
                                
                            </div>
                        </div>
                    </li>`;
                  }
                })
            });
            $('.transactionContent').html(html);
                
            
        })
    })
    $('.transClick').on('click', function(){
        // console.log($(this).data('data-transid'))
        $('#accordionExample').html("")
        var transaction_id = $(this).data('data-transid')
        var trans_cashier = $(this).data('data-cashier')
        var trans_onhand = $(this).data('data-onhand')
        var trans_day = $(this).data('data-day')
        $('.transactionTitle').text(`#${transaction_id}`);
        var total = 0;
        get(child(dbref, `Transactions/${theYear}/${theMonth+1}/${trans_day}/${trans_cashier}/${trans_onhand}/${transaction_id}`)).then((snapchat)=>{
            snapchat.forEach(getEachItems =>{
                var tot = getEachItems.val().productTotal
                var totalText = tot.replace("₱ ", "")
                total += parseInt(totalText)
                $('#accordionExample').append(`
                <div class="card accordion-item">
                  <h2 class="accordion-header" id="headingOne${getEachItems.key}">
                    <button
                      type="button"
                      class="accordion-button"
                      data-bs-toggle="collapse"
                      data-bs-target="#accordionOne${getEachItems.key}"
                      aria-expanded="true"
                      aria-controls="accordionOne${getEachItems.key}">
                      ${getEachItems.val().product}
                    </button>
                  </h2>
                  <div
                    id="accordionOne${getEachItems.key}"
                    class="accordion-collapse collapse"
                    data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                      <b>Add-ons</b><span class="ms-3">&nbsp;&nbsp;${getEachItems.val().productAdds}</span><br>
                      <b>Quantity</b><span class="ms-3">&nbsp;${getEachItems.val().productQty}</span><br>
                      <b>Total</b><span class="ms-5">${getEachItems.val().productTotal}</span>
                    </div>
                  </div>
                </div>
                `)
            })
        }).then(()=>{
            $('#tranTotalPrice').text(total);
        })
    })    

    
},{

});

onValue(child(dbref, `Transactions/${theYear}/${theMonth+1}`),(snapchat) => {
    var allTrans = 0;

    snapchat.forEach(day =>{
        day.forEach(branch =>{
            branch.forEach(cash =>{
                cash.forEach(trans =>{
                    if(trans.key != "Sales" && trans.key != "Cups"){
                        allTrans++
                    }
                    
                })
            })
        })
    })
    $('#totalTransacMon').text(allTrans)
},{})

function onTransactionClick(){
    var transId = "aaa";
    console.log(transId);
}




{/* <li class="d-flex mb-3 pb-1 align-items-center">
    <div class="badge bg-label-success rounded me-3 p-2">
        <i class="ti ti-browser-check ti-sm"></i>
    </div>
    <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
        <div class="me-2">
            <h6 class="mb-0">Bank Transfer</h6>
            <small class="text-muted d-block">Add Money</small>
        </div>
        <div class="user-progress d-flex align-items-center gap-1">
            <h6 class="mb-0 text-success">+₱480</h6>
        </div>
    </div>
</li> */}
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
    console.log()
    if(snapchat.val()){
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
                    $('#totalTransacMon').text(counter++)
                  data.forEach(data2 =>{
                    //sortable+=`'${data2.val().product}': ${parseInt(data2.val().productTotal.replace('₱ ', ''))},`;
                    quan += parseInt(data2.val().productQty)
                  
                    html += `<li class="d-flex mb-3 pb-1 align-items-center">
                                <div class="badge bg-label-success rounded me-3 p-2">
                                    <i class="ti ti-browser-check ti-sm"></i>
                                </div>
                                <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                    <div class="me-2">
                                        <h6 class="mb-0">#${data.key}</h6>
                                        <small class="text-muted d-block">Number of Cup Sold : ${data2.val().productQty}</small>
                                    </div>
                                    <div class="user-progress d-flex align-items-center gap-1">
                                        <h6 class="mb-0 text-success">+₱ ${parseInt(data2.val().productTotal.replace('₱ ', ''))}</h6>
                                    </div>
                                </div>
                            </li>`;
                    
        
                  })
                })
            });
            $('.transactionContent').html(html);
        })
    })
},{

});
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



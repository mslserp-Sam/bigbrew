
function clearCart()
{
    $('.product-lists').remove();
    $('.totalCash').html('0');
    $('.h4Items').html(`Total items : 0`);
    localStorage.removeItem('prod');
}
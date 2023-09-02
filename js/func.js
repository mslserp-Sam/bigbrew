
function clearCart()
{
    $('.product-lists').remove();
    $('.totalCash').html('0');
    $('.h4Items').text(`0`);
    localStorage.removeItem('prod');
}
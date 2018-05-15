/*
* Nguyen, Thuc
* jadrn025
* Project #2
* Spring 2018
*/


var cart = new shopping_cart('jadrn025');

$(document).ready(function() {
    var cartSize = cart.size();
    $('#cart_quantity').text(cartSize);
});

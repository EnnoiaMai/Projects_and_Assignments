/*
Nguyen, Thuc
jadrn041
Project #4
Fall 2017
*/

/*
    For the pages that needs to have the cart number updated after the
    DOM has loaded. For example, the about.html and contact.html pages would
    reference this file.
*/
var cart = new shopping_cart('jadrn041');
$(document).ready(function() {

    var cartSize = cart.size();
    $('#menu_cart a:nth-child(2)').text(cartSize);
});

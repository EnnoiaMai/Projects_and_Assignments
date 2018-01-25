/*
Nguyen, Thuc
jadrn041
Project #4
Fall 2017
*/
var cart = new shopping_cart('jadrn041');
$(document).ready(function() {
    // Get the cookie
    var rawString = document.cookie;
    if (rawString == undefined) {
        return;
    }
    var tmp = rawString.split(";");
    // Check if cookie named 'jadrn041' exists in the list, else return
    var myValue = null;
    for (i = 0; i < tmp.length; i++) {
        if (tmp[i].indexOf('jadrn041') != -1) {
            myValue = tmp[i].split("=");
        }
    }
    if (!myValue) {
        return;
    }
    // Decode the cookie, write it to its decoded form
    var value = decodeURIComponent(myValue[1]);
    var toWrite = "jadrn041=" + value + "; path=/";
    document.cookie = toWrite;

    var cartSize = cart.size();
    $('#menu_cart a:nth-child(2)').text(cartSize);

    $('input[type="button"]').on('click', placeOrder);
});

function placeOrder() {
    // AJAX call and handler
    $.get('/perl/jadrn041/place_order.cgi', placeOrderHandler);
}

function placeOrderHandler(response) {
    if (response == 'success') {
        $('#success_div').css("visibility", "visible");
        window.setTimeout(function() {
            $('#success_div').css("visibility", "hidden");
            location.href = "http://jadran.sdsu.edu/~jadrn041/proj4/index.html";
        }, 3000);
    } else {
        alert("An error occurred while attempting to place the order.");
    }
}

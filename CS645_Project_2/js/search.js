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

    // Delegated Events handling when user clicks "Add to Cart"
    addToCartDelegatedEvent();
});

function addToCartDelegatedEvent() {
    $('#products_grid').on('click', $('#products_grid input[type="button"]'), function(event) {

        // Check if the event element has the value 'Add to Cart' which verifies
        // that the button was clicked, which can be referenced by event.target.
        if ( $(event.target).text() != 'Add to Cart') {
            return;
        }

        var sku = event.target.id;
        var productIndex = $(event.target).closest('div').index();
        console.log("sku = " + sku);

        // Call ProductDetails.java and redirect to ProductDetails.jsp
        var urlPath = "/jadrn025/servlet/ProductDetails?sku=" + sku;
        window.location.href = urlPath;
    });
}

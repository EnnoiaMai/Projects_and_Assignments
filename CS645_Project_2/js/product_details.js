/*
* Nguyen, Thuc
* jadrn025
* Project #2
* Spring 2018
*/

var cart = new shopping_cart("jadrn025");

// Confirmation Messages
var invalidQuantityInput = "Please enter a valid quantity. The quantity should be a digit greater than 0.";
var invalidQuantityAmount = "The quantity specified exceeds the amount of the product available. Please enter a valid amount.";
var invalidQuantityAmountFromDB = "This item is no longer in stock or the desired amount exceeds availability.";
var errorQuantityAmountFromDB = "An error occurred on the server.";
var validAddToCart = "The item was successfully added to your cart!";

$(document).ready(function() {
    var cartSize = cart.size();
    $('#cart_quantity').text(cartSize);

    // Check amount requested against amount available before allowing it to be added to the cart
    $('#details_container button').on('click', validateAvailability);
});

/*
* validateAvailability() - a soft check to see if the amount the user requested is valid
*               given the amount of products available. (This page, the order page, and the
*               order confirmation page wil check against this too,. Ultimately, order confirmation
*               page which will check against database to determine if request is valid.)
*/
function validateAvailability() {
    console.log("validateAvailability()");

    var cartSize = cart.size();
    $('#cart_quantity').text(cartSize);

    var quantity = parseInt($('#quantity').text());
    var quantityToPurchase = parseInt($('#details_container input[type="text"]').val());
    var pattern = new RegExp(/^[1-9]\d*$/);

    if ( !trim(quantityToPurchase) || (!pattern.test(quantityToPurchase)) ) {
        toggleConfirmation('#confirmation_container', false, invalidQuantityInput);
        return;
    }

    if (quantity - quantityToPurchase < 0) {
        toggleConfirmation('#confirmation_container', false, invalidQuantityAmount);
        return;
    }

    validateQuantityFromDB();
}

/*
* validateQuantityFromDB() - actual check against the quantity stored in the
*               database to check if the user's desired quantity is valid.
*/
function validateQuantityFromDB() {
    console.log("validateQuantityFromDB()");

    var sku = $('#details_container button').prop("id");
    var quantityToPurchase = parseInt($('#details_container input[type="text"]').val());
    var url = "/jadrn025/servlet/ValidateQuantity?sku=" + sku + "&quantity=" + quantityToPurchase;
    $.get(url, validateQuantityFromDBHandler);
}

function validateQuantityFromDBHandler(response) {
    console.log("validateQuantityFromDBHandler() - response is\n" + response);

    if (response == "valid") {
        console.log("response = valid");
        // The button's id is the sku, so grab that
        var sku = $('#details_container button').prop("id");
        var quantityToPurchase = parseInt($('#details_container input[type="text"]').val());
        cart.setQuantity(sku, quantityToPurchase);
        var cartSize = cart.size();
        $('#cart_quantity').text(cartSize);

        toggleConfirmation('#confirmation_container', true, validAddToCart);
    }
    else if (response == "invalid") {
        console.log("response = invalid");
        toggleConfirmation('#confirmation_container', false, invalidQuantityAmountFromDB);
    }
    else {
        console.log("response = error");
        toggleConfirmation('#confirmation_container', false, errorQuantityAmountFromDB);
    }
}

function toggleConfirmation(selector, didSucceed, text) {
    console.log("toggleConfirmation() - " + didSucceed);

    $(selector + ' p').text(text);
    // Show confirmation for 7 seconds before removing it
    if (didSucceed) {
        $(selector + ' img').prop('src', '/jadrn025/packback_images/check_transparent.png');
        $(selector).addClass('confirmation_success').css('display', 'flex').fadeIn(1000);
        window.setTimeout(function() {
            $(selector).css('display', 'none').removeClass('confirmation_success').fadeOut(1000);
        }, 7000);
    } else {
        $(selector + ' img').prop('src', '/jadrn025/packback_images/error_transparent.png');
        $(selector).addClass('confirmation_error').css('display', 'flex').fadeIn(1000);
        window.setTimeout(function() {
            $(selector).css('display', 'none').removeClass('confirmation_error').fadeOut(1000);
        }, 7000);
    }
    $(window).scrollTop($(selector).position().top - 120);
}

function trim(string) {
    var trimmed = $.trim(string);
    return (trimmed.length > 0) ? true : false;
}

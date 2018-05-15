/*
* Nguyen, Thuc
* jadrn025
* Project #2
* Spring 2018
*/

var cart = new shopping_cart('jadrn025');
var placedOrderAndRedirect = "Your order has been successfully placed. You will be redirected to the home page.";
var invalidPlaceOrder = "The following items are no longer in stock or the desired amount exceeds availability. Please remove the items or change the quantity in the cart before checking out.";

$(document).ready(function() {
    var cartSize = cart.size();
    $('#cart_quantity').text(cartSize);

    $('#order_summary button[name="placeOrderButton"]').on('click', placeOrder);
});

function placeOrder() {
    console.log("placeOrder()");

    var url = "/jadrn025/servlet/PlaceOrder";
    $.post(url, placeOrderHandler);
}

function placeOrderHandler(response) {
    console.log("placeOrderHandler() - response\n" + response);

    if (response == "ok") {
        toggleSuccessAndRedirect("#confirmation_container", placedOrderAndRedirect);
        // Delete cookie
        cart.deleteCookie();

        // Set cart size to 0
        var cartSize = cart.size();
        $('#cart_quantity').text(cartSize);
    }
    else {
        var listOfInvalidSkus = response.split("|");
        $('#checkout_table_div table tr').each(function() {
            for (var i = 0; i < listOfInvalidSkus.length; i++) {
                if (listOfInvalidSkus[i] == $(this).prop("id")) {
                    console.log("match found, sku is " + listOfInvalidSkus[i]);

                    // Set border to red for invalid item
                    $(this).closest("tr").css({
                        "border" : "1px solid #E50000"
                    });
                }
            }
        });
        // Show error confirmation
        toggleFailure("#confirmation_container", invalidPlaceOrder);
    }
}

function toggleFailure(selector, text) {
    console.log("toggleFailure()");

    $(selector + ' p').text(text);
    // Show failure message
    $(selector + ' img').prop('src', '/jadrn025/packback_images/error_transparent.png');
    $(selector).addClass('confirmation_error').css('display', 'flex').fadeIn(1000);
    $("#content").css('margin-top', '20px');
    $(window).scrollTop($(selector).position().top - 120);
}

function toggleSuccessAndRedirect(selector, text) {
    console.log("toggleSuccessAndRedirect()");

    $(selector + ' p').text(text);
    // Show confirmation for 5 seconds before redirecting
    $(selector + ' img').prop('src', '/jadrn025/packback_images/check_transparent.png');
    $(selector).addClass('confirmation_success').css('display', 'flex').fadeIn(1000);
    $(window).scrollTop($(selector).position().top - 120);

    $('#order_summary button[name="placeOrderButton"]').prop("disabled", true);

    window.setTimeout(function() {
        location.href = "http://jadran.sdsu.edu/jadrn025/proj2.html";
    }, 5000);
}

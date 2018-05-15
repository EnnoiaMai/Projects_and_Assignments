/*
* Nguyen, Thuc
* jadrn025
* Project #2
* Spring 2018
*/

var currentListOfProducts;        // current list of products in the cart
var cartSize;
var cart = new shopping_cart("jadrn025");

var invalidQuantityConfirmation = "The following items are no longer in stock or the desired amount exceeds availability. Please delete the items or change the quantity in order to check out.";

$(document).ready(function() {

    currentListOfProducts = new Array();
    cartSize = cart.size();
    $('#cart_quantity').text(cartSize);

    // Clear cart and show message if nothing in cart, otherwise display order summary
    // and call ProductDetailsAjax.java to get currentListOfProducts
    if (cartSize == 0) {
        clearCartAndOrder();
    } else {
        $('#order_summary').css("display", "block");
        $.get('/jadrn025/servlet/ProductDetailsAjax', productDetailsHandler);
        attachButtonEvents();

        // Set up the checkout button
        $('#order_summary button[name="checkoutButton"]').on("click", validateQuantity);
    }
});

/*
* attachButtonEvents() - delegated event handling and allows user to set new values
*               for the quantity of the items he/she added to the cart.
*
* 1) 'Change' - display 'save' and 'cancel' options, enable input field for quantity.
* 2) 'Save' - verifies quantity input, saves new quantity to the cart for that specific item,
*           display 'change' and 'delete' options.
* 3) 'Cancel' - display 'change' and 'delete' options, sets text of quantity to what it
*               originally was in the cart, disable the input field for quantity.
* 4) 'Delete' - deletes sku and quantity from cart entirely.
*/
function attachButtonEvents() {
    $('#order_table_div').on('click', $('input[type="button"]'), function(event) {

        // Return if anything other than the buttons were clicked
        var targetVal = $(event.target).val();
        if ((targetVal != 'Change') && (targetVal != 'Save') && (targetVal != 'Cancel') && (targetVal != 'Delete')) {
            return;
        }

        // Parent td element has the sku
        var parentTD = $(event.target).closest('td');

        // Identify the button that clicked and initiate the respective code block
        switch (targetVal) {
            case 'Change':
                // Change the text to Save and Cancel
                $(event.target).val('Save');
                $(event.target).siblings('input').val('Cancel');

                // Enable the input text
                parentTD.find('div.quantity_flex_row input[type="text"]').prop("disabled", false);
                break;

            case 'Save':
                // Verify the quantity
                var quantity = parentTD.find('div.quantity_flex_row input[type="text"]').val();

                var pattern = new RegExp(/^[1-9]\d*$/);
                if (!pattern.test(quantity)) {
                    alert("Please enter a valid quantity.");
                    return;
                }

                // Disable the input text, change the text back to Change and Delete
                parentTD.find('div.quantity_flex_row input[type="text"]').val(quantity).prop("disabled", true);
                $(event.target).val('Change');
                $(event.target).siblings('input').val('Delete');

                // Set the quantity of the item in the cart
                sku = parentTD.attr('id');
                cart.setQuantity(sku, quantity);
                cartSize = cart.size();
                $('#cart_quantity').text(cartSize);

                // Refresh the table
                updateTable();
                break;

            case 'Cancel':
                // Change the text back to Change and Delete
                $(event.target).siblings('input').val('Change');
                $(event.target).val('Delete');

                // Get the original quantity from the cart
                var usersProducts = cart.getCartArray();
                var sku = parentTD.attr('id');
                var quantity = null;
                for (var i = 0; i < usersProducts.length; i++) {
                    if (sku == usersProducts[i][0]) {
                        quantity = usersProducts[i][1];
                    }
                }
                if (quantity != null) {
                    // Set original quantity as the value for the input text and disable it
                    parentTD.find('div.quantity_flex_row input[type="text"]').val(quantity).prop("disabled", true);
                } else {
                    alert("An error occurred while attempting to cancel.");
                }
                break;

            case 'Delete':
                // Delete the entire row by overwriting the cookie
                var sku = parentTD.attr('id');
                cart.delete(sku);

                cartSize = cart.size();
                $('#cart_quantity').text(cartSize);

                // Delete product from currentListOfProducts
                var indexToDelete = null;
                for (var i = 0; i < currentListOfProducts.length; i++) {
                    var product = currentListOfProducts[i];
                    if (product[0] == sku) {
                        indexToDelete = i;
                    }
                }
                if (indexToDelete != null) {
                    console.log("deleted at index " + indexToDelete);
                    currentListOfProducts.splice(indexToDelete, 1);
                }

                // Refresh the table
                updateTable();
                break;

            default:
                alert("An error occurred while clicking the buttons");
                break;
        }
    });
}

/*
* productDetailsHandler() - handler of response from ProductDetailsAjax. If response was
*               valid and successful, split the records and set it to currentListOfProducts.
*               Then update the table.
*/
function productDetailsHandler(response) {
    console.log("productDetailsHandler() response:\n" + response);

    if (response == "error all cookies") {
        console.log("ERROR - unable to retrieve data, no cookies were sent");
        return;
    }
    else if (response == "error cookie") {
        console.log("ERROR - unable to retrieve data, cookie with name jadrn025 wasn't sent");
        return;
    }

    var records = response.split('||');
    for (var i = 0; i < records.length; i++) {
        var recordInformation = records[i].split('|');
        currentListOfProducts[i] = recordInformation;
    }
    updateTable();
}

/*
* updateTable() - build html string for each row of the table. Each row displays the
*               Product image, Product name (Vendor + Manufacturer ID), Product Description,
*               Quantity, and Price.
*               Refresh the order summary upon completion.
*/
function updateTable() {
    console.log("updateTable()");

    // Check if cart is empty
    if (cartSize == 0) {
        clearCartAndOrder();
        return;
    }

    resetCartAndOrder();

    var tableString = "";
    tableString += "<table>";

    var usersProducts = cart.getCartArray();

    for (var i = 0; i < currentListOfProducts.length; i++) {
        // Find the quantity the user wants to purchase based on the sku of the current product
        // being iterated over
        var usersQuantity = 0;
        for (var p = 0; p < usersProducts.length; p++) {
            if (usersProducts[p][0] == currentListOfProducts[i][0]) {
                usersQuantity = usersProducts[p][1];
                break;
            }
        }

        tableString += "<tr><td><img src=\"/~jadrn025/proj1/product_images/" + currentListOfProducts[i][8] +
        "\" alt=\"" + currentListOfProducts[i][2] + " " + currentListOfProducts[i][1] +
        "\"/></td><td><p>" + currentListOfProducts[i][2] + " " + currentListOfProducts[i][1] +
        "</p>" + currentListOfProducts[i][4] + "</td><td id=\"" + currentListOfProducts[i][0] +
        "\"><div class=\"quantity_flex_row\"><label>Qty</label><input type=\"text\" value=\"" +
        usersQuantity + "\" disabled=\"true\" size=\"4\" maxlength=\"3\"></div>" +
        "<div class=\"quantity_flex_row\"><input type=\"button\" value=\"Change\">" +
        "<input type=\"button\" value=\"Delete\"></div></td><td>$" +
        String( (parseFloat(currentListOfProducts[i][6], 10) * parseInt(usersQuantity, 10)).toFixed(2) ) + "</td></tr>";
    }

    tableString += "</table>";
    var tableHandle = document.getElementById('order_table_div');
    tableHandle.innerHTML = tableString;

    updateOrderSummary();
}

/*
* updateOrderSummary() - build html string that displays the cost and price
*               of the items the user ordered.
*/
function updateOrderSummary() {
    console.log("updateOrderSummary()");

    var tableString = "";
    var usersProducts = cart.getCartArray();
    // Check if userProducts is empty
    if (cartSize == 0) {
        clearCartAndOrder();
        return;
    }

    resetCartAndOrder();

    var size = cart.size();

    // Tax is applied on the total, Shipping fee applied for each item
    var taxMultiplier = 0.0775;
    var shippingFee = 5.00;

    var subTotal = 0;
    for (var i = 0; i < usersProducts.length; i++) {
        for (var p = 0; p < currentListOfProducts.length; p++) {
            if (currentListOfProducts[p][0] == usersProducts[i][0]) {
                var retailPrice = parseFloat(currentListOfProducts[p][6], 10);
                var quantity = parseInt(usersProducts[i][1], 10);
                subTotal += (retailPrice * quantity);
            }
        }
    }

    var shipping = (shippingFee * size);
    var tax = ((subTotal + shipping) * taxMultiplier).toFixed(2);
    var total = (subTotal + shipping + parseFloat(tax)).toFixed(2);

    subTotal = subTotal.toFixed(2);
    shipping = shipping.toFixed(2);

    tableString += "<table><tr><td>Subtotal</td><td>$" + subTotal +
    "</td></tr><tr><td>Shipping<p>*Flat rate ($5.00)</p></td>" + "<td>$" + shipping +
    "</td></tr><tr><td>Tax</td><td>$" + tax + "</td></tr><tr><td>Total</td><td>$" + total +
    "</td></tr></table>";

    var tableHandle = document.getElementById('order_summary_div');
    tableHandle.innerHTML = tableString;
}

/*
* resetCartAndOrder() - when there are items in the cart to display, change the css to
*               the table and the order summary.
*/
function resetCartAndOrder() {
    $('#content').css({
        "background-color": "rgba(220, 220, 220, 0.5)",
        "display": "flex",
        "padding": "0px",
    });
}

/*
* clearCartAndOrder() - when there are no items in the cart to display, hide table and
*               order summary and show message for user to browse products.
*/
function clearCartAndOrder() {
    $('#content').html("<p>Please browse and select the products you would like to purchase!</p>").css({
        "background-color": "#FFF",
        "display": "block",
        "padding": "32px",
    });
    $('#order_summary').css("display", "none");
}

/*
* validateQuantity - calls ValidateQuantity.java with POST. For every sku that is invalid,
*       mark the item and notify that it should be removed from the cart before the user
*       can continue onto checkout.jsp.
*/
function validateQuantity() {
    console.log("validateQuantity()");

    var url = "/jadrn025/servlet/ValidateQuantity";
    $.post(url, validateQuantityHandler);
}

function validateQuantityHandler(response) {
    console.log("validateQuantityHandler() - response\n" + response);

    // Clear previous invalid items
    $('#order_table_div table tr').css("border", "none");

    // If response is empty, proceed to checkout
    if (!response.length) {
        window.location.href = "/jadrn025/jsp_files/checkout.jsp";
    }
    else {
        var listOfInvalidSkus = response.split("|");
        $('#order_table_div table tr td:nth-child(3)').each(function() {
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
        toggleFailure("#confirmation_container", invalidQuantityConfirmation);
    }
}

function toggleFailure(selector, text) {
    console.log("toggleFailure()");

    $(selector + ' p').text(text);
    $(selector + ' img').prop('src', '/jadrn025/packback_images/error_transparent.png');
    $(selector).addClass('confirmation_error').css('display', 'flex').fadeIn(1000);
    $("#content").css("margin-top", "20px");
    $(window).scrollTop($(selector).position().top - 120);
}

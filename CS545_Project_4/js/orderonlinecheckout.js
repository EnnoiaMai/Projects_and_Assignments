/*
Nguyen, Thuc
jadrn041
Project #4
Fall 2017
*/

var allProducts;        // a 2D array of all the products
var cart = new shopping_cart("jadrn041");

$(document).ready(function() {

    // AJAX call to get_products Perl script
    allProducts = new Array();

    var size = cart.size();
    $('#menu_cart a:nth-child(2)').text(size);

    if (size == 0) {
        $('#checkout_table_div').html("<div><p>Please browse and select the products you would like to purchase!</p></div>");
        $('#order_summary').css("display", "none");
    } else {
        $('#order_summary').css("display", "block");
        $.get('/perl/jadrn041/get_products.cgi', getProducts);
        attachButtonEvents();
    }
});

function attachButtonEvents() {
    $('#checkout_table_div').on('click', $('input[type="button"]'), function(event) {
        // Return if anything other than the buttons were clicked
        var targetVal = $(event.target).val();
        if ((targetVal != 'Change') && (targetVal != 'Save') && (targetVal != 'Cancel') && (targetVal != 'Delete')) {
            return;
        }

        // parent td element has the sku
        var parentTD = $(event.target).closest('td');

        // Identify the button that was clicked and initiate the respective code block
        switch (targetVal) {
            case 'Change':
                // Change the text to Save, show the Cancel button, create the input text for quantity
                $(event.target).val('Save');
                $(event.target).siblings('input').css("display", "block");
                var quantity = parentTD.find('div.quantity_div').children('p').text();
                parentTD.find('div.quantity_div').html('<input type="text" maxlength="3" value="' +
                quantity + '">');
                break;
            case 'Save':
                // Change the text to Change, hide the Cancel button, create the paragraph for quantity,
                // and set the quantity of the item in the cart. Refresh the table.
                var quantity = parentTD.find('div.quantity_div').children('input').val();
                var pattern = new RegExp(/^[1-9]\d*$/);
                if (!pattern.test(quantity)) {
                    alert("Please enter a valid quantity.");
                    return;
                }

                $(event.target).val('Change');
                $(event.target).siblings('input').css("display", "none");
                parentTD.find('div.quantity_div').html('<p>' + quantity +'</p>');

                sku = parentTD.attr('id');
                cart.setQuantity(sku, quantity);
                var cartSize = cart.size();
                $('#menu_cart a:nth-child(2)').text(cartSize);
                updateTable();
                break;
            case 'Cancel':
                // Change the Save text to Change, hide Cancel button, create the paragraph for quantity,
                // get the original quantity from the cart and set it as text of the paragraph
                $(event.target).siblings('input').val('Change');
                $(event.target).css("display", "none");

                var usersProducts = cart.getCartArray();
                var sku = parentTD.attr('id');
                var quantity = null;
                for (var i = 0; i < usersProducts.length; i++) {
                    if (sku == usersProducts[i][0]) {
                        quantity = usersProducts[i][1];
                    }
                }
                if (quantity != null) {
                    parentTD.find('div.quantity_div').html('<p>' + quantity +'</p>');
                } else {
                    alert("An error occurred while attempting to cancel.");
                }
                break;
            case 'Delete':
                // Delete the entire row by overwriting the cookie and refreshing the table
                var sku = parentTD.attr('id');
                cart.delete(sku);
                var cartSize = cart.size();
                $('#menu_cart a:nth-child(2)').text(cartSize);
                updateTable();
                break;
            default:
                alert("An error occurred while clicking the buttons");
                break;
        }
    });
}

function getProducts(response) {
    var records = response.split(';');
    for (var i = 0; i < records.length; i++) {
        var recordInformation = records[i].split('|');
        allProducts[i] = recordInformation;
    }
    updateTable();
}

function updateTable() {
    var tableString = "";
    var usersProducts = cart.getCartArray();

    // Check if userProducts is empty
    if (usersProducts.length == 0) {
        $('#checkout_table_div').html("<div><p>Please browse and select the products you would like to purchase!</p></div>");
        $('#order_summary').css("display", "none");
        return;
    }
    tableString += "<table><tr><th>Product</th><th>Description</th><th>Quantity</th><th>Price</th></tr>";

    for (var i = 0; i < usersProducts.length; i++) {
        // product is the array of information of that product the user added to the cart
        var product = null;
        for (var p = 0; p < allProducts.length; p++) {
            if (allProducts[p][0] == usersProducts[i][0]) {
                product = allProducts[p];
            }
        }
        tableString += "<tr><td><img src=\"/~jadrn000/PROJ4_IMAGES/" + product[0] + ".jpg\" alt=\"" +
        product[2] + "\"/></td><td><p><b>" + product[2] + "</b></p>" + product[3] + "</td>" +
        "<td id=\"" + product[0] + "\"><div class=\"quantity_flex_row\"><div class=\"quantity_div\"><p>" + usersProducts[i][1] + "</p></div><div class=\"quantity_flex_column\"><input type=\"button\"" + "value=\"Change\"><input type=\"button\" value=\"Cancel\"></div></div><input type=\"button\"" + "value=\"Delete\"></td><td>$" +
        String( (parseFloat(product[6], 10) * parseInt(usersProducts[i][1], 10)).toFixed(2) ) + "</td></tr>";
    }

    tableString += "</table>";
    var tableHandle = document.getElementById('checkout_table_div');
    tableHandle.innerHTML = tableString;

    updateOrderSummary();
}

function updateOrderSummary() {
    var tableString = "";
    var usersProducts = cart.getCartArray();
    // Check if userProducts is empty
    if (usersProducts.length == 0) {
        $('#checkout_table_div').html("<div><p>Please browse and select the products you would like to purchase!</p></div>");
        $('#order_summary').css("display", "none");
        return;
    }

    var size = cart.size();

    // Tax is applied on the total, Shipping fee applied for each item
    var taxMultiplier = 0.08;
    var shippingFee = 2.00;

    var subTotal = 0;
    for (var i = 0; i < usersProducts.length; i++) {
        for (var p = 0; p < allProducts.length; p++) {
            if (allProducts[p][0] == usersProducts[i][0]) {
                var retailPrice = parseFloat(allProducts[p][6], 10);
                var quantity = parseInt(usersProducts[i][1], 10);
                subTotal += (retailPrice * quantity);
            }
        }
    }

    var shipping = (shippingFee * size);
    var tax = (subTotal * taxMultiplier).toFixed(2);
    var total = (subTotal + shipping + parseFloat(tax)).toFixed(2);

    subTotal = subTotal.toFixed(2);
    shipping = shipping.toFixed(2);

    tableString += "<table><tr><td>Subtotal</td><td>$" + subTotal + "</td></tr><tr><td>Shipping *flat rate</td>" +
    "<td>$" + shipping + "</td></tr><tr><td>Tax</td><td>$" + tax + "</td></tr><tr><td>Total</td><td>$" + total +
    "</td></tr></table>";

    var tableHandle = document.getElementById('checkout_order_div');
    tableHandle.innerHTML = tableString;
}

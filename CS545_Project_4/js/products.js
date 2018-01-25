/*
Nguyen, Thuc
jadrn041
Project #4
Fall 2017
*/

var allProducts;        // a 2D array of all the products
var cart = new shopping_cart("jadrn041");

$(document).ready(function() {
    allProducts = new Array();
    // AJAX call to get_products Perl script
    $.get('/perl/jadrn041/get_products.cgi', getProducts);

    var cartSize = cart.size();
    $('#menu_cart a:nth-child(2)').text(cartSize);

    $('#milk').on('click', addNewGrid);
    $('#dark').on('click', addNewGrid);
    $('#nuts_chews').on('click', addNewGrid);
    $('#brittles_toffees').on('click', addNewGrid);
    $('#truffles').on('click', addNewGrid);
    $('#gifts').on('click', addNewGrid);
    $('#holiday').on('click', addNewGrid);

    attachButtonEvent();
});

/*
    Add a new div with the product information to the grid container.
    Depends on ajax call finishing.
*/
function addNewGrid() {
    // Determine which category of chocolates to filter out of the products array
    var filter = determineFilter($(this).val());
    if (filter == "") {
        alert("An error occurred while attempting to retrieve the list of products.");
        return;
    }

    var gridString = "";
    // For every product in the array
    for (var i = 0; i < allProducts.length; i++) {

        // Filter out the appropriate category
        if (allProducts[i][1] == filter) {
            // Build the grid by concatenating it to the string
            gridString += "<div><h4>" + allProducts[i][2]+ "</h4><p><b>" + allProducts[i][3] +
            "</b></p><div><img src=\"/~jadrn000/PROJ4_IMAGES/" + allProducts[i][0] +
            ".jpg\" alt=\"" + allProducts[i][2] + "\"/></div><p>" + allProducts[i][4] +
            "</p><div class=\"price_cart_container\"><p>" + allProducts[i][6] + "</p>" +
            "<div><label for=\"quantityText\">Qty</label><input type=\"text\" id=\"quantityText\" " +
            "size=\"3\" maxlength=\"3\"></div></div>" + "<input type=\"button\" id=\"" + allProducts[i][0] +
            "\" value=\"Add to Cart\"></div>";
        }
    }
    var gridContainerHandle = document.getElementById('products');
    gridContainerHandle.innerHTML = gridString;
}

/*
    The name for the button is different from the name of the category of
    chocolates that are stored in the proj4 database. This function returns
    the name in the database that correlates with the name that we use.
*/
function determineFilter(value) {
    var filter = "";
    switch (value) {
        case "Milk Chocolate":
            filter = "Milk chocolate";
            break;
        case "Dark Chocolate":
            filter = "Dark chocolate";
            break;
        case "Nuts and Chews":
            filter = "Nuts and chews";
            break;
        case "Brittles and Toffees":
            filter = "Brittles and toffies";
            break;
        case "Truffles":
            filter = "Truffles";
            break;
        case "Gifts":
            filter = "Gifts";
            break;
        case "Holiday Assortments":
            filter = "Holiday assortments";
            break;
        default:
            break;
    }
    return filter;
}

/*
    Handler for AJAX call to get_products.cgi
    Separates the records by exploding the array using separator ';'.
    Separates the information of each record by exploding using separator '|'
*/
function getProducts(response) {
    var records = response.split(';');
    for (var i = 0; i < records.length; i++) {
        var recordInformation = records[i].split('|');
        allProducts[i] = recordInformation;
    }

    var gridString = "";
    // For every product in the array
    for (var i = 0; i < allProducts.length; i++) {

        // Filter out the appropriate category
        if (allProducts[i][1] == "Milk chocolate") {
            // Build the grid by concatenating it to the string
            gridString += "<div><h4>" + allProducts[i][2]+ "</h4><p><b>" + allProducts[i][3] +
            "</b></p><div><img src=\"/~jadrn000/PROJ4_IMAGES/" + allProducts[i][0] +
            ".jpg\" alt=\"" + allProducts[i][2] + "\"/></div><p>" + allProducts[i][4] +
            "</p><div class=\"price_cart_container\"><p>" + allProducts[i][6] + "</p>" +
            "<div><label for=\"quantityText\">Qty</label><input type=\"text\" id=\"quantityText\" " +
            "size=\"3\" maxlength=\"3\"></div></div>" + "<input type=\"button\" id=\"" + allProducts[i][0] +
            "\" value=\"Add to Cart\"></div>";
        }
    }
    var gridContainerHandle = document.getElementById('products');
    gridContainerHandle.innerHTML = gridString;
}

/*
    The event must be attached to the products div because events can only be
    attached to DOM elements that are currently there. event.target goes through
    the descendants and the button is checked to be pressed by checking its value.

*/
function attachButtonEvent() {
    $('#products').on('click', $('#products input[type="button"]'), function(event) {

        // Check if the event element has the value 'Add to Cart' which verifies
        // that the button was clicked. Can safely assume event.target is the button
        if ( $(event.target).val() != 'Add to Cart') {
            return;
        }

        // Validate the input text for quantity
        var success = true;
        var pattern = new RegExp(/^[1-9]\d*$/);
        var quantityText = $(event.target).siblings('.price_cart_container').find('input[type="text"]').val();

        // Validate that input text is not empty and that it matches the pattern
        if ( !trim(quantityText) || (!pattern.test(quantityText)) ) {
            success = false;
        }

        // If validated successful, then add/replace the item with the quantity to the cart
        if (success) {
            // The button's id is the sku, so grab that
            var sku = event.target.id;
            cart.setQuantity(sku, quantityText);
            var cartSize = cart.size();
            $('#menu_cart a:nth-child(2)').text(cartSize);

            $('#success_notif div p').text("Your order was added to the cart").css("color", "green");
            $('#success_notif').css("z-index", "10");
            window.setTimeout(function() {
                $('#success_notif').css("z-index", "-10");
            }, 2000);
        } else {
            $('#success_notif div p').text("Please enter a valid quantity.").css("color", "red");
            $('#success_notif').css("z-index", "10");
            window.setTimeout(function() {
                $('#success_notif').css("z-index", "-10");
            }, 2000);
        }
    });
}

function trim(string) {
    var trimmed = $.trim(string);
    return (trimmed.length > 0) ? true : false;
}

/*
* Nguyen, Thuc
* jadrn025
* Project #2
* Spring 2018
*/

var currentListOfProducts;      // current list being populated in the grid
var cart = new shopping_cart("jadrn025");

$(document).ready(function() {

    currentListOfProducts = new Array();
    var cartSize = cart.size();
    $('#cart_quantity').text(cartSize);

    // Event Listener for on click of filter options in the sidebar
    $('form[name="productsFilterForm"] input[type="checkbox"]').on('click', filterOptionChecked);

    // Delegated Events handling when user clicks "Add to Cart"
    addToCartDelegatedEvent();

    // Check classics first to initially populate the grid
    $('#check_category_classics').prop("checked", true);
    filterOptionChecked();
});

/*
* filterOptionChecked() - when user clicks on a filter option, send an AJAX request to
*                   ProductsFilter.java to get back a list of products that matches
*                   the filters.
*/
function filterOptionChecked() {
    console.log("filterOptionChecked()");

    if ($(this).is(':checked')) {
        console.log("checkbox is checked\n");
    }

    var urlPath = "/jadrn025/servlet/ProductsFilter";
    var serializedData = $('form[name="productsFilterForm"]').serialize();

    console.log(serializedData + "\n");

    if ($('form[name="productsFilterForm"] :checkbox:checked').length == 0) {
        var gridContainerHandle = document.getElementById('products_grid');
        gridContainerHandle.innerHTML = "";
        refocus();
        return;
    }

    $.ajax({
        url: urlPath,
        type: "GET",
        data: serializedData,
        processData: false,
        contentType: false,
        success: function(response) {
            console.log("AJAX call to ProductsFilter successful\n");
            updateGrid(response);
        },
        error: function(response) {
            console.log("AJAX call to ProductsFilter returned an error: " + response);
        }
    });
}

/*
* updateGrid() - clear the current list, deserialize the response from the AJAX call
*               and build the grid item for each product.
*/
function updateGrid(response) {
    console.log("updateGrid() - \n" + response);

    currentListOfProducts = [];

    // Split the serialized string from the response per record or product.
    var listOfSerializedProducts = response.split('||');

    // Set currentListOfProducts to the relevant list of products to display
    for (var i = 0; i < listOfSerializedProducts.length; i++) {
        var productInformation = listOfSerializedProducts[i].split('|');
        currentListOfProducts[i] = productInformation;
    }

    // Build the string representing the content for the grid
    var gridString = "";
    for (var i = 0; i < currentListOfProducts.length; i++) {

        var description = currentListOfProducts[i][4];
        if (description.length > 60) {
            description = description.substring(0, 60);
        }
        description += "...";

        var status;
        var statusClass;
        if (currentListOfProducts[i][6] > 0) {
            status = "In Stock";
            statusClass = "in_stock";
        } else {
            status = "Coming Soon";
            statusClass = "coming_soon";
        }

        // Build the grid by concatenating it to the string
        gridString += "<div class=\"product_box\"><div class=\"product_image\">" +
        "<img src=\"/~jadrn025/proj1/product_images/" + currentListOfProducts[i][7] + "\" alt=\"" +
        currentListOfProducts[i][2] + " " + currentListOfProducts[i][1] + "\"></div><p>" +
        currentListOfProducts[i][2] + " " + currentListOfProducts[i][1] + "</p><p>" + description +
        "</p><div class=\"product_status_price\"><div><p class=\"" + statusClass  + "\">" + status +
        "</p><p>" + currentListOfProducts[i][6] + " left</p></div><p>$" + currentListOfProducts[i][5] +
        "</p></div><button type=\"button\" id=\"" + currentListOfProducts[i][0] +
        "\">Add to Cart</button></div>";
    }
    var gridContainerHandle = document.getElementById('products_grid');
    gridContainerHandle.innerHTML = gridString;

    refocus();
}

/*
    Delegated event must be attached to products_grid parent container because events can only be
    attached to DOM elements that are currently there. event.target goes through
    descendants and button is checked to see if it was clicked by checking its text value.

    Clicking "Add to Cart" calls ProductDetails.java, which forwards to ProductDetails.jsp.
    Example of dynamic outputs.
*/
function addToCartDelegatedEvent() {
    $('#products_grid').on('click', $('#products_grid input[type="button"]'), function(event) {

        // Check if the event element has the value 'Add to Cart' which verifies
        // that the button was clicked, which can be referenced by event.target.
        if ( $(event.target).text() != 'Add to Cart') {
            return;
        }

        var sku = event.target.id;
        var productIndex = $(event.target).closest('div').index();
        console.log("sku = " + sku + "\nProduct Index = " + productIndex);
        console.log("current list of products sku is " + currentListOfProducts[productIndex][0]);

        // Call ProductDetails.java and redirect to ProductDetails.jsp
        var urlPath = "/jadrn025/servlet/ProductDetails?sku=" + currentListOfProducts[productIndex][0];
        window.location.href = urlPath;
    });
}

function refocus() {
    console.log("refocus()");
    $('html, body').animate({
        scrollTop: 0
    }, 0);
}

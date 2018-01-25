/*
Nguyen, Thuc
jadrn041
Project #4
Fall 2017
*/

var allProducts;
var usedRandomNumbers;
var cart = new shopping_cart('jadrn041');
$(document).ready(function() {
    allProducts = new Array();
    usedRandomNumbers = new Array();
    $.get('/perl/jadrn041/get_products.cgi', getProducts);

    var cartSize = cart.size();
    $('#menu_cart a:nth-child(2)').text(cartSize);
});

function getProducts(response) {
    var records = response.split(';');
    for (var i = 0; i < records.length; i++) {
        var recordInformation = records[i].split('|');
        allProducts[i] = recordInformation;
    }

    updateTrendingProducts();
}

function updateTrendingProducts() {
    var flexString = "";
    var productsArrayLength = allProducts.length;

    for (var i = 0; i < 3; i++) {
        var randomNumber = returnRandomNumber(productsArrayLength);
        while (usedRandomNumbers.includes(randomNumber)) {
            randomNumber = returnRandomNumber(productsArrayLength);
        }
        usedRandomNumbers.push(randomNumber);

        flexString += "<div><h3>" + allProducts[randomNumber][2] + "</h3><img src=\"/~jadrn000/PROJ4_IMAGES/" +
        allProducts[randomNumber][0] + ".jpg\" alt=\"" + allProducts[randomNumber][2] + "\"><p>" +
        allProducts[randomNumber][3] + "</p></div>";
    }
    var flexContainerHandle = document.getElementById('flex_row');
    flexContainerHandle.innerHTML = flexString;
}
function returnRandomNumber(length) {
    var randomNumber = Math.floor(Math.random() * length);
    return randomNumber;
}

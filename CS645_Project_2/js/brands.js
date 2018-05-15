/*
* Nguyen, Thuc
* jadrn025
* Project #2
* Spring 2018
*/

var imageFileList = [
    "proj2_adidas_5.jpg",
    "proj2_jansport_2.jpg",
    "proj2_herschel_1.jpg",
    "proj2_highsierra_2.png",
    "proj2_northface_2.jpg"
];

var cart = new shopping_cart("jadrn025");

$(document).ready(function(){

    var cartSize = cart.size();
    $('#cart_quantity').text(cartSize);

    $('.brand_container').each(function(index) {
        console.log("Adding images");
        $(this).css("background-image", "url(\"/jadrn025/packback_images/" + imageFileList[index] + "\")");
    });
});

/*
* Nguyen, Thuc
* jadrn025
* Project #2
* Spring 2018
*/

$(document).ready(function() {

    $("#searchbar").on("keyup", function(event) {
        // Check if user tapped enter on keyboard
        if (event.keyCode == 13) {
            console.log("clicked entered for searchbar");
            var searchTerm = $(this).val();

            // Call SearchProducts.java and redirect to search_products.jsp
            var urlPath = "/jadrn025/servlet/SearchProducts?search=" + searchTerm;
            window.location.href = urlPath;            
        }
    });
});

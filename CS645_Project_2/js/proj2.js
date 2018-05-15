/*
* Nguyen, Thuc
* jadrn025
* Project #2
* Spring 2018
*/

// HEADING AND TEXT/DESCRIPTION FOR THE SLIDER
var sliderHeadingList = [
    "Variety",
    "Made For School",
    "Travel With Comfort"
]
var sliderTextList = [
    "Offering backpack collections from well-known brands such as Herschel, The North Face, and more...",
    "Check out our wide selection of backpacks, many great picks for school.",
    "To carry your essentals for any kind of adventure."
];

// HEADING, DESCRIPTION, AND IMAGE PATH FOR BRANDS
var brandsHeadingList = [
    "Adidas", "Herschel", "High Sierra", "JanSport", "The North Face"
];
var brandsDescriptionList = [
    "The modern and latest designs of the Adidas collection provides a fresh and clean look.",
    "With a simple style, the Herschel backpack collection is designed to meet all your needs.",
    "High Sierra offers backpacks for a wide variety or purposes but also excel in hiking equipment",
    "Classic design, Jansport has held true to its traditions in offering comfort and simplicity",
    "The North Face backpacks are ideal for retaining any kind of essentials for travel and adventure."
];
var brandsImageFileList = [
    "proj2_adidas_3.jpg",
    "proj2_herschel_3.jpg",
    "proj2_highsierra.jpg",
    "proj2_jansport.jpg",
    "proj2_northface_1.jpg"
];

var currentSliderIndex = 1;
var timeoutFunction;

var listOfTrendingProducts;

var cart = new shopping_cart("jadrn025");

$(document).ready(function() {

    var cartSize = cart.size();
    $('#cart_quantity').text(cartSize);

    // HEADER IMAGE SLIDER //
    $('.slider_previous').on('click', function() {
        clearTimeout(timeoutFunction);
        incDecCurrentSlide(-1);
    });
    $('.slider_next').on('click', function() {
        clearTimeout(timeoutFunction);
        incDecCurrentSlide(1);
    });
    $('.slider_click').on('click', function() {
        clearTimeout(timeoutFunction);
        setCurrentSlide($(this).index() + 1);
    })
    displaySlides();

    // TRENDING PRODUCTS //
    $.get("/jadrn025/servlet/TrendingProducts", trendingProductsHandler);

    $("#trending_preview img, #trending_details > p:first-child").on("click", navigateToProductDetails);
    // trendingColumnDelegatedEvent();

    // FEATURED BRANDS //
    $('.brand_detail_box > div').each(function(index) {
        console.log("Adding images");
        $(this).css("background-image", "url(\"/jadrn025/packback_images/" + brandsImageFileList[index] + "\")");
    });
    $('.details_dim p:nth-child(1)').each(function(index) {
        $(this).text(brandsHeadingList[index]);
    });
    $('.details_dim p:nth-child(2)').each(function(index) {
        $(this).text(brandsDescriptionList[index]);
    });

    // $(".brand_detail_box > div").on("mouseenter", displayDetails);
    // $(".brand_detail_box > div").on("mouseleave", hideDetails);
    $(".brand_detail_box > div").on("click", navigateToBrandsPage)
});

/*
* Functions for the image slider
* incDecCurrentSlide() - when user clicks the arrows to forward or return to the next or
*               previous image.
* setCurrentSlide() - when user clicks on the dots to change the image.
* displaySlides() - show previous or next image, calls setTimeout() so that this function
*               is called recursively after a delay.
*/
// Next and previous control buttons
function incDecCurrentSlide(amount) {
    currentSliderIndex += amount;
    displaySlides();
}

// Click Buttons to set the image
function setCurrentSlide(amount) {
    currentSliderIndex = amount;
    displaySlides();
}

function displaySlides() {
    var slides = $('.single_slide');

    // Check that current index of the slider doesn't go out of bounds
    if (currentSliderIndex > slides.length) {
        currentSliderIndex = 1;
    }
    if (currentSliderIndex < 1) {
        currentSliderIndex = slides.length;
    }

    // Reset each slider image display property to none and remove class active
    // for each click button. Set display to block for the current slide and
    // active for the current click button associated with the current slide.
    slides.each(function(index) {
        if (index == currentSliderIndex - 1) {
            $(this).css("display", "block");
        }
        else {
            $(this).css("display", "none");
        }
    });

    $('.slider_click').each(function(index) {
        if (index == currentSliderIndex - 1) {
            $(this).addClass('active');
        }
        else {
            $(this).removeClass('active');
        }
    });

    // Set the appropriate heading and text description for the current slide.
    $('.text')[currentSliderIndex - 1].innerHTML = "<h2>" +sliderHeadingList[currentSliderIndex - 1] + "</h2><p>" + sliderTextList[currentSliderIndex - 1] + "</p>";

    // Increment the slider index and call this function again after 5 seconds.
    timeoutFunction = setTimeout(function(){
        currentSliderIndex++;
        displaySlides();
    }, 5000);
}

function trendingProductsHandler(response) {
    console.log("trendingProductsHandler() - response:\n" + response);

    if (response == "error") {
        console.log("Call to TrendingProducts.java returned an error");
        return;
    }

    listOfTrendingProducts = response.split("||");

    $("#trending_column > div").each(function(index) {
        var product = listOfTrendingProducts[index].split("|");
        console.log("image file path is " + product[4]);
        $(this).css("background-image", "url(\"/~jadrn025/proj1/product_images/" +
            product[4] + "\")");
    });

    changePreviewImage();
}

function changePreviewImage() {
    console.log("trendingColumnDelegatedEvent()");

    // Initially set preview image as first product in listOfTrendingProducts
    var firstProduct = listOfTrendingProducts[0].split("|");
    $("#trending_preview img").prop({
        "src": "/~jadrn025/proj1/product_images/" + firstProduct[4],
        "id": firstProduct[0]
    });
    $("#trending_details > p:first-child").text(firstProduct[2] + " " + firstProduct[1]);
    $("#trending_details > p:nth-child(2)").text(firstProduct[3]);

    // For every click of an image in the column, show the preview of that image,
    // and change the details in the detail pane.
    $("#trending_column > div").on("click", function(event) {
        var index = $(this).index();
        var product = listOfTrendingProducts[index].split("|");
        $("#trending_preview img").prop({
            "src": "/~jadrn025/proj1/product_images/" + product[4],
            "id": product[0]
        });

        // The product vendor and manufacturerID
        $("#trending_details > p:first-child").text(product[2] + " " + product[1]);

        // The product description
        $("#trending_details > p:nth-child(2)").text(product[3]);
    });
}

function navigateToProductDetails() {
    console.log("navigateToProductDetails()");

    var id = $("#trending_preview img").prop("id");
    var urlPath = "/jadrn025/servlet/ProductDetails?sku=" + id;
    window.location.href = urlPath;
}


function navigateToBrandsPage() {
    console.log("navigateToBrandsPage()");
    window.location.href = "/jadrn025/jsp_files/brands.jsp";
}

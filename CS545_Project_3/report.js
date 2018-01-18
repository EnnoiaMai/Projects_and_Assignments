/*
Nguyen, Thuc
jadrn041
Project #3
Fall 2017
*/

$(document).ready(function() {
    setEventListeners();
});

function setEventListeners() {
    $("#back_button").on("click", function() {
        window.location.href = "index.html";
    });
    $("#back_button").on("mouseover", function() {
        $(this).attr("src", "back_button_hover.png");
    });
    $("#back_button").on("mouseout", function() {
        $(this).attr("src", "back_button.png");
    });
}

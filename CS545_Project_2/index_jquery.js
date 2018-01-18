/*
Nguyen, Thuc
jadrn041
Project #2
Fall 2017
*/

$(document).ready(function() {
    $('a[href^="#"]').on('click', function(event) {
        var anchorHandle = $(this.getAttribute('href'));
        if (anchorHandle.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: anchorHandle.offset().top
            }, 600);
        }
    });
});

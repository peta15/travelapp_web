//jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    if ($(".navbar-home").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});

$(function() {
    $.stellar();
});
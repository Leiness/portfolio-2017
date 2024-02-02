/**
 * Created by Leiness on 7/21/16.
 */
var  mainNav = $(".mini-nav"),
    sticky = "sticky",
    startValue = $('.header').outerHeight();

$(window).scroll(function() {
    if( $(this).scrollTop() > startValue ) {
        mainNav.addClass(sticky);
    } else {
        mainNav.removeClass(sticky);
    }
});
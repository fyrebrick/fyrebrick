$(document).ready(function(){
    //$("#"+PUG_active).removeClass("not-active").addClass("active");
});
function startLoading(){
    $('#fyrebrick').empty().append('<img src="/images/logo-grey-loading.svg" width="30" height="30" alt="FyreBrick-loading" />');
}
function stopLoading(){
    $('#fyrebrick').empty().append('<img src="/images/logo-grey.svg" width="30" height="30" alt="FyreBrick-loading" />');
}
function detectBrowser() { 
    if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ) {
        return 'Opera';
    } else if(navigator.userAgent.indexOf("Chrome") != -1 ) {
        return 'Chrome';
    } else if(navigator.userAgent.indexOf("Safari") != -1) {
        return 'Safari';
    } else if(navigator.userAgent.indexOf("Firefox") != -1 ){
        return 'Firefox';
    } else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) {
        return 'IE';//crap
    } else {
        return 'Unknown';
    }
} 

//smart scroll
$(document).ready(function(){
    let direction = "down";
    $('body').css('padding-top', $('.navbar').outerHeight() + 'px');
    if ($('.smart-scroll').length > 0) { // check if element exists
        var last_scroll_top = 0;
        if($("#scroll_area").length>0){
            $('#scroll_area').on('scroll', function() {
                scroll_top = $(this).scrollTop();
                if(direction=="up" && scroll_top < last_scroll_top) {
                    $('.smart-scroll').removeClass('scrolled-down').addClass('scrolled-up');                
                    //$('body').css('padding-top', $('.navbar').outerHeight() + 'px');
                    $('body').animate({'padding-top': $('.navbar').outerHeight() + 'px'},300,"linear");
                    direction="down";
                }
                else if(direction=='down' && scroll_top > last_scroll_top) {
                    $('.smart-scroll').removeClass('scrolled-up').addClass('scrolled-down');
                    $('body').animate(  {'padding-top': '0px'},300,"linear");
                    direction="up";
                }
                
                last_scroll_top = scroll_top;
            });
        }else{
            $(window).on('scroll', function() {
                scroll_top = $(this).scrollTop();
                if(scroll_top < last_scroll_top) {
                    $('.smart-scroll').removeClass('scrolled-down').addClass('scrolled-up');
                }
                else {
                    $('.smart-scroll').removeClass('scrolled-up').addClass('scrolled-down');
                }
                last_scroll_top = scroll_top;
            });
        }
    }
})
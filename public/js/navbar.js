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
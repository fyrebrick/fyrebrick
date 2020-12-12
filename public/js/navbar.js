$(document).ready(function(){
    //$("#"+PUG_active).removeClass("not-active").addClass("active");
});
function startLoading(){
    $('#fyrebrick').empty().append('<img src="/images/logo-grey-loading.svg" width="30" height="30" alt="FyreBrick-loading" />');
}
function stopLoading(){
    $('#fyrebrick').empty().append('<img src="/images/logo-grey.svg" width="30" height="30" alt="FyreBrick-loading" />');
}
$(document).ready(function(){
    $("body").on('click',".wpcc-btn",function(e){
        $.ajax({
            url:'/acceptCookies',
            method:"POST"
        }).done(function(){
            console.log('Accepted cookies');
        })
    });
    $("#messages").on('click',"#message-close-button", function(){
        $("#messages").fadeOut();
    })
});
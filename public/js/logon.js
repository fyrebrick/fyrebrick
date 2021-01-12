$(document).ready(function(){
    $("body").on('click',".wpcc-btn",function(e){
        $.ajax({
            url:'/acceptCookies',
            method:"POST"
        }).done(function(){
            console.log('Accepted cookies');
        })
    });
});
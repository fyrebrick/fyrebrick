$(document).ready(function (){
    //opening banners 
    $('.banner').on('click',function(e){
        const target = e.target.parentNode.className;
        console.log(target);
        if(target==="banner"){
            $(e.target.parentNode.parentNode.children[1]).slideToggle();
        }else if (target==="list-group-item"){
            $(e.target.parentNode.children[1]).slideToggle();
        }
    })
    //update inventory interval
    $("#inventoryInterval").on('mouseup',function(){
        $.ajax({
            url:"/my/settings/inventoryInterval",
            method:"PUT",
            data:{
                interval:$("#inventoryInterval").val()
            }
        }).done(function(data){
            console.log(data);
        });
    });

    //bricklink api for
    $('#apiButton').on('click',function(){
        $.ajax({
            url:"/my/settings/bricklinkApi",
            method:"PUT",
            data:{
                CONSUMER_KEY:$("#consumerKey").val(),
                CONSUMER_SECRET:$("#consumerSecret").val(),
                TOKEN_SECRET:$("#tokenSecret").val(),
                TOKEN_VALUE:$("#tokenValue").val(),
            }
        }).done(function(data){
            $(".api-input").removeClass("is-valid");
            $(".api-input").removeClass("is-invalid");
            if(data.success){
                $(".api-input").addClass("is-valid");
            }else{
                if(data.isEmpty){
                    if(data.isEmpty.consumerKey){
                        $("#consumerKey").addClass("is-invalid");
                    }
                    if(data.isEmpty.consumerSecret){
                        $("#consumerSecret").addClass("is-invalid");
                    }
                    if(data.isEmpty.tokenValue){
                        $("#tokenValue").addClass("is-invalid");
                    }
                    if(data.isEmpty.tokenSecret){
                        $("#tokenSecret").addClass("is-invalid");
                    }
                }else{
                    $(".api-input").addClass("is-invalid");
                }
            }
        })
    })
});
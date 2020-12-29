$(document).ready(function (){
    //show modal warning update orders
    $('#show-modal-update-orders').on('click', function(){
        $("#warningOrderUpdate").modal('show');
    });

    //opening banners 
    $('.banner').on('click',function(e){
        const target = e.target.parentNode.className;
        console.log(e.target.parentNode.className);
        $(".settings").slideUp();
        $("*").removeClass('open');
        if(target==="banner"){
            $(e.target.parentNode.parentNode.children[1]).slideToggle();
            $(e.target.parentNode).addClass('open');
        }else if (target==="list-group-item"){
            $(e.target.parentNode.children[1]).slideToggle();
            $(e.target.parentNode.children[0]).addClass('open');
        }
    })
    //update orders button
    $("#update-orders").on('mouseup',function(){
        $.ajax({
            url:"/my/settings/update/orders",
            method:"GET",
            beforeSend:function(){
                $("#update-orders i").addClass("loading");
            }
        }).done(function(data){
            console.log(data);
            $("#update-orders i").removeClass("loading");
        });
    });
    //update inventory button
    $("#update-inventory").on('mouseup',function(){
        $.ajax({
            url:"/my/settings/update/inventory",
            method:"GET",
            beforeSend:function(){
                $("#update-inventory i").addClass("loading");
            }
        }).done(function(data){
            console.log(data);
            $("#update-inventory i").removeClass("loading");
        });
    });

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
                userName:$("#userName").val()
            }
        }).done(function(data){
            $("input").removeClass("is-valid");
            $("input").removeClass("is-invalid");
            if(data.success){
                $("input").addClass("is-valid");
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
                    if(data.isEmpty.userName){
                        $("#userName").addClass("is-invalid");
                    }
                }else{
                    $(".api-input").addClass("is-invalid");
                }
            }
        })
    })
});
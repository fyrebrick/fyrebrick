$(document).ready(function (){
    $('.list-group-item').on('click',function(e){
        const target = e.target.parentNode.className;
        if(target==="list-group"){
            $(e.target.children[2]).slideToggle();
        }else if (target==="list-group-item"){
            $(e.target.parentNode.children[2]).slideToggle();

        }
        $(e.target.parentNode.parentNode.children[3]).slideToggle();
    })
});
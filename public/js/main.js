$(document).ready(function(){
    $(".addPasswordEye").each(function(index){
        addEye($(this));
    });
    $(".form-group").on('click','.passwordEye',function(){
        if($(this).hasClass("viewing")){
            hidePassword($(this));
        }else{
            viewPassword($(this));
        }
    });
})



function addEye(dom){
    const eye = `<i class="passwordEye fas fa-eye"></i>`;
    $(dom).after(eye);  
}

function viewPassword (dom){
    const eye = `<i class="passwordEye viewing fas fa-eye-slash"></i>`;
    $($($(dom).parents()[0]).children()[1]).attr('type','text');
    $($($(dom).parents()[0]).children()[1]).after(eye);
    $(dom).remove();
}

function hidePassword (dom){
    const eye = `<i class="passwordEye fas fa-eye"></i>`;
    $($($(dom).parents()[0]).children()[1]).attr('type','password');
    $($($(dom).parents()[0]).children()[1]).after(eye);
    $(dom).remove();
}
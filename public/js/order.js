$(document).ready(function () {
    sortableTableId = "mainTable";
    addSortIcons();
    document.querySelectorAll("#mainTable th.sortable").forEach(function (item){
        item.addEventListener("click",sortTable)
    })
    $("#3").click();
    document.querySelectorAll('input.checkbox-scale').forEach(function (item) {
        item.addEventListener('click',makeCheckboxRequest)
    });
    document.querySelectorAll(".bl_img").forEach(function (item){
        item.addEventListener("click",show_modal)
    })
    if(detectBrowser()==="Firefox"){
        $("#dynamicTable").append("<tr style='height:150px'></tr>");
    }
});

function makeCheckboxRequest (e) {
    let id = e.target.id.substr(1);
    $.ajax({
        method: "PUT",
        url: window.location.pathname,
        data: {
            inventory_id:id
        },
        beforeSend: startLoading,
        error:function(error){
            console.log(error.message);
            if (window.alert("Checkbox gave an error. please reload.")) {
                location.reload();
            }
        },
        fail:function(error){
            console.log(error.message);
            if(window.alert("Checkbox failed. please reload.")){
                location.reload();
            }
        }
    }).done(function (data) {
        const progress = render_progress(data.order);
        $('.progress-bar').css("background-color",progress.progressBar.backgroundColor)
        $('.progress-bar').css('width',progress.progressBar.width+"%");
        $('.progress-numbers').css('color',progress.progressNumbers.style);
        data.order.items.forEach(function(batch){
            batch.forEach(function(item){
                if(item.isChecked){
                    $("#row"+item.inventory_id).addClass('row_checked');
                    $("#C"+item.inventory_id).parent().parent().attr('data-order',2);
                }else{
                    $("#row"+item.inventory_id).removeClass('row_checked');
                    $("#C"+item.inventory_id).parent().parent().attr('data-order',1);
                }
            })
        })
        $('.progress-numbers').text(data.order.orders_checked+"/"+data.order.unique_count);
        stopLoading();
    });
}

function show_modal(e){
    let src;
    try{
     src = $("#"+e.target.id).attr('src');
    }catch(e){};
    frontend.order.items.forEach(function(batch){
        batch.forEach(function(i){
            if(i.inventory_id==e.target.id.substr(3)){
                const encode_str = i.item.name.replaceAll('&#40;','(').replaceAll("&#41;",")");
                $("#enlargedTitleLabel").text("Item no. "+i.item.no+" price: "+Number(i.unit_price_final).toFixed(2)+" "+i.currency_code);
                $("#enlargedFooter").text(unescape(encode_str)); //does not want to unescape
                const link = "https://www.bricklink.com/v2/inventory_detail.page?invID="+i.inventory_id;
                $("#enlargedItemLink").attr('href',link);
               } 
        })
    })
    $("#enlargedImg").attr('src',src);
    $('#enlarge').modal('show');
}
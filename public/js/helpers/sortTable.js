/**
 * @author snakehead007
 * @description
 * 
 * To use this module first change the variable `sortableTableId` to your preferred table id
 * Use the `sortTable` function in an eventListener on the element thead th
 * `addSortIcons` will add sort icons to each header with the '.sortable' class
 * @example
 * sortableTableId = "mainTable";
 * addSortIcons();
 * document.querySelectorAll("#"+sortableTableId+" th.sortable").forEach(function (item){
 *      item.addEventListener("click",sort_table)
 * })
 */
var sortableTableId = "";

function sortTable(e){
    const row_number = e.target.id;
    let rows = $("#"+sortableTableId+" tbody tr");
    let type = "asc";
    if($(e.target).data('type')==='asc'){
        type = 'desc'
        $(e.target).data("type",type);
        $("#"+e.target.id+" .sort-box").empty().append("<i class=\"fas fa-sort-up sort-active sort-button\"></i>");
    }else if($(e.target).data('type')==='desc'){
        type = 'asc';
        $(e.target).data("type",type);
        $("#"+e.target.id+" .sort-box").empty().append("<i class=\"fas fa-sort-down sort-button sort-active\"></i>");
    }else{
        console.log('found nothing');
    }
    rows.sort(function(a,b){
        if(type==='desc'){
            return $($(a).children()[row_number]).data('order') - $($(b).children()[row_number]).data('order');
        }else if(type==='asc'){
            return $($(b).children()[row_number]).data('order') - $($(a).children()[row_number]).data('order');
        }
    });
    
    $("#"+sortableTableId+" tbody")
    .empty()
    .append(rows);
}

function addSortIcons(){
    const sort = "<i class=\"fas fa-sort sort-button sort-inactive\"></i>";
    $("#"+sortableTableId+" th.sortable .sort-box").each(function(i){
        $(this).append(sort);
    })
    $("#"+sortableTableId+" th.sortable").attr('data-type','desc');
}
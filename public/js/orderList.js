$(document).ready(function () {
    sortableTableId = "mainTable";
    addSortIcons();
    document.querySelectorAll("#mainTable th.sortable").forEach(function (item){
        item.addEventListener("click",sortTable)
    })
    $("#0").click();
});

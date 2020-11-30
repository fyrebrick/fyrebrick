$(document).ready(function () {
    if (performance.navigation.type == 2) {
        location.reload(true);
    }
    add_order_to_headers("mainTable")
    getData();
    function clickTableRow (e){
        //when pressed table row: close all rows first, open this row
        //info in rows are
        let id = e.target.parentNode.id;
        if($(e.target).hasClass("table-data")){
            id = e.target.parentNode.id;
        }else if($(e.target).hasClass("progress")
            ||$(e.target).hasClass("progress-numbers")
            ||$(e.target).hasClass("status-badge")
            ||$(e.target).hasClass("long_date")
            ||$(e.target).hasClass("short_date")){
            id = e.target.parentNode.parentNode.id;
        }else if($(e.target).hasClass("status-name")||$(e.target).hasClass("data-status")){
            id = e.target.parentNode.parentNode.parentNode.id;
        }
        window.location.href ="/account/orders/"+id+"/items";

    }
    function getData (){
        $.ajax({
            method:'GET',
            url: '/api/orders?direction=in&status=pending,updated,processing,ready,paid,packed',
            beforeSend: startLoading()
        }).done(function(data){
            if(data){
                try{
                    data = JSON.parse(data);
                }catch(e){}
                console.log(data);
                if(data.data){
                    if(data.data.length !== 0){
                        data.data.forEach(function(order){
                        let t = "<tr id='"+order.order_id+"'>";
                                t += "<td data-order='"+order.order_id+"'class='table-data order_number d-flex justify-content-center'>";
                                    t+=render_order_id(order.order_id);
                                t += "</td>";
                                t += "<td data-order='"+new Date(order.date_ordered).getTime()+"' class='table-data order_date'>";
                                    t+="<div class='long_date'>"+render_date_ordered(order.date_ordered,'long')+"</div>";
                                    t+="<div class='short_date'>"+render_date_ordered(order.date_ordered,'short')+"</div>";
                                t += "</td>";
                                t += "<td>";
                                    t+=render_status(order.status).span;
                                t += "</td>";
                                t += "<td class='table-data progress-col' id='P"+order.order_id+"'>";
                                  t += "</td>";   
                            t+="</tr>";
                            $("#dynamicTable").append(t);
                            render_progress(order);
                        });
                    }else{
                        $("#mainTable").empty().append("<div class='nothing-found'>We couldnt find any orders.</div>")
                    }
                }else{
                    $("#mainTable").empty().append("<div class='no-data-in-data'>Something went wrong (0001)</div>")
                }
            }else{
                $("#mainTable").empty().append("<div class='no-data-in-data'>Something went wrong (0002)</div>")
            }
            addListenersTable();
            $("#0").click();
            stopLoading();
        });
    }
    function add_order_to_headers(table_id){
        const sort = "<i class=\"fas fa-sort sort-button sort-inactive\"></i>";
        $("#"+table_id+" th.sortable .sort-box").each(function(i){
            $(this).append(sort);
        })
        $("#"+table_id+" th.sortable").attr('data-type','desc');
    }
    function sort_table(e){
        const table_id = "mainTable";
        const row_number = e.target.id;
        let rows = $("#"+table_id+" tbody tr");
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
                return $($(b).children()[row_number]).data('order')- $($(a).children()[row_number]).data('order');
            }
        });
        $("#"+table_id+" tbody")
        .empty()
        .append(rows);  
    }
    function render_progress (order) {
        $.ajax({
            method: "GET",
            url:"/account/order/" +order.order_id + "?orders_total=" + order.unique_count
        }).done(add_orders_checked);
    }
    function addListenersTable(){
        document.querySelectorAll("#mainTable td").forEach(function (item){
            item.addEventListener("click",clickTableRow)
        })
        document.querySelectorAll("#mainTable th.sortable").forEach(function (item){
            item.addEventListener("click",sort_table)
        })
    }
    function add_orders_checked (data) {
        //let text_progress = data.orders_checked + "/" + data.orders_total;
        let not_started = "background-color:#dc3545;"
        let done = "background-color:#28a745;";
        let in_progress = "background-color:#ffc107;";
        let on_error = "background-color:#6c757d;"
        let status = "";
        let width = Math.round((Number(data.orders_checked)/Number(data.orders_total))*100.0);
        //console.log(width);
        if (data.orders_checked <= 0) {
            status = not_started
        } else if (data.orders_checked < data.orders_total) {
            status = in_progress;
        } else if (data.orders_checked === data.orders_total) {
            status = done;
        } else {
            status = on_error;
        }
        $("#P"+data.order_id).append("<div class=\"progress\" style=\"height: 20px;\"><div class=\"progress-bar\" role=\"progressbar\" style='"+status+"width:"+width+"%;' aria-valuenow=\"25\" aria-valuemin=\"0\" aria-valuemax=\"100\"></div></div>"   
            +"<div class='progress-numbers' style='"+((status===done)?'color:#FFF':'color:#000')+"'>"+data.orders_checked+"/"+data.orders_total+"</div>"+
            "<span style=\""+status+((status===done||status===not_started)?'color:#FFF':'color:#000')+"\"class=\"progress-small badge\">"+data.orders_checked+"/"+data.orders_total+"</span>"
        );
        $("#P"+data.order_id).attr("data-order",width);
    }
    function render_status(status){
        let icon ='error';
        let color = "";
        let bg_color = "#000000";
        switch(status){
            case 'COMPLETED':
                color="#39ff1c";
                icon= "fas fa-check-double data-status";
                break;
            case 'READY':
                color = "#a4ff1c";
                icon= "fas fa-check data-status";
                break;
            case 'PAID':
                color = "#1cff6b";
                icon= "fas fa-dollar-sign data-status";
                break;
            case 'PACKED':
                color = "#d5ff1c";
                icon= "fas fa-box data-status";
                break;
            case 'SHIPPED':
                color = "#ffe91c";
                icon= "fas fa-shipping-fast data-status";
                break;
            case 'RECEIVED':
                color = "#ff00d9";
                bg_color = "#FFFFFF";
                icon= "fas fa-box-open data-status";
                break;
            case 'UPDATED':
                color = "#1cbbff";
                icon= "fas fa-clipboard-list data-status";
                break;
            case 'PENDING':
                color = "#ffa81c";
                icon= "fas fa-hourglass data-status";
                break;
            case 'CANCELLED':
                color = "#6c757d";
                bg_color = "#FFFFFF"
                icon= "fas fa-ban data-status";
                break;
            case 'PURGED':
                color = "#ff1c1c";
                bg_color = "#FFFFFF";
                icon= "fas fa-window-close data-status";
                break;
            default:
                icon= "error"
                break;
        }
        let icon_i = "<i style='color:"+bg_color+";' class=\""+icon+"\"></i>";
        let s = "<span class=\"status-badge badge badge-pill\" style=\"color:"+bg_color+";background-color:"+color+";\">"+icon_i+"<span class=\"status-name\">"+status.toLowerCase()+"</span>"+"</button>";
        return {span:s,bg_color:bg_color};
    }
    function render_date_ordered(date,length){
        let d = new Date(date);
        let options;
        if(length==="long") {
            options = { year: 'numeric', month: 'long', day: 'numeric'};
        }else if (length==="short"){
            options = { year: 'numeric', month: 'numeric', day: 'numeric'};
        }
        return d.toLocaleDateString('nl-BE', options);
    }
    function render_order_id (order_id) {
        return "<a href=\"\/account/orders\/"+order_id+"\/items\" id=\"o"+order_id+"\" class=\"order_id badge badge-primary\" >" +order_id + "</a>";
    }
});

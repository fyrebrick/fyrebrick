$(document).ready(function () {
    if (performance.navigation.type == 2) {
        location.reload(true);
    }
    getData();
    function clickTableRow (e){
        //when pressed table row: close all rows first, open this row
        //info in rows are
        $("#"+e.target.id).append("<tr><td>test</td></tr>")

    }
    function getData (){
        $.ajax({
            method:'GET',
            url: '/api/orders_limit?direction=in',
            beforeSend: startLoading()
        }).done(function(data){
            if(data){
                if(data.data){
                    if(data.data.length !== 0){
                        data.data.forEach(function(order){
                        let t = "<tr id='"+order.order_id+"'>";
                                t += "<td>";
                                    t+=render_order_id(order.order_id);
                                t += "</td>";
                                t += "<td>";
                                    t+=render_date_ordered(order.date_ordered);
                                t += "</td>";
                                t += "<td>";
                                    t+=render_status(order.status);
                                t += "</td>";
                                t += "<td id="+order.order_id+">";
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
            stopLoading();
        });
    }
    function render_progress (order) {
        $.ajax({
            method: "GET",
            url:"/db/order/" +order.order_id + "?orders_total=" + order.unique_count
        }).done(function(data){
            add_orders_checked(data);
        });
    }

    function addListenersTable(){
        document.querySelectorAll("tbody tr").forEach(function (item){
            item.addEventListener("click",clickTableRow)
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
        console.log(width);
        if (data.orders_checked <= 0) {
            status = not_started
        } else if (data.orders_checked < data.orders_total) {
            status = in_progress;
        } else if (data.orders_checked === data.orders_total) {
            status = done;
        } else {
            status = on_error;
        }
        $("#"+data.order_id).append("<div class=\"progress\" style=\"height: 20px;\"><div class=\"progress-bar\" role=\"progressbar\" style='"+status+"width:"+width+"%;' aria-valuenow=\"25\" aria-valuemin=\"0\" aria-valuemax=\"100\"></div></div>");
    }

    function render_status(status){
        let icon ='error';
        let color = "";
        switch(status){
            case 'COMPLETED':
                color="#b71cff";
                icon= "<i class=\"fas fa-check-double data-status\"></i>";
                break;
            case 'READY':
                color = "#a4ff1c";
                icon= "<i class=\"fas fa-check data-status\"></i>";
                break;
            case 'PAID':
                color = "#1cff6b";
                icon= "<i class=\"fas fa-dollar-sign data-status\"></i>";
                break;
            case 'PACKED':
                color = "#d5ff1c";
                icon= "<i class=\"fas fa-box data-status\"></i>";
                break;
            case 'SHIPPED':
                color = "#1cff33";
                icon= "<i class=\"fas fa-shipping-fast data-status\"></i>";
                break;
            case 'RECEIVED':
                icon= "<i class=\"fas fa-box-open data-status\"></i>";
                break;
            case 'UPDATED':
                color = "#1cbbff";
                icon= "<i class=\"fas fa-clipboard-list data-status\"></i>";
                break;
            case 'PENDING':
                color = "#ffa81c";
                icon= "<i class=\"fas fa-hourglass data-status\"></i>";
                break;
            case 'CANCELLED':
                color = "#6c757d";
                icon= "<i class=\"fas fa-ban data-status\"></i>";
                break;
            case 'PURGED':
                color = "#ff1c1c";
                icon= "<i class=\"fas fa-window-close data-status\"></i>";
                break;
            default:
                icon= "error"
                break;
        }
        let s = "<span class=\"status-badge     badge badge-pill\" style=\"background-color:"+color+";\">"+icon+"<span class=\"status-name\">"+status.toLowerCase()+"</span>"+"</button>";
        return s;
    }
    function render_date_ordered(date){
        let d = new Date(date);
        const options = { year: 'numeric', month: 'long', day: 'numeric'};
        return d.toLocaleDateString('en-UK', options);
    }
    function render_order_id (order_id) {
        return "<a href=\"\/orders\/"+order_id+"\/items\" id=\"o"+order_id+"\" class=\"badge badge-primary\" >" +order_id + "</a>";
    }
});

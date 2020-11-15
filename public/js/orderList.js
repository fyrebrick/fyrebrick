$(document).ready(function () {
    if (performance.navigation.type == 2) {
        location.reload(true);
    }
    let orders_json,orders_db = null;
    getData();
    function getData (){
        $.ajax({
            method:'GET',
            url: '/api/orders_limit?direction=in',
            beforeSend: startLoading()
        }).done(function(data){
            console.log(data);
            data.data.forEach(function(order){
            let t = "<tr>";
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
            stopLoading();
        });
    }
    function render_progress (order) {
        $.ajax({
            method: "GET",
            url:"/db/order/" +order.order_id + "?orders_total=" + order.unique_count
        }).done(function(data){
            console.log(data);
            add_orders_checked(data);
        });
    }

    function add_orders_checked (data) {
        console.log(data.order_id)
        if (data.orders_checked <= 0) {
            $("#"+data.order_id).append("<span class=\"badge badge-pill badge-danger\">" + data.orders_checked + "/" + data.orders_total + "</span>");
        } else if (data.orders_checked < data.orders_total) {
            $("#"+data.order_id).append( "<span class=\"badge badge-pill badge-warning\">" + data.orders_checked + "/" + data.orders_total + "</span>");
        } else if (data.orders_checked === data.orders_total) {
            $("#"+data.order_id).append( "<span class=\"badge badge-pill badge-success\">" + data.orders_checked + "/" + data.orders_total + "</span>");
        } else {
            $("#"+data.order_id).append( "<span class=\"badge badge-pill badge-secondary\">" + data.orders_checked + "/" + data.orders_total + "</span>");
        }
    }

    function render_status(status){
        switch(status){
            case 'COMPLETED':
                return "<i class=\"fas fa-check-double data-status\"></i>";
            case 'READY':
                return "<i class=\"fas fa-check data-status\"></i>";
            case 'PAID':
                return "<i class=\"fas fa-dollar-sign data-status\"></i>";
            case 'PACKED':
                return "<i class=\"fas fa-box data-status\"></i>";
            case 'SHIPPED':
                return "<i class=\"fas fa-shipping-fast data-status\"></i>";
            case 'RECEIVED':
                return "<i class=\"fas fa-box-open data-status\"></i>";
            case 'UPDATED':
                return "<i class=\"fas fa-clipboard-list data-status\"></i>";
            case 'PENDING':
                return "<i class=\"fas fa-hourglass data-status\"></i>";
            case 'CANCELLED':
                return "<i class=\"fas fa-ban data-status\"></i>";
            case 'PURGED':
                return "<i class=\"fas fa-window-close data-status\"></i>";
            default:
                return "error"
        }
    }
    function render_date_ordered(date){
        let d = new Date(date);
        const options = { year: 'numeric', month: 'long', day: 'numeric'};
        return d.toLocaleDateString('en-UK', options);
    }
    function render_order_id (order_id) {
        return "<a href=\"\/orders\/"+order_id+"\/items\" id=\"order_id\""+order_id+"\" class=\"badge badge-primary\" >" +order_id + "</a>";
    }
});

$(document).ready(function () {
    sortableTableId = "mainTable";
    addSortIcons();
    document.querySelectorAll("#mainTable th.sortable").forEach(function (item){
        item.addEventListener("click",sortTable)
    })
    $("#0").click();
    const socket = io();
    socket.on("connect_error", err => {
        console.log(err instanceof Error); // true
        console.log(err.message); // not authorized
        console.log(err.data); // { content: "Please retry later" }
    })

    $(".order-row").click(function(e){
        location.href = '/my/orders/'+$(this).attr('id');
    });
    
    socket.on('response.orders',async function(orders){
        orders = JSON.parse(orders);
        orders.forEach(function(order){
            $(`#P${order.order_id} .progress-numbers`).text(`${order.orders_checked}/${order.unique_count}`);
            $(`#P${order.order_id} .progress-small`).text(`${order.orders_checked}/${order.unique_count}`);
            const progress = render_progress(order);
            $(`#P${order.order_id}`).attr('order',progress.progressBar.width);
            $(`#P${order.order_id} .progress-bar`).css({
                "background-color":progress.progressBar.backgroundColor,
                "width":progress.progressBar.width+"%"
            });
            $(`#P${order.order_id} .progress-numbers`).css("color",progress.progressNumbers.color);
            $(`#P${order.order_id} .progress-small.badge`).css({
                "background-color":progress.progressBar.backgroundColor,
                "color":progress.span.color
            });
            const status = render_status(order.status)
            $(`#${order.order_id} .table-data`).attr('order',status.order);
            $(`#${order.order_id} .table-data .status-badge`).css({
                "color":status.span.color,
                "background-color":status.span.backgroundColor
            });
            $(`#${order.order_id} .table-data .status-badge i`).removeClass().addClass(status.i.class);
            $(`#${order.order_id} .table-data .status-badge i`).css("color",status.i.color);
            $(`#${order.order_id} .table-data .status-name`).text(status.span.text);
            
        });
    })
    window.setInterval(function(){
        socket.emit('request.orders');
      }, 1000);


});


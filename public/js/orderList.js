$(document).ready(function () {
    sortableTableId = "mainTable";
    addSortIcons();
    document.querySelectorAll("#mainTable th.sortable").forEach(function (item){
        item.addEventListener("click",sortTable)
    })
    $("#0").click();
    const socket = io("https://my.fyrebrick.be");
    socket.on("connect_error", err => {
        console.log(err instanceof Error); // true
        console.log(err.message); // not authorized
        console.log(err.data); // { content: "Please retry later" }
    })

    $(".order-row").click(function(e){
        if(!(e.target.classList.contains("pdfCheckboxData")||e.target.classList.contains("pdfCheckbox"))){
            location.href = '/my/orders/'+$(this).attr('id');
        }
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

    //Label button handler, inital press
    $("#labelBtn").on('click',function(){
        $(this).addClass("hide");
        $("#nextLabelBtn").removeClass("hide");

        //add checkbox to all rows
        const checkboxRow = `<td class="pdfCheckboxData" ><input class="pdfCheckbox" type="checkbox" /></td>`
        $("#dynamicTable tr").append(checkboxRow);
    });

    //label cancel button handler
    $("#labelCancelBtn").on('click',function(){
        $("#nextLabelBtn").addClass("hide");
        $("#labelBtn").removeClass("hide");
        $(".pdfCheckboxData").remove();
        $("tr").removeClass("label-checked");
    });

    //checkbox handler
    $("#dynamicTable").on("change",".pdfCheckbox",function(){
        const row = $(this).parents()[1];
        //1. find state of current checbox
        const state = $(this).is(":checked");
        if(state){
            //2. if state is true => glow this row red
            $(row).addClass("label-checked");
        }else{
            //2. if statis is false => remove glow
            $(row).removeClass("label-checked");
        }
    });

    $("#labelPdfBtn").on("click",function(){
        const list = [];
        $(".label-checked").each(function(e){
            list.push($(this).attr('id'));
        });
        console.log(list);
        $.ajax({
            method: "POST",
            url: '/my/orders/print/labels',
            data: {
                list : JSON.stringify(list)
            },
            beforeSend: function () {
                startLoading();
            }
        }).done(function (data) {
            stopLoading();
            $("#pdfLabel").modal('show');
            $("#downloadPdf").attr('href',data);
            console.log(data);
        });
    })
});


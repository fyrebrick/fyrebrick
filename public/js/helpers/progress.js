function render_progress (data) {
    let not_started = "#dc3545"
    let done = "#28a745";
    let in_progress = "#ffc107";
    let on_error = "#6c757d"
    let status = "";
    let backgroundColor = ""
    const STYLEBGC = "background-color:";
    let total = data.unique_count;
    let width = Math.round((Number(data.orders_checked)/Number(total))*100.0);
    if (data.orders_checked <= 0) {
        status = STYLEBGC+not_started
        backgroundColor = not_started;

    } else if (data.orders_checked < total) {
        status = STYLEBGC+in_progress;
        backgroundColor = in_progress;
    } else if (data.orders_checked === total) {
        status = STYLEBGC+done;
        backgroundColor = done;
    } else {
        status = STYLEBGC+on_error;
        backgroundColor = on_error;
    }
    let progress ="<div class='progress' style='height: 20px;'><div class='progress-bar' role='progressbar' style='"+status+"width:"+width+"%;' aria-valuenow='25' aria-valuemin='0' aria-valuemax='100'></div></div>"   
        +"<div class='progress-numbers' style='"+((status===done)?'color:#FFF':'color:#000')+"'>"+data.orders_checked+"/"+total+"</div>"+
        "<span style='"+status+((status===done||status===not_started)?'color:#FFF':'color:#000')+"'class='progress-small badge'>"+data.orders_checked+"/"+total+"</span>";
    return {
        progressBar:{
            status,
            backgroundColor,
            width,
        },progressNumbers:{
            style:((status===done)?'color:#FFF':'color:#000')
        },
        span:{
            style:((status===done||status===not_started)?'color:#FFF':'color:#000')
        },
        total
    };
}
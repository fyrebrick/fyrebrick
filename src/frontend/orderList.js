function orderifyRemarks(remarks){
    let f;
    const AMOUNT_OF_NUMBERS = 6;
    let hasNum = /\d/.test(remarks);
    let hasChar = /[a-z,A-Z]/.test(remarks);
    if(hasNum && hasChar){
        const p = remarks.match(/([A-Za-z]+)([0-9]+)/);        
        const a = p[1].split('').map(x=>x.charCodeAt(0)).reduce((a,b)=>a+b);
        f = a+"0".repeat(AMOUNT_OF_NUMBERS-p[2].length)+p[2];
    }else if(hasNum && !hasChar){
        f = "0".repeat(AMOUNT_OF_NUMBERS-remarks.length)+remarks;
    }else if(!hasNum && hasChar){
        f = remarks;
    }
    return f;
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
            icon= "error";
            break;
    }
    let s = "span(class='status-badge badge badge-pill'style='color:"+bg_color+";background-color:"+color+";')\n"
                "\t"+"i(style='color:"+bg_color+";' class='"+icon+"')\n"+
                "\tspan.status-name"+status.toLowerCase();

    return {
        span:{
            color:bg_color,
            backgroundColor:color,
            },
        i:{
            color:bg_color,
            class:icon    
            },
        status:{
            name:status
        }
    }
}

function render_progress (data) {
    let not_started = "#dc3545;"
    let done = "#28a745;";
    let in_progress = "#ffc107;";
    let on_error = "#6c757d;"
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

module.exports = {
    render_status,
    render_date_ordered,
    render_progress,
    orderifyRemarks
}
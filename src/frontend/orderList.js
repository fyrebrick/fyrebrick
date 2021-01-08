function orderifyRemarks(remarks){
    // try{
    //     let f;
    //     const AMOUNT_OF_NUMBERS = 6;
    //     let hasNum = /\d/.test(remarks);
    //     let hasChar = /[a-z,A-Z]/.test(remarks);
    //     if(hasNum && hasChar){
    //         const p = remarks.match(/([A-Za-z]+)([0-9]+)/);
    //         const a = p[1].split('').map(x=>x.charCodeAt(0)).reduce((a,b)=>a+b);
    //         f = a+"0".repeat(AMOUNT_OF_NUMBERS-p[2].length)+p[2];
    //     }else if(hasNum && !hasChar){
    //         f = "0".repeat(AMOUNT_OF_NUMBERS-remarks.length)+remarks;
    //     }else if(!hasNum && hasChar){
    //         throw "do Catch"
    //     }
    //     return f;
    // }catch(e){
    //     remarks = escape(remarks);
    //     let newR = "";
    //     remarks.split('').forEach(function(char){
    //         try{
    //             newR += char.toUpperCase().charCodeAt(0);
    //         }catch{
    //             newR += char.charCodeAt(0);
    //         }
    //     })
    //     console.log(remarks);
    //     console.log(newR.substr(0,7));
    //     return newR.substr(0,7);
    // }
    remarks = escape(remarks);
    let newR = "";
    remarks.split('').forEach(function(char){
        try{
            newR += char.toUpperCase().charCodeAt(0);
        }catch{
            newR += char.charCodeAt(0);
        }
    })
    console.log(remarks);
    console.log(newR.substr(0,7));
    return newR.substr(0,7);
    
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
    let icon ="fas fa-times-circle";
    let color = "#FFFFFF";
    let bg_color = "#000000";
    let text = status.substr(0,1).toUpperCase()+status.substr(1).toLowerCase();
    let order;
    switch(status.toUpperCase()) {
        case 'COMPLETED':
            color="#39ff1c";
            icon= "fas fa-check-double";
            order=9;
            break;
        case 'READY':
            color = "#a4ff1c";
            icon= "fas fa-check";
            order=4;
            break;
        case 'PAID':
            color = "#1cff6b";
            icon= "fas fa-dollar-sign";
            order=5;
            break;
        case 'PACKED':
            color = "#fff81c";
            icon= "fas fa-box";
            order=6;
            break;
        case 'SHIPPED':
            color = "#ffe91c";
            icon= "fas fa-shipping-fast";
            order=7;
            break;
        case 'RECEIVED':
            color = "#003cff";
            bg_color = "#FFFFFF";
            icon= "fas fa-box-open";
            order=8;
            break;
        case 'UPDATED':
            color = "#1cbbff";
            icon= "fas fa-clipboard-list";
            order=2;
            break;
        case 'PENDING':
            color = "#ffa81c";
            icon= "fas fa-hourglass";
            order=1;
            break;
        case 'CANCELLED':
            color = "#6c757d";
            bg_color = "#FFFFFF"
            icon= "fas fa-ban";
            order=15;
            break;
        case 'PURGED':
            color = "#ff1c1c";
            bg_color = "#FFFFFF";
            icon= "fas fa-window-close";
            break;
        case 'PROCESSING':
            color="#1cdaff";
            icon="fas fa-sync";
            order=3;
            break;
        case 'NPB':
            text="Non-Paying Buyer Alert";
            color= "#f32d2d";
            bg_color="#FFFFFF";
            order=11;
            break;
        case 'OCR':
            text='Order Cancel Request';
            color= "#f32d2d";
            bg_color="#FFFFFF";
            order=10;
            break;
        case 'NPX':
            text='Non-Paying Buyer Alert';
            color= "#f32d2d";
            bg_color="#FFFFFF";
            order=12;
            break;
        case 'NRS':
            text='Non-Responding Seller Alert'
            color= "#f32d2d";
            bg_color="#FFFFFF";
            order=13;
            break;
        case 'NSS':
            text='Non-Shipping Seller Alert';
            color= "#f32d2d";
            bg_color="#FFFFFF";
            order=14;
            break;
        default:
            text='Unknown Status';
            color= "#f32d2d";
            bg_color="#FFFFFF";
            order=16;
            break;
    }
    icon+=" data-status";
    let s = "span(class='status-badge badge badge-pill'style='color:"+bg_color+";background-color:"+color+";')\n"
                "\t"+"i(style='color:"+bg_color+";' class='"+icon+"')\n"+
                "\tspan.status-name"+status.toLowerCase();
    return {
        order:order
        ,span:{
            color:bg_color,
            backgroundColor:color,
            text:text
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
    let not_started = "#dc3545"
    let done = "#28a745";
    let in_progress = "#ffc107";
    let on_error = "#6c757d"
    let status = "";
    let backgroundColor = ""
    const STYLEBGC = "background-color:";
    let total = data.unique_count;
    let width = Math.round((Number(data.orders_checked)/Number(total))*100.0);
    if (data.orders_checked === 0) {
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
    if(width===0){
        width=100;
    }
    return {
        progressBar:{
            status,
            backgroundColor,
            width,
        },progressNumbers:{
            style:((backgroundColor===done||backgroundColor===not_started)?'color:#FFF':'color:#000'),
            color:((backgroundColor===done||backgroundColor===not_started)?'#FFF':'#000')
        },
        span:{
            style:((backgroundColor===done||backgroundColor===not_started)?'color:#FFF':'color:#000'),
            color:((backgroundColor===done||backgroundColor===not_started)?'#FFF':'#000')
        },
        total
    };
}
try{
    module.exports = {
        render_status,
        render_date_ordered,
        render_progress,
        orderifyRemarks
    }
}catch(e){};
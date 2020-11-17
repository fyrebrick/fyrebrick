document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("activateChangeRemarkButton").addEventListener("click",activateChangeRemarkButton);
    document.getElementById("changeRemarkFinish").addEventListener("click",changeRemarkFinish);
    document.getElementById('search').addEventListener('onsearch', function (e) {
                document.getElementById("searchButton").click();
        });
    document.getElementById('search').addEventListener('click', function (e) {
        document.getElementById('search').focus();
        document.getElementById('search').select();
    });
    this.addEventListener('onsubmit', function (e) {
        document.getElementById("searchButton").click();
    });
    document.getElementById('search')
        .addEventListener('keyup', function (e) {
            if (e.code === 'Enter') {
                document.getElementById("searchButton").click();
                document.getElementById('search').focus();
                document.getElementById('search').select();
            }
        });
    document.getElementById("searchButton").addEventListener('click',search);
});
let checkAll = '<div id="checkAllDiv" class=" custom-checkbox">\n'
    +'          <input id="checkAllInput" type="checkbox" class="checkAllbox">\n'
    +'          </div>\n';
let stateofChangeRemarkButton = false;
let searchValue = "";
let showUpdateButton = false;
let loadingSpinner = "<button id=\"spinner\" class=\"btn btn-primary btn-lg my-2 my-sm-0\" type=\"button\" disabled>\n" + "  <span class=\"spinner-border spinner-border-sm\" role=\"status\" aria-hidden=\"true\"></span>\n" + "  Loading...\n" + "</button>";
let amountChecked = 0;
let lastRemarksChange = 0;3
let lastColourChange = 0;
let lastQuantityChange = 0;
let lastUsedChange = 0;
let delay = 20;
function listenersWhenSearchIsComplete (){
    document.querySelectorAll(".inputRemarks").forEach(function (item) {
        item.addEventListener('keyup', function (e) {
            if (e.code === 'Enter') {
                changeRemarks(e);
                document.getElementById('search').focus();
                document.getElementById('search').select();
            }
        });
        item.addEventListener('click', function (e) {
            e.target.focus();
            e.target.select();
        });
    });
    document.querySelectorAll(".inputQuantity").forEach(function (item) {
        item.addEventListener('keyup', function (e) {
            if (e.code === 'Enter') {
                changeQuantity(e);
                document.getElementById('search').focus();
                document.getElementById('search').select();
            }
        });
        item.addEventListener('click', function (e) {
            e.target.focus();
            e.target.select();
        });
    });
    document.querySelectorAll(".inputColour").forEach(function (item) {
        item.addEventListener('change', function (e) {
            changeColour(e);
            document.getElementById('search').focus();
            document.getElementById('search').select();
        });
    });
    document.querySelectorAll(".inputUsed").forEach(function (item) {
        item.addEventListener('keyup', function (e) {
            if (e.code === 'Enter') {
                changeUsed(e);
                document.getElementById('search').focus();
                document.getElementById('search').select();
            }
        });
        item.addEventListener('click', function (e) {
            e.target.focus();
            e.target.select();
        });
    });

    document.querySelectorAll("img").forEach(function (item) {
        item.addEventListener('click', imgThumbnail);
    });
    document.querySelectorAll(".qty").forEach(function (item) {
        item.addEventListener('click', qty);
    });
    document.getElementById("qtyButtonSubmit").addEventListener("click", qtyButtonSumbit);
    document.getElementById("qtyButtonAdd").addEventListener("click", qtyButtonAdd);
    document.getElementById("qtyButtonRemove").addEventListener("click", qtyButtonRemove);
    document.getElementById("qtyInput").addEventListener('keyup', qtyInput);
}
function listenersWhenUpdating(){
    document.getElementById("checkAllInput").addEventListener('click', checkAllBox);
    document.querySelectorAll(".checkers").forEach(function (item) {
        item.addEventListener('click', checkers);
    });
    document.querySelectorAll(".checkboxChangeRemarks").forEach(function (item) {
        item.addEventListener('change', checkboxChangeRemarks);
        item.addEventListener('click',updateCheckBoxAll);
    });
}
function updateCheckBoxAll(){
    let onTrue = 0;
    let onFalse = 0;
    document.querySelectorAll(".checkboxChangeRemarks").forEach(function(checkbox,index,array){
       if(checkbox.checked){
           onTrue++;
       }else{
           onFalse++;
       }
    });
    if(onTrue===0){ //nothing is checked
        document.getElementById("checkAllInput").checked = false;
    }else if(onFalse===0){
        document.getElementById("checkAllInput").checked = true;
    }else{
        $('#checkAllInput').prop('indeterminate', true)
    }
}
function checkAllBox(){
    document.querySelectorAll(".checkboxChangeRemarks").forEach(function(checkbox){
       checkbox.checked = document.getElementById("checkAllInput").checked;
    });
}
function activateChangeRemarkButton () {
    if (stateofChangeRemarkButton) {
        //deactive change remark state
        if ($("#checkHeader").html() === " Check") { //be sure that not already deleted
            revertOutOfChangeRemarkState();
        }
        //removes red glowing rows
        $("#bodyOfTable tr").removeClass("redRow");
    } else if (!stateofChangeRemarkButton && searchValue.trim()) {
        //ACTIVE change remark state
        $(this).removeClass("btn-outline-secondary").addClass("btn-primary"); //looks like function is active
        //add extra collumn
        $("#headOfTable tr").prepend("<th id='checkHeader' scope='col' > "+checkAll+"</th>")
        $("#bodyOfTable tr").each(function () {
            let idOfCurrentRow = $(this).attr('id');
            $(this).prepend("<td class='checkRow'><div class=\"custom-control custom-checkbox\">\n" +
                "  <input type=\"checkbox\" class=\"checkboxChangeRemarks\" name=\"" + idOfCurrentRow + "\">" +
                "</div></td>")
        });
        stateofChangeRemarkButton = true;
    }
    listenersWhenUpdating();
}
function qtyInput() {
    let sign = $("#inputIndicator").text();
    if (sign === "+") {
        $("#qtyNumberNext").text(Number($("#qtyNumberCurrent").text()) + Number($("#qtyInput").val()));
    } else if (sign === "-") {
        let next = Number($("#qtyNumberCurrent").text()) - Number($("#qtyInput").val());
        if (next <= 0) {
            $("#qtyNumberNext").text("0");
        } else {
            $("#qtyNumberNext").text(next);
        }
    }

}
function qtyButtonRemove() {
    $(this).removeClass("btn-danger");
    $(this).addClass("btn-outline-danger");
    $("#qtyButtonAdd").removeClass("btn-outline-success");
    $("#qtyButtonAdd").addClass("btn-success");
    $("#inputIndicator").text("-");
    let next = Number($("#qtyNumberCurrent").text()) - Number($("#qtyInput").val());
    if (next <= 0) {
        $("#qtyNumberNext").text("0");
    } else {
        $("#qtyNumberNext").text(next);
    }
}
function qtyButtonAdd() {
    $(this).removeClass("btn-success");
    $(this).addClass("btn-outline-success");
    $("#qtyButtonRemove").removeClass("btn-outline-danger");
    $("#qtyButtonRemove").addClass("btn-danger");
    $("#inputIndicator").text("+");
    $("#qtyNumberNext").text(Number($("#qtyNumberCurrent").text()) + Number($("#qtyInput").val()));
}
function showModalChangeRemark() {
    $("#changeRemarkModal").modal('show');
}

function changeColour(e){
    e.preventDefault();
    if (lastColourChange >= (Date.now() - delay))
        return;
    lastColourChange = Date.now();
    let id = e.target.id.substr(1).trim();
    let thisButton = "#" + e.target.id;
    let newColour = $(thisButton).val();
    $.ajax({
        method: "POST",
        url: '/api/change_colour',
        data: {
            id: id,
            newColour: newColour,
            newName: $(thisButton+" option:selected").data("name")
        },
        beforeSend: function () {
            $(thisButton).removeClass("is-valid");
            $(thisButton).removeClass("is-invalid");
        }
    }).done(function (data) {
        if(data.meta.code!==200||data.data.color_id!==$(thisButton+" option:selected").val()){
            $(thisButton).addClass("is-invalid");
        }else {
            $(thisButton).addClass("is-valid");
            const name = $(thisButton+" option:selected").data("name");
            $("#CM"+id).empty();
            $("#CM"+id).append(setColor(name));
        }
    });
}

function changeUsed(e){
    e.preventDefault();
    if (lastUsedChange >= (Date.now() - delay))
        return;
    lastUsedChange = Date.now();
    let id = e.target.id.substr(1).trim();
    let thisButton = "#" + e.target.id;
    let newUsed = $(thisButton).val();
    $.ajax({
        method: "POST",
        url: '/api/change_used',
        data: {
            id: id,
            newUsed: newUsed
        },
        beforeSend: function () {
            $(thisButton).removeClass("is-valid");
            $(thisButton).removeClass("is-invalid");
        }
    }).done(function (data) {
        if (data.meta.code !== 200||data.data.new_or_used!==newUsed) {
            $(thisButton).addClass("is-invalid");
        } else {
            $(thisButton).addClass("is-valid");
        }
    });
}

function changeQuantity(e){
    e.preventDefault();
    if (lastQuantityChange >= (Date.now() - delay))
        return;
    lastQuantityChange = Date.now();
    let id = e.target.id.substr(1).trim();
    let thisButton = "#" + e.target.id;
    let newQuantity = $(thisButton).val();
    $.ajax({
        method: "POST",
        url: '/api/change_quantity',
        data: {
            id: id,
            newQuantity: newQuantity
        },
        beforeSend: function () {
            $(thisButton).removeClass("is-valid");
            $(thisButton).removeClass("is-invalid");
        }
    }).done(function (data) {
        if (data.meta.code !== 200||data.data.quantity!=newQuantity

        ) {
            $(thisButton).addClass("is-invalid");
        } else {
            $(thisButton).addClass("is-valid");
        }
    });
}

function changeRemarks(e) {
    e.preventDefault();
    if (lastRemarksChange >= (Date.now() - delay))
        return;
    lastRemarksChange = Date.now();
        let id = e.target.id.substr(1).trim();
        let thisButton = "#"+e.target.id;
        let newRemarkName = $(thisButton).val();
        $.ajax({
            method: "POST",
            url: '/api/change_single_remarks',
            data: {
                id: id,
                newRemarkName: newRemarkName
            },
            beforeSend: function () {
                $(thisButton).removeClass("is-valid");
                $(thisButton).removeClass("is-invalid");
            }
        }).done(function (data) {
            if (data.meta.code !== 200||data.data.remarks!==newRemarkName) {
                $(thisButton).addClass("is-invalid");
            } else {
                $(thisButton).addClass("is-valid");
            }
        });
}
function checkers(e) {
    e.preventDefault();
    if ($(e.target).is("input.checkers")) {
        let state = $(this).is(":checked");
        $("#" + this.id).prop("checked", state);
    }
}
function imgThumbnail(e) {
    e.preventDefault();
    if ($(e.target).is('img.img-thumbnail')) {
        let modalId = "#modal" + this.id.substr(3, this.id.length);
        $(modalId).modal('show');
    }
}
function search(e) {
    e.preventDefault()
    searchValue = ""
    $("#search").val($("#search").val().toUpperCase());
    $("#bodyOfTable tr").remove();
    revertOutOfChangeRemarkState();
    let url_ = '/api/inventories?search=' + $("#search").val();
    if($("#scanoption").is(':checked')){
        url_= '/api/inventories?search=' + $("#search").val()+"&exact=Y";
    }
    $.ajax({
        method: "GET",
        url: url_,
        beforeSend: function () {
            startLoading()
        }
    }).done(function (data) {
        data.data.forEach(function (item) {
            let tr = "<tr id=" + item.inventory_id + ">"; //start row
            tr+="<td >";
            tr+="<a href='https://www.bricklink.com/inventory_detail.asp?pg=1&invID=" + item.inventory_id + "' target='_blank' class=\"btn btn-primary btn-lg active\" role=\"button\" aria-pressed=\"true\"> " +
                "<i class=\"fas fa-external-link-alt fa-3x\"></i>" +
                "</a>"
            tr+="</td >";
            tr += "<td >"; // start 1 column
            if (item.remarks === undefined) {
                tr += "<a href='https://www.bricklink.com/inventory_detail.asp?pg=1&invID=" + item.inventory_id + "' target='_blank'  >geen remark</a>";
            } else {
                tr += "<input type=\"text\" class=\"form-control inputRemarks\" id=\"R" + item.inventory_id + "\" placeholder=\"" + item.remarks + "\" value=\"" + item.remarks + "\">\n";
            }
            tr += "</td><td>";//start 2nd column
            if (item.color_name === "(Not Applicable)") {
                tr += "<i class=\"fas fa-tint-slash\"></i>";
            } else {
                if (item.color_name === "(Not Applicable)") {
                    tr += "<i class=\"fas fa-tint-slash\"></i>";
                } else {
                    tr += getColorSelect(item.inventory_id);
                    tr += "<p id='CM"+item.inventory_id+"'>"+ setColor(item.color_name) +"</p>"
                }
            }
            tr += "</td><td>";//start 3nd column
            tr += "<input type=\"text\" class=\"form-control inputQuantity\" id=\"Q" + item.inventory_id + "\" placeholder=\"" + item.quantity + "\" value=\"" + item.quantity + "\">\n";
            tr += "</td><td>";//start 4nd column
            tr += "<input type=\"text\" class=\"form-control inputUsed\" id=\"U" + item.inventory_id + "\" placeholder=\"" + item.new_or_used + "\" value=\"" + item.new_or_used + "\">\n";
            tr += "</td><td>";//start 5nd column
            tr += getPic(item);
            tr += "<a target='_blank' href='https://www.bricklink.com/v2/inventory_detail.page?invID="+item.inventory_id+"' class='item-no'>Item "+item.item.no+"</a>";
            tr += "</td></tr>";
            $('#bodyOfTable').append(tr);
            searchValue = $("#search").val();
            listenersWhenSearchIsComplete();
            stopLoading();
        });
    });

    function getPic(row) {
        //row param is the item
        let id = row.color_id + row.item.no;
        let modal = "<div class=\"modal fade\" id=\"modal" + id + "\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"modalTitle" + id + "\" aria-hidden=\"true\">\n" +
            "  <div class=\"modal-dialog modal-dialog-centered\" role=\"document\">\n" +
            "    <div class=\"modal-content\">\n" +
            "      <div class=\"modal-header\">\n" +
            "        <h5 class=\"modal-title\" id=\"modalTitel" + id + "\">Item no " + row.item.no + "</h5>\n" +
            "        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n" +
            "          <span aria-hidden=\"true\">&times;</span>\n" +
            "        </button>\n" +
            "      </div>\n" +
            "      <div class=\"modal-body\">\n" +
            "        " + row.item.name +
            "      </div>\n" +
            "      <div class=\"modal-footer\">\n" +
            "        <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Close</button>\n" +
            "      </div>\n" +
            "    </div>\n" +
            "  </div>\n" +
            "</div>";
        let _type = row.item.type.substr(0, 1);

        switch (row.item.type) {
            case "SET":
                return modal + "\n" +
                    "<img id=\"img" + id + "\" class=\"img-thumbnail \" src=\"https://img.bricklink.com/S/" + row.item.no + ".jpg\"" + " alt=\"\"> ";
                break;
            case "MINIFIG":
                return modal + "\n" +
                    "<img id=\"img" + id + "\" class=\"img-thumbnail \" src=\"https://img.bricklink.com/ItemImage/MN/" + row.color_id + "/" + row.item.no + ".png\"" + " alt=\"\"> ";
                break;
            case "PART":
                return modal + "\n" +
                    "<img id=\"img" + id + "\" class=\"img-thumbnail \" src=\"https://img.bricklink.com/ItemImage/PN/" + row.color_id + "/" + row.item.no + ".png\"" + " alt=\"\"> ";
                break;
            case 'INSTRUCTION':
                return modal + "\n" +
                    "<img id=\"img" + id + "\" class=\"img-thumbnail \" src=\"https://img.bricklink.com/ItemImage/IN/" + row.color_id + "/" + row.item.no + ".png\"" + " alt=\"\"> ";
                break;
            case 'BOOK':
                return modal + "\n" +
                    "<img id=\"img" + id + "\" class=\"img-thumbnail \" src=\"https://img.bricklink.com/ItemImage/BN/" + row.color_id + "/" + row.item.no + ".png\"" + " alt=\"\"> ";
                break;
            case 'SET':
                return modal + "\n" +
                    "<img id=\"img" + id + "\" class=\"img-thumbnail \" src=\"https://img.bricklink.com/ItemImage/SN/" + row.color_id + "/" + row.item.no + ".png\"" + " alt=\"\"> ";
                break;
            case 'GEAR':
                return modal + "\n" +
                    "<img id=\"img" + id + "\" class=\"img-thumbnail \" src=\"https://img.bricklink.com/ItemImage/GN/" + row.color_id + "/" + row.item.no + ".png\"" + " alt=\"\"> ";
                break;
            case 'CATALOG':
                return modal + "\n" +
                    "<img id=\"img" + id + "\" class=\"img-thumbnail \" src=\"https://img.bricklink.com/ItemImage/CN/" + row.color_id + "/" + row.item.no + ".png\"" + " alt=\"\"> ";
                break;
            default:
                return "<i class=\"fas fa-image\"></i>";
        }

    }
};
function revertOutOfChangeRemarkState() {
    $("#activateChangeRemarkButton").removeClass("btn-primary").addClass("btn-outline-secondary");
    $("#checkHeader").remove();
    $(".checkRow").remove();
    $("#updateButton").remove();
    $("#changeRemarkModal").modal('hide');
    showUpdateButton = false;
    stateofChangeRemarkButton = false;
    amountChecked = 0;
    $("#showAmountChecked").remove();
};
function qty(e) {
    e.preventDefault();
    if ($(e.target).is(".qty")) {
        let data = $(this).data(); //name, id, qty
        $("#qtyTitle").text("Add or remove quantity to item \"" + data.name + "\"");
        $("#qtyNumberCurrent").text(data.qty);
        $("#qtyId").text(data.id);
        $("#qtyModal").modal('show');
    }
}
function checkboxChangeRemarks(e) {
    e.preventDefault();
    if ($(e.target).is(".checkboxChangeRemarks")) {
        let checked = this.checked;
        if (checked) {
            $(this).parent().parent().parent().addClass("redRow");
            amountChecked++;
            if (!showUpdateButton) {
                //start showing update button
                $("#mainButtonRows").append("<button onclick='showModalChangeRemark()' type=\"button\" id=\"updateButton\" class=\"btn btn-success\">Update</button>")
                $("#loadingSection").append("<button id=\"showAmountChecked\" class=\"btn btn-primary btn-lg my-2 my-sm-0\" type=\"button\" disabled>\n" +
                    "</button>");
                showUpdateButton = true;
            }
        } else {
            $(this).parent().parent().parent().removeClass("redRow");
            amountChecked--;
        }
        let correctChecked = (amountChecked);
        $("#showAmountChecked").text(correctChecked + " selected");
    }
}
function qtyButtonSumbit() {
    $.ajax({
        method: "POST",
        url: '/api/change_quantity',
        data: {
            sign: $("#inputIndicator").text(),
            value: $("#qtyInput").val(),
            id: $("#qtyId").text()
        },
    }).done(function (data) {
        $("#qtyModal").modal('hide');
    });
}
function changeRemarkFinish() { //button was pressed to change remarks
    //gather all selected inventoryId's
    let ids = [];
    $(".checkboxChangeRemarks").each(function () {
        if (this.checked) {
            ids.push($(this).attr('name'));
        }
        ;
    });
    let newRemarkName = $("#inputUpdateRemark").val().toUpperCase();
    let body = {
        ids: JSON.stringify(ids),
        newRemarkName: newRemarkName
    };
    //api call here
    $.ajax({
        method: "PUT",
        url: '/api/change_remark',
        data: body,
    }).done(function (data) {
        $(".redRow").removeClass("redRow").addClass("greenRow");
        revertOutOfChangeRemarkState();
        $(".greenRow").fadeOut(1000, function () {
        });
        ///TODO: show message based on success
    });
    //end api call
}

function setColor(color_name) {
    let css = "<span class=\"badge\" ";
    switch (color_name) {
        case "transparent":
            css += "style='background-color:transparent'";
            break;
        case "Black":
            css += "style='background-color:#212121;color:#FFF'";
            break;
        case "Blue":
            css += "style='background-color:#0057A6;color:#FFF'";
            break;
        case "Bright Green":
            css += "style='background-color:#10CB31;color:#000'";
            break;
        case "Bright Light Blue":
            css += "style='background-color:#9FC3E9;color:#000'";
            break;
        case "Bright Light Orange":
            css += "style='background-color:#F7BA30;color:#000'";
            break;
        case "Bright Light Yellow":
            css += "style='background-color:#F3E055;color:#000'";
            break;
        case "Bright Pink":
            css += "style='background-color:#FFBBFF;color:#000'";
            break;
        case "Brown":
            css += "style='background-color:#532115;color:#FFF'";
            break;
        case "Dark Azure":
            css += "style='background-color:#3399FF;color:#FFF'";
            break;
        case "Dark Blue":
            css += "style='background-color:#143044;color:#FFF'";
            break;
        case "Dark Bluish Gray":
            css += "style='background-color:#595D60;color:#FFF'";
            break;
        case "Dark Gray":
            css += "style='background-color:#6B5A5A;color:#FFF'";
            break;
        case "Dark Green":
            css += "style='background-color:#2E5543;color:#FFF'";
            break;
        case "Dark Orange":
            css += "style='background-color:#B35408;color:#FFF'";
            break;
        case "Dark Pink":
            css += "style='background-color:#C87080;color:#FFF'";
            break;
        case "Dark Purple":
            css += "style='background-color:#5F2683;color:#FFF'";
            break;
        case "Dark Red":
            css += "style='background-color:#6A0E15;color:#FFF'";
            break;
        case "Dark Tan":
            css += "style='background-color:#907450;color:#FFF'";
            break;
        case "Dark Turquoise":
            css += "style='background-color:#008A80;color:#FFF'";
            break;
        case "Green":
            css += "style='background-color:#00642E;color:#FFF'";
            break;
        case "Lavender":
            css += "style='background-color:#B18CBF;color:#FFF'";
            break;
        case "Light Aqua":
            css += "style='background-color:#CCFFFF;color:#000'";
            break;
        case "Light Blue":
            css += "style='background-color:#B4D2E3;color:#000'";
            break;
        case "Light Bluish Gray":
            css += "style='background-color:#AFB5C7;color:#000'";
            break;
        case "Light Gray":
            css += "style='background-color:#9C9C9C;color:#000'";
            break;
        case "Light Lime":
            css += "style='background-color:#EBEE8F;color:#000'";
            break;
        case "Light Nougat":
            css += "style='background-color:#FECCB0;color:#000'";
            break;
        case "Light Pink":
            css += "style='background-color:#FFE1FF;color:#000'";
            break;
        case "Light Purple":
            css += "style='background-color:#DA70D6;color:#000'";
            break;
        case "Light Yellow":
            css += "style='background-color:#FFE383;color:#000'";
            break;
        case "Lime":
            css += "style='background-color:#A6CA55;color:#000'";
            break;
        case "Maersk Blue":
            css += "style='background-color:#6BADD6;color:#000'";
            break;
        case "Magenta":
            css += "style='background-color:#B52952;color:#FFF'";
            break;
        case "Medium Azure":
            css += "style='background-color:#42C0FB;color:#000'";
            break;
        case "Medium Blue":
            css += "style='background-color:#61AFFF;color:#000'";
            break;
        case "Medium Lavender":
            css += "style='background-color:#885E9E;color:#FFF'";
            break;
        case "Medium Lime":
            css += "style='background-color:#BDC618;color:#000'";
            break;
        case "Medium Nougat":
            css += "style='background-color:#E3A05B;color:#000'";
            break;
        case "Medium Orange":
            css += "style='background-color:#FFA531;color:#000'";
            break;
        case "Medium Violet":
            css += "style='background-color:#9391E4;color:#000'";
            break;
        case "Nougat":
            css += "style='background-color:#FFAF7D;color:#000'";
            break;
        case "Olive Green":
            css += "style='background-color:#7C9051;color:#FFF'";
            break;
        case "Orange":
            css += "style='background-color:#FF7E14;color:#FFF'";
            break;
        case "Pink":
            css += "style='background-color:#FFC0CB;color:#000'";
            break;
        case "Purple":
            css += "style='background-color:#A5499C;color:#FFF'";
            break;
        case "Red":
            css += "style='background-color:#B30006;color:#FFF'";
            break;
        case "Reddish Brown":
            css += "style='background-color:#89351D;color:#FFF'";
            break;
        case "Sand Blue":
            css += "style='background-color:#5A7184;color:#FFF'";
            break;
        case "Sand Green":
            css += "style='background-color:#76A290;color:#FFF'";
            break;
        case "Sand Red":
            css += "style='background-color:#8C6B6B;color:#FFF'";
            break;
        case "Tan":
            css += "style='background-color:#DEC69C;color:#000'";
            break;
        case "Very Light Orange":
            css += "style='background-color:#E6C05D;color:#000'";
            break;
        case "White":
            css += "style='background-color:#FFFFFF;color:#000'";
            break;
        case "Yellow":
            css += "style='background-color:#F7D117;color:#000'";
            break;
        case "Yellowish Green":
            css += "style='background-color:#DFEEA5;color:#000'";
            break;
        case "Trans-Clear":
            css += "style='background-color:#EEEEEE;color:#000'";
            break;
        case "Trans-Dark Blue":
            css += "style='background-color:#00296B;color:#FFF'";
            break;
        case "Trans-Light Blue":
            css += "style='background-color:#68BCC5;color:#000'";
            break;
        case "Trans-Light Orange":
            css += "style='background-color:#E99A3A;color:#000'";
            break;
        case "Trans-Neon Green":
            css += "style='background-color:#C0F500;color:#000'";
            break;
        case "Trans-Neon Orange":
            css += "style='background-color:#FF4231;color:#FFF'";
            break;
        case "Trans-Orange":
            css += "style='background-color:#D04010;color:#FFF'";
            break;
        case "Trans-Yellow":
            css += "style='background-color:#EBF72D;color:#000'";
            break;
        case "Trans-Red":
            css += "style='background-color: #9C0010;color:#FFF !important'";
            break;
        case "Chrome Gold":
            css += "style='background-color:#F1F2E1;color:#000'";
            break;
        case "Chrome Silver":
            css += "style='background-color:#DCDCDC;color:#000'";
            break;
        case "Pearl Light Gray":
            css += "style='background-color:#ACB7C0;color:#000'";
            break;
        case "Metallic Gold":
            css += "style='background-color:#B8860B;color:#FFF'";
            break;
        case "Milky White":
            css += "style='background-color:#D4D3DD;color:#000'";
            break;
        case "Speckle Black-Silver":
            css += 'style="color:#FFF;background: url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAgAElEQVR4Xu3dcfjfU/3/8c+rlTVEmIhIZqIWqS2laZpWk6YWkaVElqnUREqWXdOkRFarTERKR0QrS5Qsi5SmRCsyJCIyRFhbLd+r89fNtev5u37/nvfruT92va739f683uc8z3m938/7eTzO83TPf/7zy9/+9rdpQ0NDQyNGjCgrV66s1yeffHI57rjj6vWvfvWr8upXv7peX3755WWvvfaq1/vuu2+55JJL6vVuu+1Wrrvuunp93nnnlYMPPrheDw0NlaGhoXr94IMPlk033bRe//nPfy4vetGL6vWcOXPK7Nmz6/U+++xTLr300np92GGHlbPPPrtev/zlLy+/+93v6vX6669fHn/88Xr9rW99q7z73e+u1wceeGC54IIL6vXuu+9errnmmnr9hje8ofz0pz+t18cee2w55ZRT6vX9999fNt9883r9spe9rPz+97+v1z/84Q/LW97ylnp9xRVXlMmTJ9fro48+upx22mn1+iMf+Uj54he/WK/f9a53lW9/+9v1escddyy33HJLvd5mm23KXXfdVa+vvvrqsscee9Tr17/+9eVnP/vZWnE4/vjjy0knnVRf/9CHPlS+/OUv1+sXvOAF5a9//Wu9njRpUrnyyivr9RlnnFGOOOKIej1//vxy5JFH1ut//vOf5TnPeU69vuOOO8qoUaPq9ZNPPlnWXXfden3++eeXgw46qF5/97vfLe94xzvq9Tvf+c7yne98p14PGzasrFmzpl6PHDmyrFixol47jk899VTpuq6+fvPNN5eddtqpXr/yla8sv/nNb+r1xz72sfL5z3++Xq9ataoMHz68Xt90001l5513rtef+9znysc//vG1YusY+Z7nPe955e9//3t9v3Pv8MMPL2eeeWZ93Wvjs8UWW5T77ruvvsfr66+/vuy666719QsuuKAceOCB9Xq99dYrTzzxxFqvz5w5s8ybN2+tMfX9juN73vOe8s1vfrO+f+7cuWXWrFn1+o9//GN5yUteUq/XWWedsnr16nrtPNx4443Lww8/XF/fcMMNy6OPPlqvX/Oa15Rf/vKX9drnwnm+3377lYsvvri+xz4aT8fO8TW2a9asKcOGDav3ueyyy8ree+9dr0899dRyzDHH1OtPf/rT5VOf+lS99rvF5+uhhx4qm2yySX3P448/XtZff/16ffDBB5fzzjuvXp922mnl6KOPrtff+973ytvf/vZ63f3vv/yXEcgIZARaiEB+YbUwStnGjEBGoEagO/3008tRRx1V063jjjuunHzyyfX661//ennf+95Xr8U000JRbu+99y6XXXZZff9OO+1Ubr755rXS+1tuuaXsuOOOa71u6iiSfPSjHy1f+MIX6vtFswsvvLAccMAB9fVnPOMZ5b///W+9/trXvlbe//7312vfM3369HLWWWfV17/yla+UD37wg/Va1H3zm99cfvSjH9XXb7jhhjJ27Nh6/ac//am8+MUvrtezZ88uc+bMqdfinvf3/TNmzCgLFiyo7xcHRLMPfOAD5atf/Wp9jxhy5ZVXlkmTJtXXjYP3ue6668puu+32/4y5Y2ffHUeRVgwx7RdbJk+eXK644or6ucZt++23L7fddlt9XTwXP6dMmVIWLVpU3yMC+54jjzyyzJ8/v75n1113Lddff329Fk9+8pOflDe+8Y31dTHnt7/9bXnFK15RX//BD35Q3vrWt9ZrX7/xxhvLLrvsUl+/7777yhZbbFGv999//3LRRRfVa/u+7bbbljvvvLO+vtFGG5VHHnmkXhu3Zz/72eVf//pXfd3n6FnPelb597//XV93SUHUdRnBJRfn/KGHHlrOOeeceh8Rb+XKlWXEiBH1dXFM1BW7Vq9eXdZZZ5215rlzzCWIWbNmlblz59b3G4dTTjmlHHvssfV1lwV+/vOfl9e97nX1dZcUfMZFV+eS2C7qGtvMsP4X2fyXEcgINBGB/MJqYpiykRmBjMD/ItC5Am8a/MIXvrD85S9/qandN77xjfLe9763Xpuuq1yoBPm3ppemjiqJopnIIyb4HhWEXXbZpdx4441rpdymnVE6+o9//KM897nPrX+r+mZMxEyVR9Fm7Nix5YYbbqj3UZE84YQTyoknnlhfNxX3/mKgyqnvF4VUcq+55pqy++671/sbK1PxpUuXlnHjxq2FAKpCIu0vfvGL8trXvra+3/iIYLZZRdJr1THRRgT7z3/+U575zGfWz/JzRd1Ro0aVO+64o75HVbGUUqZNm1Zfd+7dc889ZauttqqvOwecq+KY89A4uCSiwiV2iVEivDjzqle9qvz617+u7bEvxkeknTp1alm4cGF9v7jkWL/pTW8qP/7xj9fq++2331622267+rpz5pxzzimHHnpofV11276ryLt0o6JtPO+6666yzTbb1HteddVVZc8996zXzgFVPzFWldD+fuYznymf/OQn633uvffesuWWW9ZrsTQzrPzhyghkBJqJQH5hNTNU2dCMQEagU/UwVRPBTE1NZU0RVdZUNEyDNcuJVxrwli1bVsaMGVNTQZFBxWfevHll5syZ9T2m4qaXKguaTm2D9zQtN901Fff+KkEiiWY8UdoUXbOr6qpps2mw46IhUzRTtbRtopaGQ9VVlR1jIt4aZ42RqnjivKqiSKKhUQSzzaK0it4OO+xQbr311jruzk+XBbyn+GbMHRfbrxlVlVPlThT1Po6XaKNq7BxQsVUlvPTSS8s+++xT++hzIX6qADru0ZKFSOvz5bg7piqAm222WXnggQfWQrNo/rsEdNZZZ5Xp06evhecuNfgs+wzefffdZeutt65/6xhlhpU/WhmBjEAzEcgvrGaGKhuaEcgIdKbQ4onpoqm+6ZnopIFNw6SKjCv/qg8axr70pS+VD3/4wzUVFN9Mv02VVXNUgkQG92epXNhOFRPTZnFStcvPVTEUB8RnTYbe5+KLLy777bdf7e8DDzxQNttss3qtgValKdqntmDBgjJjxoz6t6NHjy7Lly+v1xMnTiyLFy9eK6UX8cQZx1Sc0VTpHPjEJz5RPvvZz9b7i5PRvj/Nt86rl770peUPf/hDvY9I6JhqTDUmjqnYa79UllWyxBDVZFHUeavK6bPjnlnfo2KuCmx8bL8qnn0XtcQ057DPlMjv8ojqs/d32UEctm2ajTWR+h7j5nKQmKmBdvHixWXixIl13FW0/T5xTmaGlT9aGYGMQDMRyC+sZoYqG5oRyAh0mgxVu0QSy4+IaaoqqjC+bsoncqpoqDBqgBTTVIg0eWpyE6/ELtUiU26VDk2zprWm2bZf9DOVffjhh8vGG29cU1xTbpUs7++eR++jiiRiTJgwoSxZsqTeP9prZrpueh/hg0ZHx9e4+be2xxIumlFFHnFYpHVuGGfVSRVqscLyR47FwoULy9SpU2t8XI5wjllyx3m+1VZblXvuuaf+rWqs+wGNuSZV1U+xNzK12mbR1TmgYmh8fGZVLV3GMeYup7h32OfU+W98fPYtI2MJGueJqO6cEclFWuezeC5OqnJmhpU/WhmBjEAzEcgvrGaGKhuaEcgIdKLZBhtsUB577LGaEkdlZyw/ooHNFFQDpNem5aKcnysSqoy4T0qVSoXO1FG0URETKyztoslNhdH2qB6KA5bZMb23IqhKjeqSCqapvmipeVWUMBW3naKoCGP7VQ8dOxFV464Kl5gghvu6yo4KowZI32NJIlFFnLFfoqj4rDnTsVbFU9m0X6pgzhn32Ymxqo0q3aKxqpzIecghh5Rzzz23PmuOr8+FKq3LCF6rLItp4pjPuPc0nu4H1Pjtvlfnj/PKezoPjY/vd1xU28VqVW+XFzLDyh+tjEBGoJkI5BdWM0OVDc0IZAQ6U9xo75jKmhUsTfk8kEIVwPTPNFscU1URMUyzIzObKbdoIzqJb2KUpWP8LPtoGm+FTBUT36OiJCoa28gs6r4/26/6YzvFSeNgeh8pjBoF3eunOdM2HHTQQeX888+vCKOpz31hYq9mS9FS9U3lS/Rzbjh/7It4YtVTcVJV13a6z9FlCg2QVijVjOqSiAhpTOyX+O84WqbJ9mv4FPccI2Oi4VaTquPrsonliRwvUc4+2gYr5dpH228JIEsSiX4+g8bc8TUOomtmWPmjlRHICDQTgfzCamaosqEZgYxAZ5pq2qnaounLdNqUW4XOkhGqQiKPeKWypmnNNNWUXvVQxLCdGhTde6gqpCITqX6aS+27r1vkX8Q2RTf1VRXVECtCGjfLyJiW20fxXKR1fK1UqTFPVciSQaKlSCsOOC62U4VUzFRBU5EUId2TqCIseth3r0VL1clIfXbcVb1FOZcyRBWx1GUN7+m4W8pJ5HSMVCTFf9FMQ7UljzR/WrJG/FQ99Dk15hpWVSR9vsRhX/d5dF5pKHXOOKa23/2Gtj8zrPzRyghkBJqJQH5hNTNU2dCMQEagU5GJKm2qGqgWufIvbrgfSkXA1X7/VmXNVNx9UiKMOBmZVMVM22bq7n00Iooz7gF0v6RHz4sb4p54K2qpOmmWU7HyaHgNpaKfCpFo6T47cca9dW9729vK97///ar6qXJqKPV12ymGqE4++uijZcMNN6z3FIvENOeScbPCpIqwmKkS57XmRsfOpQOXI1STfY/4Y5xVOTW4WsZHY7NLB7bfsjnipPNKZBbtNU+qDnuwi2NklVQ/S2XQZ1P81Dgt/jtGjqPzMELOaF+w3zlea6wVITPDyh+tjEBGoJkI5BdWM0OVDc0IZASedlS9KavpovimCmY6KoKpxIkDKhGmu6tWrSrDhw+vKOHrpqkioeqb71etUJlSeVHZFFvc66SaI6aJCSKbGKt6Yvujcx5tp+cbqqCZlqvsWJ1VNco9fd7Hsjy2U4OoY+0ePcdOjNJU7FgbNz9LNIgqVTqOYoLxFG3ELj9XM7PzVpwR8Yyt1UdVu5znolAUH/9W5HRJwTlgiZWo6qwxEUsda+ekY6Ra5x5DjabG1iUOvx+cJ5GS6HjZZp9B42M7nfMuHWSGlT9aGYGMQDMRyC+sZoYqG5oRyAh0IpUGLVNrU83IcCiGqEaZalqGQgVKxPCcNVNB007Ty0id1DgnqkQlMlQiRD9VJ7HOtNlSGLbTapOa4iwDoronlmoi9eh2P1ekNc1WGVSR1KRnbK3qqRplnFVXRTyVVvFEhVfUElXc46YyqGnW5QLnj3NGk6FGU42v9sv7jB8/vlx77bV1OcI54Di6pGB/RXLnm21TGbeyq2qaf6uZ2Zi7zOI4GlvVRg2ulq+xbJGx0vAZnR3pPVXnxVi/TzRXi7eiqPNZA7DfIaqumWHlj1ZGICPQTATyC6uZocqGZgQyAp2GOvcSqhyZumuiM5W1QqkGQtNIz+kTCU3FRU73l4lOmjBVWzR5ehiBKa5KnKmySGK6q8HStFxVyPiYrnsf46y6ZFru/k1Td1NoY+X+MvejaaT0XEXx1hTdUjlinegnJpuiq+yI56b6IrAlfTR/2l/NzN7Tz/X+jotGVlVsy86IhM5h1cZo76HYoronyqlCaijVFKr51mfNsVaJi84P9bP8W6uq+jwaN83S4qfLCKKr50j6fEVnGro305JTYqxLGfbXODsfMsPKH62MQEagmQjkF1YzQ5UNzQhkBDrVEFUqjZGu9psiuidLA5jprkZBkVNjqu/XqGaqKfKIk1HpEsuhaGATl1RGVKbEPRFDRclUX+wSkUytTaetOCrGmqJb4kM8sW32yziIsabfkflWZDAVV3USaUVdMT9StYy5hkxjpRItVjtPjIkobWVLlwjEf9vpXBLTVBX9LOew2GL8NcEaHxHeZ8c2+Kw5T6JzJH2OXF4QaUVI57DzwfmpWVeUdinA94jwljzy/Sr+9tHKou639f6Ol3HIDCt/tDICGYFmIpBfWM0MVTY0I5AReJpx1HRdg6WGSU1iKoYqeqpyqlEaGi2RYcVOzxPUuCjOiAMigwhgqq8qZIkMTYAirfvONHyKNu51cn+WJlWNo+JzhGm+bhrvmYlWTxVPVJpUA8U6UdqYqLKJuiK5MTcmxsrDETQSq+6JS6q0jrVmS/sr5ovG4pXz0Dljm0UM2yZW+7qxsmyLn+WygHNYTPPa+ziHXZoQJzUPq0r7fhHPZRb74jPu/HSsjYPYLvIbczFQw6fXxlw8VAX2u8LvEJc4MsPKH62MQEagmQjkF1YzQ5UNzQhkBDoxx2txw1RfZUTTnYdQmLpr+BQfVENUYayuKbJpFhUrrK6pyqB6ogqm+hCVSTF11/iq6qFp09RXhDFVNhW3RIkpt+ihoU7VzH1zxkSEVCFSwYkUTPHK9kf3MbbihognwjhPbLOqtIgh8qioei0Ca3B176Hj5bwVbUQnsV1EciwcO82TLgt4T88BnDBhQlmyZEndt2ipFmNurJwz7huNKp36nFoayCUC4+az4xJKdNCMVUCtPOxz7feGY+F+W8fd51HV3tfdl5oZVv5oZQQyAs1EIL+wmhmqbGhGICPQuYdOfBCXNKq5eq+aoIpkFUcNh2KgJknVFlUPVUXTfj9LjNUE6748U1avTd0t/aFiKKqIZhEyq0K6b8sUV3VGw6FKSlTZUmTwWhzzPD5jpYpkH6OzGr2P4yIiOabG04MMxDHTfueGGOiZfSqnoortV5F0XDT6ijzuaxN7VcDFPeeY46u51HJAoqjKrOOlGivK+bfOGdvv3jr77mEuLke431BF0ve7pOOzLzaq5Fpax+8Qx1SMVel2HloV1vjY/qw4mj9UGYGMQJMRSCRsctiy0RmBfkagsyTF0NBQGRoaqiqGqbiqnEqWabPKoGgpQqq4iWAqJiKDKonKnWmqKbEptMqIiKqaY9vcR2YfI/Rw75spvffUcGsq7iEXqjYip/fRlKjh1kMlvKefJUqLP6b9IpL4L1KJWpaFsYyJWGfbrGhqRUrHSORRtdSE6TyMjrZ336slZUQVzbSOdXSYiAZplylEFSuailfij+pkZLg1PrbfWPlsOv81o9pmMVPssr8imPHXtCkCuwdW9NP8qZJoG6zgKhq7h9HvCp/BzLD6+UOVvc4INBmB/MJqctiy0RmBfkagM+VTsdLcZYorepiuqzhYfVRVxbISpqAqKZr3REvNn2JsdJZcdOCFWOE+JpUOU2UrZIpmGiBN10VOVS33sol+Yq/IIGJoujOGIph7GKMj7DXoauwUl1TKjI+o5d5P54YIIxqoKnq4iUqoyKCqpdJ62223le23374uWWgiFWHEB5HEeWJpFFVgMU3FVuR3fF2+cEyttCk+G0/nmMspYpdLJWLXxIkTy+LFi9c6x1OM0oBtrHxOja37Lt3LaWxVil1CUR12WcY4RCqnr/vs+91iyanMsPr5Q5W9zgg0GYH8wmpy2LLRGYF+RqBTLbrpppvKzjvvXFNNkVCFSPVBFcx9fKKBpkTRSQVKfDCF1ggqIlmeQpVKldMzFjUxik6+buprmurnmhKb+pqy+rrVLzVhuh9QNDAtty/GViR0XMRqU333Y9q2SEFTdfKz/FuVStFDnBSpNBmq7okVmpBtg8ZCx1ozqp8r4onYUVkVP1d11X1w4qRzw2UNDbqijc+R4258RGzboFHTQy7cexhV+o0OldDgKgL7TPlcqyCL8M5nFWFNv2Ksqrdjp+LvHNOQ7FhkhtXPH6rsdUagyQjkF1aTw5aNzgj0MwJPM466Mi8KRcXtxQrVQ81pppem5SoIKk2qeH5udKiEKp5pqm0Q5UxHVUxUcFT0TL8tc+E9Tfs174nDYoWpuFUlVdM01opd0b5O76N6KLb4uRoaoz2k4r9qsvs0VQ9FUa/Ff42RjoVzQOxSwVQtFRnEOjHW5Q73rjrHVH6dz85VDaIaR1UJRXhL07jUYDyNv/M8wjTjYMzFMZdT7K/VcY2JffE5ctlEvFUN9D3GXGz0b12y0Mi97bbbljvvvLMuQ3mYiOZSzdWZYfXzhyp7nRFoMgL5hdXksGWjMwL9jEBnFUSVAg90sGqo5kONpip9psoqcaaO7i8zlY2wSKOm++NEs+g9puIqbmKgbRBJVHBUA63wqZFVQ2akgokYpvpirCmxGCVqiUW+RzTWiChmipD2RSyyZI2fazs95l4VWFVIE6+KnlUxVVRFPE3Itlm0URETx1TWnDPOB9vmfLANIrn3V4n22dEw7LWIpOIZzUkRSbXO+emzZhkc54Pop+pqpVwRNdp/Kra7xBHNk2ipx744f1ROnQ8qsJlh9fOHKnudEWgyAvmF1eSwZaMzAv2MQGcaHxXzVyFyhd+9XRbbd7+V2OhnqTiIP5b+ELVES1UVzXVeiwmqUWKd6brIIyZoZvNa7BIbbYN9VyWxPRodTdGNlWU33CeoIiN+qkyZ6mvkM+XWXKp51WUB26wy5cEWGkpN441PdO6e7zdu7uPzdfckGjf3rmqsFbtcjnDOq34aW82uYpfzQUQSOZ3Dtln1VmOt5m3VahHYfbWOhSZkl2jc52hJKOeD89k+2i9xXhx2D6PtV4HVFeCzqZK+dOnSMm7cuKoYOoddSsoMq58/VNnrjECTEcgvrCaHLRudEehnBDoRxrP2NEmKeKbuGi8tjK9pTdQyPdao5v1FJJUO03L3GIok7sMSwdyb5mdpjjW9NybRMdwihnHTKKvSpJlTc6DxVAXzoApTd/HQfWHGTXOpabwoLQrZfpUs0VjMEakiY7DlYvxb54OIJ3JqwrQipWPnMoIo55KCBlFVOePvGPlZqlfGRPNqVA4lOrBDk6TPi0qfCKwaa0kZVTY/S5RzycU5IPoZH+ePJu1ly5aVMWPGVExTQTZuzhOXWcRAx0tEFf1cBtG4K0pnhtXPH6rsdUagyQjkF1aTw5aNzgj0MwKdxeRd4dcAKaqoGPq6qoqo4utikQqORjhVA5UO007TXY2vps2qXZb18J62IaoOKj6oVGqgNZV1P2akdIi6puLeU1S0DaK0iK0ZVVSJKkaKwCq8kUFUfDBFX2+99coTTzxRkcFSJ6p1/q19EfEi5UgzsMgm4llZ1PZorHVc3B8aLVm4jCByqo6prtovsdTnSNQSLUU52x+VNlL5dQ6IimKgcbM9vq767zMoGrsU47g4V33e7aOqtLHVGOwzGLkFMsPq5w9V9joj0GQE8guryWHLRmcE+hmBTkXJ9FIVKSq8ryFQ9cH9cZadUVU0Xdd4pnKkEmFJDTFKlUTFyhRUHHCv4oMPPlg23XTTijO2QeQUGzWwiVoW7VfNVG20xIelOQ455JBy7rnnrtUGcdt9eeKPbbOsjdgohpj2W1JGM61GQeMpPkSlgTQ0WlLGQyU0E9pOscK55N/6frHF99tf1U/7Kz6rfKnAquip2DqOmjC9T3S24OjRo8vy5cvrWDteopb774yhc9I5YDtFV5FNRdu+REq3yynOQ/cUuywgfqps+t3iWGgQ1RyrcureXpcXMsPq5w9V9joj0GQE8guryWHLRmcE+hmBTiVCs6iKj6myCGbqa8onwlgt0H1wlqRQifAMNd8jsmmANBVXYTHdtc1imn30rDqVIN9/1llnlenTp9eU3ripbqgkGgfNkO7/Er2NlSVNvKftNO3XqOkeT0vKiFEquabu7lkT4UXFSPkVN0Q81VvxU/xRBVYxVPmy/IglU5wbzkPnhvF0HF3u8P4uF9gvzcmOnUZH0VtcdRnBua06Ly6p6Hm4g3ju/kHb6XKNyyAR2jt/orJRYrVzSaXVJQ7VT/uiQm3fVdvFdlE3M6x+/lBlrzMCTUYgv7CaHLZsdEagnxHoTLlNL90PaOrr66Z57gXTIGrqqKKhOmAa6bWpo+miqa/VMjWkmZaLOapUHh4hToo/VqH0b8UHjZGqVCJeVAFS5UUUFWNN7614aXpvHDTjqfSpaqkwqsSp/qheucdNBdZKmyKY2BjtITX+mjk1HDoHxEBVM5FENVm0dBw16NpH8d/z8ny/CKmKJ9KqGqsIq66K2z53KtFiqc+X5mfNqy5xiIFWdo2qpNp3Mc29hJbBsY+Or/NKt4D7YX2OfO6Mrc+7joLMsPr5Q5W9zgg0GYH8wmpy2LLRGYF+RqBTRRIr3N/n3iXTY81dYprF8y0lceCBB5YLLrigqmym8aKEWKcaKAKIS6pvousdd9xRRo0aVT9LbFFR0ogo6preq3apZtpmjW0ilamv2BjtERN5xG2xzj1WqpCm9OKG91F5EfE0CorqKlyiukqfyKOBUMwRVTRMOl6inzjpPFFV1GQoBooYql0aPkVFsdo9mKrMKqpivvtqbYPPkbGyKqwxF6OsnqriaV9sg/GJMNM+qtz5jPssqz5bSsjPsg3OTxHS9htzsdc2OCdVw31eMsPq5w9V9joj0GQE8guryWHLRmcE+hmBzlTWVXqxyDRSBDDNU9nRmGcaL2KID+4ZVIHynhrqojIvVjW0Eql7rzRtqmB6TxUKlRr3ymmGFGdUTEx3jZuIJKIac5HE9njOoAqX5lX3czm+pvqW3NGsa7khlU3VSTFZpU/lyCUCDckaOO2L6pXLDsbWpQDxQTxx36h4a99VUV3uUMUWz+27c0n8cc+d81ZlUBRy7tlm3+O1SplLEPbRkju+7tx2ycUlDs2Zzk/nuUqlmOlSj8+4GGt/Ve2dn46jSwcuB2WG1c8fqux1RqDJCOQXVpPDlo3OCPQzAp2GrgsvvLAccMABVVnTTKjxLErXTYm91sD5/7Mn0dRXtUXlSOR0D5cYaFruPilTYlFULFJ98/0eFuC+MFFO5dH2eGy6qbLptEgVHXwghtse0Ux0FW3EMd/jUoDKrHsSxaXoGHf3iq5ataoMHz68ziWRUNS1SqcorRKq+VDkEccsN+TY2X7jLOo6l0Q/n4Vo3EV157xIFWGdZziqYHpPcVIV2FjZFw2fPkcqbiK2xlfLQImo4qdz0vZoZHVuOxYqfV7rIhDPXU7ROJ0ZVj9/qLLXGYEmI5BfWE0OWzY6I9DPCHSeGQoNuowAACAASURBVKfxzL1IGsNUtdyHaNkNMUo10DImoo37ocRAzZkaQTUNqvqpMph22hdVMDHT8wc1o4qcUcqtuU4M1IwnbqhYmZZrLHQ/poqJfTHlNl1XqbENUdVW4yDqioqaAEVs1U/333kf91eKhKKTr9tm9wD6HlHF+3gepdVfVbVUrkUPUVQ0doxEP83AKo/GzTmp0u1nGSuXaHzWPChEo6ntVMWzbbbZ2DqmkdprfFzW0Bwunvs8ioeOkZjv57oMZb9UkDPD6ucPVfY6I9BkBPILq8lhy0ZnBPoZgU4MVM0xbRPTTPPEPVPcyLBneq8ZVXVAtDGNF+VERU2SKmKqHiomKg6in6qZqp8o6r4842Ya7H2icwPtu3vuNNdF+wRVMy1xI9aJIapOougJJ5xQTjzxxKriqe6pCIvDltyxv2KyRkRxw/kjAmj+dN+ln6W5VAz0szTNqu45P1XTRAznpH0X8cReDbe233aqPIrDIrnLKY6788o54BKKfXFOGnP75RxzTFVpVVFVRVUwNaA6puKnqp8OAc2fPps++9EShId3ZIbVzx+q7HVGoMkI5BdWk8OWjc4I9DMCnWmwuOFeME1iKmIa9kwFNez5Hku4iJyqY5ZnMaU0LVdVET9NZU2VrZRoOR3TYIv8q7Z4bRqvqhgV3reP4q0IoKol6oqxKoyqNqqxjpftsZKnJU3sl+0RFSPzqu2MxiXavyZGiSQqm5Gaue+++5ZLLrmkYqzIE5U6cV+qSwfOef9WFdvXxUz7ZfvFT8vmqOr6t45RZMweO3ZsueGGG2p//SxNp855UVFkVjF33C1l47Nv+50/KpVipn13WcblF1FUrFa1dO5FZX8yw+rnD1X2OiPQZATyC6vJYctGZwT6GYHO9N6KlCKPVRytOmgKHZ1b5946lQ7RQJOkSpb3NJU11Tfddb+bJkPvKV6JumKIffd11SXPlfMgCd/vHisVQw2Btl/TqQqgRkHRT1XFGHpPjcGqk97T1N29b84NS4L4fhU626a5VGzXxGjab5uNj0sNLhdYakZVV4OiiOT8Eas1hRp/57mv22aXJoyVqqto79KE89O9fmK+fdTs6hx2v6FzTDOnCqzVU1UhxUzH2vv4/mhcxEmVfb9bLItk+8VJq7k6hzPD6ucPVfY6I9BkBPILq8lhy0ZnBPoZgU4ly2vVARFJ5cijq90HpBInJpgqm8aLM6aIopwqhsqU5k8RTGOb6piHAkTH1lt9MTqaXBwwpXf/mqZBP8v0XnQyVioplp0RbRwLFZwoXbdapoZPFRzxTcxxv6co6hgZfxU9y9G4LKBCZF+MbVRd00qwIqoY6H2iAyBcmvA+qtuOo/tYxWHvL06K9u4TNFa2WXxTSXT5RbXauWTpmAkTJpQlS5ZUhVEEdrxcrlFtdM5bxddnSmVQhFT1VhX1GYkOatGQrHLq909mWP38ocpeZwSajEB+YTU5bNnojEA/I9Cp2oiEqgaa38RAFSUVDQvXixjuS9JcKhK6lypKLzWYWYbClN77W/bE1FccUMVQGTG1Vhk0pVfdUEXS7OffqgSZ3osSGl+Nsyqk7zctN+aqNo614yvaGAcVNBUi95yKwGKUB1VYfVR10rapRKv2ijCiqPHXdCoiuVygcdQlC7FXZBNhxFXH1H1wopymSvf3+brX7rOL9p9quvZzXSIwzuJetCxjm0Vax9oKw+K8JY/EXs3Yvsdqw8bZOWb7XTLSxJsZVj9/qLLXGYEmI5BfWE0OWzY6I9DPCHSmYabZGvBc7VeJMB01bTNFNO3UgCeyRSqeCpEoamoqNop7pqMqmOKGaoXqoSZGY2L6qlpkaR1jEqW+ltdQ8TT9Ft8sXWKbVZeMv2ZF1RyVPsfFsXCsHUcVIjFWRVKctF8qpNESgaqQywvR+ZUihigq2jiOzlsNjaK0mKaxU0RyWUNDo23ws4yteKuCaRsca++vWdo9ti6/iH7OW8fFJQXHxbJILhFEz7LI6by1EqnPuzE0DiK2z7UqsKplZlj9/KHKXmcEmoxAfmE1OWzZ6IxAPyPQiV2qUZonRQzTP6uPiiqqKqo/Yo6IJyaoQIlaqodei2CqZtFx26bKpu6mqe63Uq1wD5TGS/HQs/MsxaOaZopuSmx7vBZPVJ00BGoK9dAQU3fxXzTQOKoSZwkXDa6qqxpcVbhEGJFfhVQkscSNuOrc00Br+RTNxmKRqrfLAiK5KOceRs2ilnnxdeMgMrvXzzb7uksWGmt9Hh1H42AMVahdHjHmzhnj42epokbnHhpnlzt8xsVqP8t9uM6xqP1+t7hEkBlWP3+ostcZgSYjkF9YTQ5bNjoj0M8IdOKbe7s0YYpCKiwqJpYuMcXVvCd2aaTUJCnimQZHKphGRLFFhcJ0XWOnqGUfRVEx1vuLMKKWioYqlQqmSCI2qrCIEsZt4cKFZerUqXWPmPv1RDMxU9wW8y3foTKo8uj4igCm/c4ZEclxVEmMkEFVUXzQwOnhDs6x6BAN0cl4ehCGfRc9ohjafhVJ4xypz2KOaqDXYrjY6NKExlfns3vunFcu9TjPNWC7b1GE9D3OB5cUfAZVPzUGe6iHarV98TvBOKhaZobVzx+q7HVGoMkI5BdWk8OWjc4I9DMCnWmzq/em36bKrvyb5omKloKJ1K65c+eWWbNmVbQx9TVtdv+UWCQCqP6Ib6bl7oX0/D7VEFN98UdM8z3RAQrGSvQQtVRnTL9ts8qUpkoVRvtlim4pEtUf9/eJVMbBz1J11azoWKiaiRuqwNF5hf6t+Oz+UOekbdaIOGzYsLJmzZo6l2yne+5EJ+e8SquxUg0Xwx1HnwWVYv/WGLo0YTu9tm3iqtf2y+dLPHc/rCjncfOqqCKh7xfnVeed5yKec8OlFautiniWsVKd1xgsbmeG1c8fqux1RqDJCOQXVpPDlo3OCPQzAp2pskqEWKfBTzObR1SboquUWTrDlF4FwT16Kg4jR44sK1asqKm+hlJTa1N0U3FTSo+bV9lR2TQOqm8im3vobINoo7LpeXYqICKte8FEElU/sUjVVeVLJWjp0qVl3LhxNW6qmfZFFVUcMyaa+sRG3y/62U4xSvVKhBHnRSFLxIi6Yovj6PKC4yjeOkait+MlYmumdT57bLrzRLXdvojnzu0IFVWQbbMI5rKGSweqwGKdarhqu3v3VOuMj9caX51LKryR0drlFGPld4sVR/1OcIkmM6x+/lBlrzMCTUYgv7CaHLZsdEagnxHoRC2Pa7eshOmcqKgq4T4s9zFpmHTflsjm36o0aV5VTRAtLT9yxhlnlCOOOKKikJ/l66okprum0+4HVCWJqk1qchNzvBavLGWjkqjKaUxEPBFJnHGMjI/vEce8j9VHRUhVxahEjKqQ2OK8En+Mg+qP6KQ67LKDWCr6OdYqUyplLmW4dOCcF7VcanApwDkvUjlvjYPtVP00bvbLvZ+OabQsY99Fcvvic+ReWpdrXCIQ2VQw7aPI6ef6PDr3HAvnuQgZIbnPQmZY/fyhyl5nBJqMQH5hNTls2eiMQD8j0Lk/zuqIXqtYmVKKdZa20EQnLqnmmFKaRlomxddVZMQE1UbTYJUp03vNclHbxCIPKVD5UgkydbdtlpQRA42bqpyYICpqzPOzNNk6LtEZc6otmi3tl8qU9/GgB5cFxDrHV4Rx36I45nu8NlYim8qdWKF6JcY6f8QiEVsUUkETq50DIp4mXit2aoS2DJGI5Bxz76SYqfIudqnQ+byIbCp3IqrqtvPHckyqwCp3fm6019K/Ff9Vfp0nzjcVc6uw+lxkhtXPH6rsdUagyQjkF1aTw5aNzgj0MwKdyoV4JUaJP6ad0flrnk2m+maq7GeJk+KnB0aozlj5UCOlpTBUA8UBFbEddtih3HrrrVVVVDE0VTZ1Fyc1TPoe0SbayyYGmrrbNpUjscL9XN5f7BJVTLnFVftrfDzD0X12xlyDq3NAvLLMiHhl2RmNr84T55gqlftV3cenedJSP46jxl3RTKOmWCQeeiCC7RGlXQYRf2ybaO8YGSsx3FiJRc4HFW3VNFHdZ2rEiBFl5cqVdc67NOHyiAZX0cw5ptFURViTrfNNI6ioqEoo8rvfUDTODKufP1TZ64xAkxHIL6wmhy0bnRHoZwQ68UTsUmGxyLxnpZkGq7xoUFRNMI1UsTJFNI20fI3mz8j0qJJi2m/6LRpMmTKlLFq0qKbHIqqopTJi3zXHquxo5DPV1xSnUiMSalK1nIhxtjqrcTBupvEqXO6DmzdvXpk5c2btu/cRpVX0nCdWs3RcjIMYonLkUoPKpm2LSvG4X1K8ig7XsAKqWHrYYYeVs88+u/ZdDIkOKLEvkVLp/lDH12ufBXHPPafOSZFcVBTJnYdinWWRXMpQgRXxNNbaZg3bLrlEBmafNQ3AqqvivP3SYOwykbHKDKufP1TZ64xAkxHIL6wmhy0bnRHoZwQ6DZymvio4kdlPhUIUMhVUBXA/kUZQVUVRUaXGFFezq0hl2q8aoonU/VOilphj6ms6baoscpq6izYqaFE1S/HHMiAiqsZCz+zTPCkaaKQU08RMVUiR3Dng/r7oAAjVHOOsSmU7ja0Kpojn/HE5QkXP+zvuqqjRoSQqbqq9oquI5Dj6t6qKopx4qGKoCVZEsg2ivUsojpfXUcVXFUzNn1a7dZ542IdqrMqvbXb5wmUT9yFaAijaJ+gylM+yz5rfFZlh9fOHKnudEWgyAvmF1eSwZaMzAv2MQKfqoWHMvWymba7em+pHZS5Ul/xblRHTbNN+lUpNpJrxNG26Zyo6LtyqlfbXaw2l7ntS/RRdxRCxSCOf6b2YaTVU0UOUU10SWyxForlOFUy88nNV1kQMU3fxxP2D4rZxNo1X0RNbRIn777+/bL755lWts19+rnEW2yP0cz6LJyq/CxYsKDNmzKifK84bQ5VW91EaK+ek+OyygEsHIqTzVuOlpWxEMBW9qHSSyzsqpLbHe3oeomPnvkjH12UH9+26XOOzqbon1onGqswuWRgHHQiZYfXzhyp7nRFoMgL5hdXksGWjMwL9jMDTVELVAdUZU/So9IRGRJVBzyPTmCfuec/oMAtRUfOb6aspsXvTRDMxQVOl+7Psiym9abkx0fymMVVlUBxTkYnioOqkIdY9fSq5mvFEDBHG1N10XeXOzxKjjKGKnum98REZ3NOnCqlCaoVb1SLv4340lyNcalC1FJlVqJ0/tk0FzblqnK1oqtHReW5sVX5VA0UzzZmiqPPE8XW/nss1Lkeo7rms4fMlqquea0BVqRffRGmXNZxvtkHkdK+o4xJV91UFzgyrnz9U2euMQJMRyC+sJoctG50R6GcEOtNaTW6moOKPiKQxT5QQu0wjTXdFOZVE1SuRyveoRKhiqESoFrmnTwxR9bAvpv3ujbKP4o+vm+76WcbQzxI/xUARw9TdcYna4GeJJ8ZfY6TIoOlRJU7VT0RSKfP+HsAhmlmeRdzQnGzlSZVB0UP1UEQVsSPTo7gXKXfisDERIZ1XoqhI5Vj7fE2YMKEsWbKkKpUintho2/xb2+bSjfhpO1WNHVNNyKqKxlNF0n45Hxx3v0+cGyrgPl+2RzR2icDnKzOsfv5QZa8zAk1GIL+wmhy2bHRGoJ8R6Kw6KFKZ/pmCmv6JPyKYr6uGqB6KcpZtufrqq8see+xRU2UVECuLaqoUuzSFqgSJfiKY6a5KpUec+1mqipoexRxTdJVH42DlVRFGLHIsVNYs/yI+aL71b1VYVCpN6cVMDaJiY3SWoum6e9asYmrFWveN2gbnj8sIqlqajcUlkVYMVHXysxxrlyYcOw20fpZqtUq089ZlEyu7il0+Iz4Xvl8lLtqT67MpanntvlTb6euaS41VZGRVvXXpxvZotFZJ9znSmWDcNLV6z8yw+vlDlb3OCDQZgfzCanLYstEZgX5GoNOAp5pjOhqpMKbTrva790d1T0wQ5UyVTcujQx/c56jJ0DarUGjmVIESN6ygqHql6iHaaMI0bn6WZjkPp1ABtC/RMeJigmcdWt5HVHe8xG1TfRU3z/LTfKsp1HnivktxwP1xttn32x5fN86eiak6JsqJ1c43FUwPWBHx3JvpfNPEqBlVXPU+Llk4B1xmUSW0vy5HqES7ROD9fUZ8jzisSuiYWhpIjFWJ8zkVvX0ujIOVb11mEQNVP6PDU1zi8LlwTH3uMsPq5w9V9joj0GQE8guryWHLRmcE+hmBzlTNdFrzYWQu9XVX8j0+2/1Nvu77VS5UrFSgNE+KohrwLHtiX0Q/UU6sUJVQabJsiBircdH3REd1m8a7L899fGKUeGhKL2aKMKq6qnum6+KqexItQSOGOBannnpqOeaYY6p6Kz44fzSpiurij20Qu5wnoqWfJV5FB16oMKpaqkprahUJxV7f43iJk85P55iKqksQfpbKdbQM4hKK882lAJHZZ8Qqsj6n4p5LKGKp6rZx9jvBOKv6WR1XRdi9io67fVcld/nC68yw+vlDlb3OCDQZgfzCanLYstEZgX5GoFN1UolQdTL11VioamBaKMKoRJiamiK6z8jX/VtTWU2Ytse0VtXG91uixEL9IowKiHvEoj2V7tsyDVYBND6aDz0G3ZibKotCGu3EE9Uf8UGk0lxqVVUrtRpD76nio4lxnXXWKatXr66oaMxFcu8pZop+jrV4ZZu9FplFctFVzNdAK/J7H9vgkoWYrMHSPXqW9InUVfvrnlmVPpFf3HaOuVdXg6hz27FQuTMmjqlzVSO0VUBVHjXTepiLc9Lxsv0+s37nzJkzp8yePbvOJb8HNJRmhtXPH6rsdUagyQjkF1aTw5aNzgj0MwJdVIFTjBJnTKHFSZUgy7+YiouQ4oYqgKqW+wdN4zXgqb5Fh0So/qiwmL6qyNge01rRwNTadDoyztlmzZminyqqbbbEiognCol4jp2vi+q+RyXIMRLDHXdVM9uvsubeMcuwiADOEw2KXjsfxDTnm+8ZOXJkWbFiRcUK+65xV/XQsdOorKoo7rkHUKRyfFVpRSoVUtHepQbns5/lOYz2S+OlimF0oIPPnYjq34qWqs+imXNSzNeQrKnYJQLNwy7FqJy6FONYZIbVzx+q7HVGoMkI5BdWk8OWjc4I9DMCnemrZjD301mZ0JIdKh2mmqa1mtlED/dkRVUcNVWaEptCq6RYbkWlybTZ9FJVSDxUxRATxEYVIlUz93P5WRpKPaPQ+It4KjKm3JozTb+NuaqrsTL+ltDxnqozHkHufBADbbNmVJcCRDzHWrQUE4yPfYlUYA8+iA7OMJ7uVRQnbbOmXJcFRH774lKDz5Hz1jkjslnmxWUBX3deubdOZHN5R0RVxRP5XXJRwXe8XArwnqrDorGoG537qVFcJPd5d/klzyXs549T9joj0HwEEgmbH8LsQEagPxHoTDVFJNM2EUDFx/RV9DD1VR1wX5WF/S0roZFSJU40UD2xlIr4aTtPPvnkctxxx1XlyDTelNVUWfNeZHZVxbCMifdRmbI9xllUEb29p6qNZ9VpDvRACpEqOlPSiqkig+qkGGib3fNozEU2j3f3PaqEoo24rTnTfWeqe5ppnZ+Oi2qvqCumiX6+rnrlXPU9PiPimGNn+106sJ2Or5jsPlmrzroMYnvcSxvt0XP/oDH3/e7V9dlR3RZpvaeIKuZHex5d7nDJwrY51plh9efHKXuaEWg+AvmF1fwQZgcyAv2JwNOMo6bopqzuJbQ8i/igmmb6bQkXDaiaynxdc5rKo6hlKm4ZDVNrMUflSMVHpFX9Ean8W/trWq66YWptii4Ou3dMpc+9jaozIok45vtVCd3nJZaqfqryGE8NpfZXdFUVshSJipsoJGKr6Gk81hDrMoIY4p5HS+I4P106cOxEPJcdVHKdt8bTMbWdIp77N1XPbYNY5745Y+7YaRCNDMw+p2K79xHtVfnF2Ai3fS6Mj3s2ja3LFCKhqp8mcJVo2+ZYuzSUGVZ/fpyypxmB5iOQX1jND2F2ICPQnwh07i9T3TPNtlyGBkvTQpURU2JxQ/RTURKvVK808olOomJ0UIXKlOhhqmm6a8VLU1ZVRdFMo6DGy+gYd+8pPojGKinihmhgG2yz6GdsVSfFE9Vhx1GUE6/EPXHJuWHqbkxUu0Rd1V7HJVJ4xVIx3Dlg30UwVS0RTHOmyKMhVjXZ91uB1rFwTDVGWj7Ittkex9E2iF0+m+J5ZGR1qcfDWTRvGzfP93R/37Bhw8qaNWuq2u7SkJVCnZ8+p6qBoqjPuO/R+O3cywyrPz9O2dOMQPMRyC+s5ocwO5AR6E8EOhFGU6LpouZJEVLDmCU4or2HGsD8WxUNscWUUvXQPYOiqOVN3KPnZ4mBKhSmxP5tVC7DqqHihvf0s1RJrEoqShg3+yI+mDa7d8/3X3XVVWXPPfesqbtxM7XWMGlKr3rlkfciiQjpPi/3J4p4YotLCpaIEQ9FJ3HMSpiaQqdMmVIWLVpU+6uBVrRRGXQPneNluRUxU2OzY6ppU7Ol/VUlt80aMh0jl0dmzpxZ5s2bV/vlPPF1FVjnsPG0TJBz25hYZdelCeeD71dJj8rFuCxjZVTNpd5TlVBV1Nczw+rPj1P2NCPQfATyC6v5IcwOZAT6E4FOI6IKkXuaTOdMcTVzmu6KS6KQiokqgIihomRVQ9sm/oiNmglVlMRbTYCaS0UDDaWqWptttll54IEHaoru/S2pIeaIMxoUVZFM0b02JbY8jsZL8UcE0PApqkS4rfLlfi6xSFwVLd33p/lQVFQ5cm+j42I8VVE1Q4pOYmCkGrsUINK6xKF6awVUsVTEE8+NVVSexdiKnD4Ld999d9l6663rvFLRcw6IkM5/55j778R5x8tnSjVWfFuwYEGZMWNGbY+KpN8JYqPzyiUanx3nht8JtlmTsAqs5vDMsPrz45Q9zQg0H4H8wmp+CLMDGYH+RKBTUVLpU/kSGzUxmgZrJtQYpnKkGXLWrFll7ty5Ne3U2KnpVPVQdUnkERk0K6p8mdbaZlPip556qnRdV9tjKivaqHx5JLefZd9FTvFElBADvc/pp59ejjrqqNoe029VKmPu/UVsEVIVSaXVuNlHU3T3o4kMXmt6tC8aI72PY2Ha7z2tDiqSq5rZZtHP/ZL2UdOj4+i4uGQheqviqdiKb/6t4ytmOm81Z4pyYrhzwKWYDTbYoDz22GN1nhh/TbCae13uUPE3Pi7vqACKqz6/Llm4Z9b7iMbOK5eARF2XBfzeyAyrPz9O2dOMQPMRyC+s5ocwO5AR6E8EuujwCE13Kk1ilMXqTTtFKtUHlSxTPo18ptaqSO5zFHNUTzS+ej6d6bHlL2yDe5q81jhnv0x3TfXFAY2Ofq6YIxrYHlUSMcF0WjwXe1U8NeuKUSKhbXOPofhpHBxH03Xnkjgs8otd7gcUG72/+KaiFJXicUlBJU6zoshsTHy/iqQI5lhY2sWxsKqqqOs8ic7ujA5iEME889H55rPpmLrv1baptGrgVEl0Pqiw+3yJ5CrCPqeRIVbV2Pj7nSPqZobVnx+n7GlGoPkI5BdW80OYHcgI9CcCneqDqbLn6JmSmcqaIrq/STOhKaipta+rpKgmaCY0tVa1ca+fRkeRzRTaNN59WOKG79EoaHkc4yB2RW0WPey7qo1pvzjmGGnMi3DMfhlbsd103ZRedU+kFffE0mifpqgu6qoEiYfiiWZOr42/KK1hWNxWsbX0imhmlVpVPxVVYyUief6glUjFc3HM8XWuashURfV5dM64XCCCiYQaSl1mEe1ts8sgzivRUvVWI7TKrO302RQJHRcx0INLnG/Ok8yw+vPjlD3NCDQfgfzCan4IswMZgf5EoHOfkWUoVFVMa8UT0znTfjFBnDQNjg59UImz9I2Koeml6oaqpWmwfdGMJ6ZZTdHUXcQTtVRnVOX8LPHNOGi0swKk6piIqnIkPmjoFUMcU82WIqGoKBJ67Wc5LqKEcRb3VPdEePtrG6xMK8KLGH6WiCd+WorkmmuuKbvvvns1VYpX/q3v93VNki5lWBHXOakBVSOo2OgeOudJdEiKSy7GSjO2c9WxFm89fMQlF5dNfGaNv+8XvX3uooNXfHZ8No2nOOl3gksTGowzw+rPj1P2NCPQfATyC6v5IcwOZAT6E4FOtcX01fPmTM80YVoWI1I3NIW6X0kVQ5xRHVBtdC+hJkPLuYiKlsERr8QuccM9TZayUSFShfHABdsvMrsXUnxW9dCg6OvG3HTdSo/uNzS9Vwky5o6vf+vrnqUoelh103EXq0UeFR8VN9+jeVUsUpkyzmKp81YsckwdL1Uwccb57LxS+RV1XVJwfEUnzZDOJcs0OV7OVTHK99gXMUp806xre6wu6/iqvDteLgX43KkSinjOYe/v8oLPnUsTvke0dz44Rplh9efHKXuaEWg+AvmF1fwQZgcyAv2JQGeKqxnMVM00zz19pq8qU5b1MBVXJXQvmAhgmqpBzjPyxKtIubP94oNps+qJSpa4JBqYKrtnTYOcpjgVKPsiNoob3tP7uH/N1FocM0V3HMUK94h5EIYKpvc3FXcOuD9U9Iiqj1pt0r8V30QnzZxWc1Upi/bxaWqN9vR5fw/ycKz9XOeSrxs356EIL/44H1TKnD/OAWMrDrt0MHfu3DJr1qyqhKqyaY51ucOqpyq5PsvOPdVVx05juaZxl19U0u27Cqwx1Dzs0oHxzwyrPz9O2dOMQPMRyC+s5ocwO5AR6E8EOtNjlT4rGZriihvipKVdTClNs01r3a8kNrpXy7RW5DENNmUVB0yn3a+nwuW5cqKoxj/VTPsilpqyWpZHdcZUWQXEWKmamUJrthRXPcxC5ct02hiaiqtCarDUFKoh0Jg4N6zUqqLk+Ioe3kcM97NULaPz+1xeEElEHivTGnPnrfF3DluN07+1ne5bVE12rorD7oX0syy/Yzxtg0suERprFjX+HnnvGGmUUxgTZwAAHBFJREFUFbGtZOtyjRjrd4VLQLbNZ1NztcsUYqPt8XlxnmeG1Z8fp+xpRqD5COQXVvNDmB3ICPQnAp2poIY0TZimZ5rExBaRyn2Fqg/R+XHuuTMFNXXXxKhaoQLifkAVNBVJ91tp8PMwDo18UVVPcdIDO0y/Vdzcg6aRUmVHBdOjw0VLzYpiiPvsVHDcHyra2H7LyIhIqn6Oqf3ys0Ryy8IYQ+MvDjheYoVnAjqXVN80T3qQiqguIol1HrLgZ0UHpjjWqr2q2N7fNjtXfY7EK+eepmjniWimYuizI9r7HImcGmV9fjVC+2yKfi6ziH7ODdVt98P6HsfLvvj94/JOZlj9+XHKnmYEmo9AfmE1P4TZgYxAfyLQiVeRKmd1TVfyLalhSqzqJMq52q9hT0OmSoeKhjipEVT0EGE0aoo8qmkaC1XQvI9praZBkcH03r170f1tmwqafTc9VpEU4UVC+2jcVJpU32yD+KlKq9po/EVay6SI5JHqZNyce84rsVFVWvQzJl5bukcUdVxsm8Zd9+upaokn9l2sVjHUDCkKOcfcEyq2qwaK26q6jrv7+xxrEdu/dXlEs6smYauYWsLIMlOq1d7/+OOPLyeddFI1stov8dY2uAShmdllKLE6M6z+/DhlTzMCzUcgv7CaH8LsQEagPxHoTKFVmkx9xRMxR1xSZTCFU11SVYyOQfd1jXam5aKZZkvTVJUOsVHFRFVOjBUZVHa8j1gqQqrEReVTRGNVGJVEEVtktg2aJDVSin6qWqqijnWkCrnHTXOm5lvbJlaIk2KXZWqs2Om+ThVbUUITr+0RkSyL5HzzMBExREXS9ljWxrlt9UsNkD4L4pjYq0FUBHaeaKx1b50mWOee9zQOxk0Uddzti/EXRV0OcnxFXRFYxVDF03MGjbMmZPFWJdSyPJlh9efHKXuaEWg+AvmF1fwQZgcyAv2JQCcmqOCIJ6qBIs/EiRPL4sWLqyJgWqiyoOqh2UwjnMY5kU2VR0XDzxVn/FvTdZUv1UmVL6/FXtFGpcnUWoQxDqKxykh0bLqpstjoYRyW9xEfNOOJk7ZT06lmVN9vPMUWlSM/y7TfMfKevl+lz72lvkf0E5dEOVFC5NH8LJqpokZ7D0VsVSrvL9o4H1R4jZVo6XwW61yCcEw1TDpnREXVTJc1VE5FLRHemPtZPr8uy0SldfxO8LvCpQCNvqrAxkelVROvccsMqz8/TtnTjEDzEcgvrOaHMDuQEehPBLqoxITY5UESpnmm7mKd15YQETlVoDS8aXpU6TBd12BmKQzT4+hoddtmlUv7onpim0UJU3RLymy00UblkUceqZisAqg5U4Q0XfdzNRaqnLp/zTI79ss9eo6dxk6xRRVMPBE/NRWLRarJjrUIplLsZ4lFoqVmWvuuQdexE22cDyKn9xE3VA+de6KZ5ZWMj8sOIo9YLfJoWlbVdZ57f7HU+eA88Z4+I+7RcynA+zsW7ql0fMU9sdElHfHfZ9BnR/XW9/g9o7odqe2ZYfXnxyl7mhFoPgL5hdX8EGYHMgL9iUCnEdFU1rPeNPtp6NJgZtrpfUxTTUFVlDSmig+m8aobVklVFRIDVej8XMu/iG8elW5ZEs1yXosAmjO9FjM9K1A0EyeNW1TR1P1cGiM1QGrs1HTn+1VCjbljoTopLomf3lNl2bEzbsZEZBY5rbBqG4ytcRBLVUXtoyjknkH3u1mSxfdrMHZvY3Rep5hpbEXaqHKsqpzlYjR2WvlWtIwUbeOmminKiWaivfPQ+4h1lqlRAbTNXqtyuiwwcuTIsmLFirqcIgI7tzPD6s+PU/Y0I9B8BPILq/khzA5kBPoTgU5VxUqJKiCaSzVhihuWkTFlFSW8j0hlqixyathTSRRDxA3VE/dIqrZoLlVNU8Ww/abotlNjp1iqimrfRZvIcOiBC2KpcRNDxI3DDz+8nHnmmTWdVplyfDXg+boIIzKLeKKWCpFj5DKCSK4SLZJYwVLsUjVTabK/qmOqhI6pSqhzO9pj6BwQezVDil32S4RRVTTOUQka54MHsohdLt2IZj53LjXYXw2lxtlnXIXOPYkelqG66jx0vFQnfcZVfl0O0liu8q551fmcGVZ/fpyypxmB5iOQX1jND2F2ICPQnwh0Kikij6m1eBKdwWf1RdU3sUJEMo03RRfBTDVNm0U29waaUrpv0f1rooQlQVRJLCljWRtTdOOgoU7VQ+OiypTIIE6q+GjeE/f233//ctFFF1X0M27GXzS2DSqSqpam7sbH+SAKmcYbE8dItNfsqhobnfkoVqtEW9JEvPKzVLU0l4oz7kmM9rqqEqroqdyJqBqhxUDnv4Zh8VlcspyLn+Vz6nzT8GmbfdYcR2PrfVyysGSN+zGNoTG3L8bB+ayLwP223sfPElFdxskMqz8/TtnTjEDzEcgvrOaHMDuQEehPBLroqGjNWqblqmOqDKaC4onvUdHTJCmSiBh+lnvuVP1ULU0p/SwRz7RWNBMTli5dWsaNG1exSyVItNQsJ5rZL3EsOhBB46J/q6lP1LLvmjM1Pbpv0furIkWGScfO1N29fpp4VazESdHDMbIvxtDSJc4B+ytui0iqlsZEE2N0BLwIKW6r1jkHnEsuR7i/VeVUlc32iMMqgB5z731U91xOMSa2zfiIls5z26BCKuJZ6dS9tI67+GmbxWG/H0Rpn1MPRhFjVQwzw+rPj1P2NCPQfATyC6v5IcwOZAT6E4HOlFIciMpouHpvSmn6J3atWrWqDB8+vOKV6mFUWsT9ZZoMxSVLf1jGxH1wFsNXPVTdM8VVgVLVEg9HjBhRVq5cWfsS7ZUTb0UMlSDTew1+YriqiumxKbQxdB9ldHiH8TdFtw2qoo6pSChGOWfcgyaeq8a6F89xNO0XkXy/apE471l4KssqUJoPfY/tdA+m80ol1/1uIr9/K85rsNQwaWkgVV0PrbCPzn/nhvimUVZVWgx0rJ0zziuXOHwe3VPs/LfNqo1itRiryu/fOtYuC2hkzQyrPz9O2dOMQPMRyC+s5ocwO5AR6E8EOs1dKjgqC+4Ls1yMapHppWm2++NMEUUt079JkyaVK6+8smKXioNppGhgZUINe/6tqabpt6mmbfazRACNdqo5YpSIZN/dd6m65D4+2yNK2H7RzPao2oiEKjLe3/2JzgHbbMVRU33L9agCi8xikdfOH0vKqPRZXsY+2maxyGvbb9zcc2fMHWvxys9SwTSGtlMFUINoZEh2XFx+cZlF1I3OfFSZFWNVtJ2rzj2fEcfRZ98lIJd6VA9VCW2P6O33Q3Qmpu13/qseZobVnx+n7GlGoPkI5BdW80OYHcgI9CcCnWqaJj2VBZUC07PInGY5C9M/Taru8xIHNBm6HzAqKWP6qjlTZceUVWVH5UXMMS0X8Xy/io8oFCGGCouooinXdF0UVSU0tbadpuKilmcdGmc/1/ReBFNRVRUSebyPCKNx1Hklfhpzjayih9VEja33Fzk1iFoixn5Fh4Cocjq3HS/3dYpRIqFjZF8cCzFWZHO/p9gY7cUT/72/8XGu2kfntnPJpR7jr/KoIikmW2bH/aqqwH6f+P3g+51vGsgzw+rPj1P2NCPQfATyC6v5IcwOZAT6E4HOPVCmoKaRGinFOlNQVSpTZVf7VfEs66ECZeooHrqvzdIiHlmuAqiqYhvEH5XBqGSHKGrJF02e4qeVTq2oGZkGRW/jaZtVTsUci/mbZquiOi4aMk3pxTqVHRUiTZgip2Nteh8ZPlWHTfs1dqroiduqac5V55J4oilR5HQOi0KinOV0VNyWLVtWxowZU1Vs1XNVRfdyinuiVnTgiIq5n6XRVzU/KrskiqpiGxOXHZwzLgVEBuyFCxeWqVOn1ji4HOF9PCjEcdQw7LzVReCcTJWwPz9I2dOMwEBFIJFwoIYzO5MRGOwIdKbl4pUprnviTI9VhUQ2jXaijchjuiu+mWaLP6psVoCcPHlyueKKK2pq6l5CDw4QOaNz5TSgiskaNb2/11bR9D72URwz5iKMuCQ+u2fQmIgVfu7o0aPL8uXLa0xEOe/pmHofFVX3cjruItuTTz5Z1l133fpZ4rbj4nhpVlR1EiedM167t06FSwwR81VFjbNKnO8Rh6ODP5yH0SELIoxttpqoc8z9fWK48XHJwqUPnykVQ8fdz3KeeH+XF1RIjYlnC4qTorrPl6V1NNk6B2y/89z9v6kSDvaPUPYuIzCwEUgkHNihzY5lBAYvAp2mRNUuMcrSEKKBKGFaq+LjeyJDpmVPVHBUx2yn+8VssxUXTSlVkUSzaO+heCt6uA9OdUb8tHKjKonx8YxF+6XaInKarhsTlUoVVZUd0cAxVc0UA72n97GdfpZjGp1LaLVYzZ/ilaV+REsVYeehapqmTZcXLIMj5ohOkYFTbBdVxCLnm+qbBkiV5egsP82WYppqrEirgul4GR/vKUKKhD4XoqjLDl6LtKqfKs4uEfhsqpA6t32P2GscNJlnhjV4P0LZo4zAwEYgv7AGdmizYxmBwYtAp1FThU7DYXSYgqlaZDzT4OdeOe8vvomEoodpv8eXizam7prQVChEVBUlS46IEip37olzn6Pvca+Z+GxKrCJmSQ1xNTq4QVOf97dtxkdMiI6Vd4xMxcU38UE0FuedJ46vKCQiic+iigdqiN6itAjmvjnbIz6LvbbHsdDcqGF4/Pjx5dprr61KqKZHD/Uw5qpjqo2iopjs2YL2RYR3/6N9cYxUb72n5l6VX+ebz7IqqpimMuizI+LZR+eV4+Lrfv/4WV6LpZlhDd6PUPYoIzCwEcgvrIEd2uxYRmDwItCpDphyW1bC92jiEmfcu6TZTGzxUANf12zmvqfojD/VK1NNlTjvGaXcooEoah9VCS1fI2qJY6boHr7gYRwadMUoDXiaUVXfTI/FXlUk8dN9bRodTctFPM3AIk90IIKqkH00Jip6oo3tVHFzbhgf1VsrebrX1TEVVRzHqJSNGOjnikjO86idtkd1VQT2+XLPqaqlY6HSp4rqfLD9Lr/4nKpcu1/Pg1FUVEV142CZIJdQfGZ9RlQD3Vcr9qrMeiiMym9mWIP3I5Q9yggMbATyC2tghzY7lhEYvAh0qmwqGu7xUWWLDpIwhRYhVUNMj1UuVFVEKrFOlPA+KiZem+Lafs2imipVx6yYKqq4R0xDo6+LDBrqbLN9MY23cqb4LL5p1DSlFzdMuVV+RTbVIg2cql0qNY6F+wTtu3sGPcBCNcoqo6py/q1zSdR1Xtl34+Yc9ixI4yzeuqTgXI0QWwVTzBHbnc+WD1JlU9HW5On5hiqYUaVZFUyVa82xGpJtg3tdPSRFJHSe2J6DDz64nHfeeVU5FRudJ467n2vMxUCNspqlXerJDGvwfoSyRxmBgY1AfmEN7NBmxzICgxeBTozSxGXKbcqqimEKKuKZjnoogGmwuGGarRKk0uFhEypBKoBixe2331622267mrJqOjUNFoVUNEyJfV1zrKhoSuwR5OKPsTrnnHPKoYceWtsmPpiWayAUz22Peyo13zpGKju2zRiKG7ZNNUo0cM6oqLqvzTF13DVeqv6oDouu4oDXjpEIH50nqAFVk6TjKOqKcsbTvovb0fmPzj2XO9xvK3467o61qqI45lKDcdAkrOKsoVfEdm6LzMZEBLZtPuMqks4B2yOiGmex2nnld0VmWIP3I5Q9yggMbATyC2tghzY7lhEYvAh0ruqrmokYGgt9j/u5olIbpu4qNSKGyKBCpBJn5U+VONtv6quZzfar3JnWiksaPjXmmUL7WZoSbY+pfimlTJs2ba3DC7yn6b3vj4yjlviwzabiqnginvsffY+HAmiA9J6OkSVHVFrdeyjKifYqRC5HaHB1rK2cKUqLGy5laBwVV+2vaOaZfSqYmm+jgzY0QLocIcqpXGuwtI/GMFLiNH8aT7FUfItKSNkGsddn3zEyPo6RKKqLQGR2n6OGWPfwWqnY9jiXMsMavB+h7FFGYGAjkF9YAzu02bGMwOBFoHM/l/hmmq0CKPKIVCqDKh2imUqZSpApsaqBexLFH81yql2inwZI98SJDKa7KmWiq20QJcQTU98ohsbHlF6lzJReZdDPFcl9j4htfDxkwT2Ypu6qjWKUKqp9dC+kCrLtdHw1cNpmkUc1SgOheOX+RJFHk62Kkqqx7Y9MzqKTyOxygWMkZhorsU7zpHt1nW+afn0eVeuch85bjd/GU+OlarvliUR122zM3cPoWYS2X9XVOeaeTfvuM+iyks+ObdZMmxnW4P0IZY8yAgMbgfzCGtihzY5lBAYvAp37zqzQqIlRY5iVBsUTVTNLQ7jCbzkOUUUkFAdUjkyPLcIvwoiTtl8k0UBoXzTOmaZa+kPsMrX2c0VplQ5jaIoruloyRQVHxcr4qJSpSKqERqm4qCIeaoxUHbP0jRiu0dR9juJVpCoODQ2VoaGhqpyKcpbx0YgYqYrOJZVN54lHvYuWfq547rxyPtgG1Vv3IWp+Vpn1PSKnr6tKe+CFr4vDGm6d574nQnjxzTmj4u+yj6Zcl1nso5hp3LyPSCjqaih17FRmM8MavB+h7FFGYGAjkF9YAzu02bGMwOBFoLPUiem06OEeKNUEy7b4/qgUiXvrREVNd6Z/qjBWODR1tz2iikiiOimyiQOmqWKyexXFOj9LI5yprCm0Coj9EgPFVRHGNrs3zfvbF98vTqpwiQAiknFQ+TLtt3SMKpLjK2KLNu4Rc4nAQzc0W2qIdelA9HAueX/nZ6S0imMitrGy/c4rDZaanEUw8coxEi1FaauzOh+iAya8z7333lu23HLLitg+FyqkopxquMsjKvsim98D/q2xcn7aL0sAuZ/Rfrns4HKEimRmWIP3I5Q9yggMbATyC2tghzY7lhEYvAh0HiLgQQyaPzWkqVaoArgHTaXJPWgRLpnyeR2pgaohpuJiiMqUxjz3PYl4IoZptiqVWCRuqK6K2MYtOqPNNluVUawTmcUEzatirIqqRkT3/YkzopzYpclTJVEF05jYF8fRe6roiRgioeqw6rMxFLFFQuMgkjiXVH4dd2N75JFHlvnz51e80jgtzotLxsdlBJdKVBVVkH0GHS/x1j2Ptl80c06qVGqoNg6amZ3DPi+Ohcs1quQ+a5Ep1P4aBw3hEVqqdGeGNXg/QtmjjMDARiC/sAZ2aLNjGYHBi0AnJljmxZTPtNN9cJGSZUrsoQ9io4qAyojKkWqFCosYYntUOU2nxdho755oICqKOSpitsf9dKKE6owYZRpsSQ1NmGKUe9ncY2WJD9NyUUgDodVH/SwRXkVVZdaDA8Q3x8j3i3uW3/FaldMyI7Z5//33LxdddNFa1VlVEt0z6LhrpnXsjI/z075orI3KELl0IIKJiiKwMdTwqZKoqutyimZjFT1RS8TTvC1Wu1zgsoBGVvcSOqbe07EzhqKxc9X9qs55x8sxsi/O88ywBu9HKHuUERjYCOQX1sAObXYsIzB4EehUWKx+aYpr+QjVQw2TppHipMqLabapsvv+xAEVPa9ViMQTcU+Dn5ipUTBSbTRSqhCp3Jmuq8KYQkeVPE3FRU4rOpq6i8CaEsUBkdCY+LcqXFEJHbHl0UcfLRtuuGHFMVUksU6Usw2WFtEEGO3X82+dP+KGJlJxWwwR39z76bXKr3NATDb+4qdKmXPJ+SyCadD1GTG2KqrOJeeY93SJw9I64rNqo4ekOLdFZuekOK952Li5JOLyjvFxqcT5YJVU0U813GfB1zPDGrwfoexRRmBgI5BfWAM7tNmxjMDgRaBTHRPZfN201r1IpoKavjTLmdKrzogVpqOmiFZT1KQqVmiW02CmkiIWmQarzlhNUSyNjuq2X+4HdD+aWKoCa2y9v+jt/cUTMVNsN4a+bipuORfPB9Ts57Xt1JBpii56mMY7dqNHjy7Lly+vaCnmGJ+oqqfzRLQUCVVmnQMud7jPzj5GJtKZM2eWefPm1Tar8IqHGm7FbZdNVMRUwx1TVVpLNll6yDa4jOB8tsyRaO98MD4+U46Rf6uy73NkO1XnxXPb5ntEb42sLgU4n30WMsMavB+h7FFGYGAjkF9YAzu02bGMwOBFoHP/WlSSQjObpSFMC0Ub00LTS9UQU00NZipfKhTuGYzOLBNDVBVVXmy/qodlMXy/ak50VPqyZcvKmDFjKj6Y6vu6CqPI6eELtlkcEGdEXd8TqTzGzbIwxtD3aCR2T5mKmAZL54aVQsUNlVORyj2hKl8uL2igFd80DKt8ibrOMZHcMVLlFBVFVM8TVFX0oA3njG12mcW2+YyIRY6Rr9t+MVlVVCVXdV5VzjnvEoHfA75uG8R5TZ6iqHPez3UOG0NxT8O5eJh7CQfvhyd7lBHoRQQSCXsxzNnJjMBgRKBTRTIVFw+jSpgaMk31VY40Xvp+VRXVFlUwsUJTnMZRS+KoYqg2qrCIrqajHjrgPi+xyPdrArQipQhgCi3yiIfG2TRY5dEUWuVL426011Is8j3eX8VNJVf1yjiLru6bM25immNtuRIx0/t7LaZ5SIFYJMIYH/FfM22kVBoH54Ox8nNVmcVA1U9x0vh47fMi4vm3GjKjyreqpWKac9X7iKiaS22br4v2Ko/GxEq8PoN+t3j4hUsQfj/4neCe5cywBuOHJ3uREehFBPILqxfDnJ3MCAxGBDrLVrhfSTXBVFmE8f0qdNEhBVZNNP2z9ER0mIIpt5U8Vc3cHydKiL1il2hminv55ZeXvfbaq6p+vsdUX1OcJkNjFVXIVG0UNyxXIhpHZUZUymy/e8FUjkRmFVvHQgOtfVelEv9FPDFK87AlRJwzYprLDppUNUnOmTOnzJ49u46L91fJEjPFf/FKRVhjpzHR5Ckae+1Sg32JqsUefvjh5cwzz6zt93NVGKPKsRovNWyLb+K8Sq4xtA1iozG0XI9zTLRXZdYs7VKA3wmWVPKzvKeI6neCsc0MazB+eLIXGYFeRCC/sHoxzNnJjMBgRKBzX5hps+qYaGNqKpqZ5kVGPtNpFS7NpaaIYpcmNLFLhBSLSill2rRpNf0WDby/VRNNp0VLMcdSHpEa5cEQkeqkAqJBUbVI9PbaNqvaiGaWatGgKJJbSkgVyb8VA50DHrQhQrrXz/G1DZo2Lcliv9xTaR9FFcfdMbUEjXPG/WsaFFUkNcGKXR7GEe1LtUSShmrb6R7YaKx9BlXZNLhGiOo4up9R5PeZFWk1wYrwfpZo6fNlX1SlrV7r8+JYu6TjWHhPDdKZYQ3GD0/2IiPQiwjkF1Yvhjk7mREYjAh0YpQGRVNilSZLiGgSc3+cRq+oOqhpvOmiyoUpvcqjRjUL46tEqHJqIBTHTIlFYLFFtcj7iw+2TYRRSYlMqhbYF9NEKtNjU31xzDjYr4ceeqhssskmFY3dm6ny6PtF+8hYaCkSz9QT8fxc55htiKp6ik7ip7iqEieKOoctPSRWG3OxXRxTzdT8PH78+HLttdfWeIqHIptLHGKOKOTR7fZxypQpZdGiRfX+0bOpgdbnxXkowmvudc+pqrTquShnfNwrKsppilbRc5lFBVYl1H2svu5SjHHLDGswfniyFxmBXkQgv7B6MczZyYzAYETg/wCTEPBC40ccWAAAAABJRU5ErkJggg==&quot;) center center repeat rgb(0, 0, 0);"'
            break;
        case "Very Light Bluish Gray":
            css += "style='background-color:#747472;color:#FFF'"
            break;
        case "Trans-Green":
            css += "style='background-color:#188d33;color:#FFF'"
            break;
        case "Metallic Silver":
            css += 'style=\'color:#000;background: rgb(60,71,73);\n' +
                'background: -moz-linear-gradient(90deg, rgba(60,71,73,1) 0%, rgba(143,148,144,1) 35%, rgba(235,251,241,1) 100%);\n' +
                'background: -webkit-linear-gradient(90deg, rgba(60,71,73,1) 0%, rgba(143,148,144,1) 35%, rgba(235,251,241,1) 100%);\n' +
                'background: linear-gradient(90deg, rgba(60,71,73,1) 0%, rgba(143,148,144,1) 35%, rgba(235,251,241,1) 100%);\n' +
                'filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#3c4749",endColorstr="#ebfbf1",GradientType=1);\'';
            break;
    }
    css += ">" + color_name + "</span>";
    return css;
}

function getColorSelect(id){
    return colorOption = "\n" +
        "                        <select class=\"custom-select inputColour\" id=\"C"+id+"\">\n" +
        "                          <option value=\"-999\" selected=''>Choose a colour to change</option>\n" +
        "                          <option data-tab=\"All\" value=\"0\" data-name=\"(Not Applicable)\" data-rgb=\"transparent\" style=\"background-color: transparent\">\n" +
        "                            (Not Applicable)</option>\n" +
        "                          <option data-tab=\"All\" value=\"11\" data-name=\"Black\" data-rgb=\"#212121\" style=\"background-color: #212121;color:#FFF !important\">\n" +
        "                            Black</option>\n" +
        "                          <option data-tab=\"All\" value=\"7\" data-name=\"Blue\" data-rgb=\"#0057A6\" style=\"background-color: #0057A6;color:#FFF !important\">\n" +
        "                            Blue</option>\n" +
        "                          <option data-tab=\"All\" value=\"36\" data-name=\"Bright Green\" data-rgb=\"#10CB31\" style=\"background-color: #10CB31;color:#000 !important\">\n" +
        "                            Bright Green</option>\n" +
        "                          <option data-tab=\"All\" value=\"105\" data-name=\"Bright Light Blue\" data-rgb=\"#9FC3E9\" style=\"background-color: #9FC3E9;color:#000 !important\">\n" +
        "                            Bright Light Blue</option>\n" +
        "                          <option data-tab=\"All\" value=\"110\" data-name=\"Bright Light Orange\" data-rgb=\"#F7BA30\" style=\"background-color: #F7BA30;color:#000 !important\">\n" +
        "                            Bright Light Orange</option>\n" +
        "                          <option data-tab=\"All\" value=\"103\" data-name=\"Bright Light Yellow\" data-rgb=\"#F3E055\" style=\"background-color: #F3E055;color:#000 !important\">\n" +
        "                            Bright Light Yellow</option>\n" +
        "                          <option data-tab=\"All\" value=\"104\" data-name=\"Bright Pink\" data-rgb=\"#FFBBFF\" style=\"background-color: #FFBBFF;color:#000 !important\">\n" +
        "                            Bright Pink</option>\n" +
        "                          <option data-tab=\"All\" value=\"8\" data-name=\"Brown\" data-rgb=\"#532115\" style=\"background-color: #532115;color:#FFF !important\">\n" +
        "                            Brown</option>\n" +
        "                          <option data-tab=\"All\" value=\"153\" data-name=\"Dark Azure\" data-rgb=\"#3399FF\" style=\"background-color: #3399FF;color:#FFF !important\">\n" +
        "                            Dark Azure</option>\n" +
        "                          <option data-tab=\"All\" value=\"63\" data-name=\"Dark Blue\" data-rgb=\"#143044\" style=\"background-color: #143044;color:#FFF !important\">\n" +
        "                            Dark Blue</option>\n" +
        "                          <option data-tab=\"All\" value=\"85\" data-name=\"Dark Bluish Gray\" data-rgb=\"#595D60\" style=\"background-color: #595D60;color:#FFF !important\">\n" +
        "                            Dark Bluish Gray</option>\n" +
        "                          <option data-tab=\"All\" value=\"10\" data-name=\"Dark Gray\" data-rgb=\"#6B5A5A\" style=\"background-color: #6B5A5A;color:#FFF !important\">\n" +
        "                            Dark Gray</option>\n" +
        "                          <option data-tab=\"All\" value=\"80\" data-name=\"Dark Green\" data-rgb=\"#2E5543\" style=\"background-color: #2E5543;color:#FFF !important\">\n" +
        "                            Dark Green</option>\n" +
        "                          <option data-tab=\"All\" value=\"68\" data-name=\"Dark Orange\" data-rgb=\"#B35408\" style=\"background-color: #B35408;color:#FFF !important\">\n" +
        "                            Dark Orange</option>\n" +
        "                          <option data-tab=\"All\" value=\"47\" data-name=\"Dark Pink\" data-rgb=\"#C87080\" style=\"background-color: #C87080;color:#FFF !important\">\n" +
        "                            Dark Pink</option>\n" +
        "                          <option data-tab=\"All\" value=\"89\" data-name=\"Dark Purple\" data-rgb=\"#5F2683\" style=\"background-color: #5F2683;color:#FFF !important\">\n" +
        "                            Dark Purple</option>\n" +
        "                          <option data-tab=\"All\" value=\"59\" data-name=\"Dark Red\" data-rgb=\"#6A0E15\" style=\"background-color: #6A0E15;color:#FFF !important\">\n" +
        "                            Dark Red</option>\n" +
        "                          <option data-tab=\"All\" value=\"69\" data-name=\"Dark Tan\" data-rgb=\"#907450\" style=\"background-color: #907450;color:#FFF !important\">\n" +
        "                            Dark Tan</option>\n" +
        "                          <option data-tab=\"All\" value=\"39\" data-name=\"Dark Turquoise\" data-rgb=\"#008A80\" style=\"background-color: #008A80;color:#FFF !important\">\n" +
        "                            Dark Turquoise</option>\n" +
        "                          <option data-tab=\"All\" value=\"6\" data-name=\"Green\" data-rgb=\"#00642E\" style=\"background-color: #00642E;color:#FFF !important\">\n" +
        "                            Green</option>\n" +
        "                          <option data-tab=\"All\" value=\"154\" data-name=\"Lavender\" data-rgb=\"#B18CBF\" style=\"background-color: #B18CBF;color:#FFF !important\">\n" +
        "                            Lavender</option>\n" +
        "                          <option data-tab=\"All\" value=\"152\" data-name=\"Light Aqua\" data-rgb=\"#CCFFFF\" style=\"background-color: #CCFFFF;color:#000 !important\">\n" +
        "                            Light Aqua</option>\n" +
        "                          <option data-tab=\"All\" value=\"62\" data-name=\"Light Blue\" data-rgb=\"#B4D2E3\" style=\"background-color: #B4D2E3;color:#000 !important\">\n" +
        "                            Light Blue</option>\n" +
        "                          <option data-tab=\"All\" value=\"86\" data-name=\"Light Bluish Gray\" data-rgb=\"#AFB5C7\" style=\"background-color: #AFB5C7;color:#000 !important\">\n" +
        "                            Light Bluish Gray</option>\n" +
        "                          <option data-tab=\"All\" value=\"9\" data-name=\"Light Gray\" data-rgb=\"#9C9C9C\" style=\"background-color: #9C9C9C;color:#000 !important\">\n" +
        "                            Light Gray</option>\n" +
        "                          <option data-tab=\"All\" value=\"35\" data-name=\"Light Lime\" data-rgb=\"#EBEE8F\" style=\"background-color: #EBEE8F;color:#000 !important\">\n" +
        "                            Light Lime</option>\n" +
        "                          <option data-tab=\"All\" value=\"90\" data-name=\"Light Nougat\" data-rgb=\"#FECCB0\" style=\"background-color: #FECCB0;color:#000 !important\">\n" +
        "                            Light Nougat</option>\n" +
        "                          <option data-tab=\"All\" value=\"56\" data-name=\"Light Pink\" data-rgb=\"#FFE1FF\" style=\"background-color: #FFE1FF;color:#000 !important\">\n" +
        "                            Light Pink</option>\n" +
        "                          <option data-tab=\"All\" value=\"93\" data-name=\"Light Purple\" data-rgb=\"#DA70D6\" style=\"background-color: #DA70D6;color:#000 !important\">\n" +
        "                            Light Purple</option>\n" +
        "                          <option data-tab=\"All\" value=\"33\" data-name=\"Light Yellow\" data-rgb=\"#FFE383\" style=\"background-color: #FFE383;color:#000 !important\">\n" +
        "                            Light Yellow</option>\n" +
        "                          <option data-tab=\"All\" value=\"34\" data-name=\"Lime\" data-rgb=\"#A6CA55\" style=\"background-color: #A6CA55;color:#000 !important\">\n" +
        "                            Lime</option>\n" +
        "                          <option data-tab=\"All\" value=\"72\" data-name=\"Maersk Blue\" data-rgb=\"#6BADD6\" style=\"background-color: #6BADD6;color:#000 !important\">\n" +
        "                            Maersk Blue</option>\n" +
        "                          <option data-tab=\"All\" value=\"71\" data-name=\"Magenta\" data-rgb=\"#B52952\" style=\"background-color: #B52952;color:#FFF !important\">\n" +
        "                            Magenta</option>\n" +
        "                          <option data-tab=\"All\" value=\"156\" data-name=\"Medium Azure\" data-rgb=\"#42C0FB\" style=\"background-color: #42C0FB;color:#000 !important\">\n" +
        "                            Medium Azure</option>\n" +
        "                          <option data-tab=\"All\" value=\"42\" data-name=\"Medium Blue\" data-rgb=\"#61AFFF\" style=\"background-color: #61AFFF;color:#000 !important\">\n" +
        "                            Medium Blue</option>\n" +
        "                          <option data-tab=\"All\" value=\"157\" data-name=\"Medium Lavender\" data-rgb=\"#885E9E\" style=\"background-color: #885E9E;color:#FFF !important\">\n" +
        "                            Medium Lavender</option>\n" +
        "                          <option data-tab=\"All\" value=\"76\" data-name=\"Medium Lime\" data-rgb=\"#BDC618\" style=\"background-color: #BDC618;color:#000 !important\">\n" +
        "                            Medium Lime</option>\n" +
        "                          <option data-tab=\"All\" value=\"150\" data-name=\"Medium Nougat\" data-rgb=\"#E3A05B\" style=\"background-color: #E3A05B;color:#000 !important\">\n" +
        "                            Medium Nougat</option>\n" +
        "                          <option data-tab=\"All\" value=\"31\" data-name=\"Medium Orange\" data-rgb=\"#FFA531\" style=\"background-color: #FFA531;color:#000 !important\">\n" +
        "                            Medium Orange</option>\n" +
        "                          <option data-tab=\"All\" value=\"73\" data-name=\"Medium Violet\" data-rgb=\"#9391E4\" style=\"background-color: #9391E4;color:#000 !important\">\n" +
        "                            Medium Violet</option>\n" +
        "                          <option data-tab=\"All\" value=\"28\" data-name=\"Nougat\" data-rgb=\"#FFAF7D\" style=\"background-color: #FFAF7D;color:#000 !important\">\n" +
        "                            Nougat</option>\n" +
        "                          <option data-tab=\"All\" value=\"155\" data-name=\"Olive Green\" data-rgb=\"#7C9051\" style=\"background-color: #7C9051;color:#FFF !important\">\n" +
        "                            Olive Green</option>\n" +
        "                          <option data-tab=\"All\" value=\"4\" data-name=\"Orange\" data-rgb=\"#FF7E14\" style=\"background-color: #FF7E14;color:#FFF !important\">\n" +
        "                            Orange</option>\n" +
        "                          <option data-tab=\"All\" value=\"23\" data-name=\"Pink\" data-rgb=\"#FFC0CB\" style=\"background-color: #FFC0CB;color:#000 !important\">\n" +
        "                            Pink</option>\n" +
        "                          <option data-tab=\"All\" value=\"24\" data-name=\"Purple\" data-rgb=\"#A5499C\" style=\"background-color: #A5499C;color:#FFF !important\">\n" +
        "                            Purple</option>\n" +
        "                          <option data-tab=\"All\" value=\"5\" data-name=\"Red\" data-rgb=\"#B30006\" style=\"background-color: #B30006;color:#FFF !important\">\n" +
        "                            Red</option>\n" +
        "                          <option data-tab=\"All\" value=\"88\" data-name=\"Reddish Brown\" data-rgb=\"#89351D\" style=\"background-color: #89351D;color:#FFF !important\">\n" +
        "                            Reddish Brown</option>\n" +
        "                          <option data-tab=\"All\" value=\"55\" data-name=\"Sand Blue\" data-rgb=\"#5A7184\" style=\"background-color: #5A7184;color:#FFF !important\">\n" +
        "                            Sand Blue</option>\n" +
        "                          <option data-tab=\"All\" value=\"48\" data-name=\"Sand Green\" data-rgb=\"#76A290\" style=\"background-color: #76A290;color:#FFF !important\">\n" +
        "                            Sand Green</option>\n" +
        "                          <option data-tab=\"All\" value=\"58\" data-name=\"Sand Red\" data-rgb=\"#8C6B6B\" style=\"background-color: #8C6B6B;color:#FFF !important\">\n" +
        "                            Sand Red</option>\n" +
        "                          <option data-tab=\"All\" value=\"2\" data-name=\"Tan\" data-rgb=\"#DEC69C\" style=\"background-color: #DEC69C;color:#000 !important\">\n" +
        "                            Tan</option>\n" +
        "                          <option data-tab=\"All\" value=\"96\" data-name=\"Very Light Orange\" data-rgb=\"#E6C05D\" style=\"background-color: #E6C05D;color:#000 !important\">\n" +
        "                            Very Light Orange</option>\n" +
        "                          <option data-tab=\"All\" value=\"1\" data-name=\"White\" data-rgb=\"#FFFFFF\" style=\"background-color: #FFFFFF;color:#000 !important\">\n" +
        "                            White</option>\n" +
        "                          <option data-tab=\"All\" value=\"3\" data-name=\"Yellow\" data-rgb=\"#F7D117\" style=\"background-color: #F7D117;color:#000 !important\">\n" +
        "                            Yellow</option>\n" +
        "                          <option data-tab=\"All\" value=\"158\" data-name=\"Yellowish Green\" data-rgb=\"#DFEEA5\" style=\"background-color: #DFEEA5;color:#000 !important\">\n" +
        "                            Yellowish Green</option>\n" +
        "                          <option data-tab=\"All\" value=\"12\" data-name=\"Trans-Clear\" data-rgb=\"#EEEEEE\" style=\"background-color: #EEEEEE;color:#000 !important\">\n" +
        "                            Trans-Clear</option>\n" +
        "                          <option data-tab=\"All\" value=\"14\" data-name=\"Trans-Dark Blue\" data-rgb=\"#00296B\" style=\"background-color: #00296B;color:#FFF !important\">\n" +
        "                            Trans-Dark Blue</option>\n" +
        "                          <option data-tab=\"All\" value=\"15\" data-name=\"Trans-Light Blue\" data-rgb=\"#68BCC5\" style=\"background-color: #68BCC5;color:#000 !important\">\n" +
        "                            Trans-Light Blue</option>\n" +
        "                          <option data-tab=\"All\" value=\"164\" data-name=\"Trans-Light Orange\" data-rgb=\"#E99A3A\" style=\"background-color: #E99A3A;color:#000 !important\">\n" +
        "                            Trans-Light Orange</option>\n" +
        "                          <option data-tab=\"All\" value=\"16\" data-name=\"Trans-Neon Green\" data-rgb=\"#C0F500\" style=\"background-color: #C0F500;color:#000 !important\">\n" +
        "                            Trans-Neon Green</option>\n" +
        "                          <option data-tab=\"All\" value=\"18\" data-name=\"Trans-Neon Orange\" data-rgb=\"#FF4231\" style=\"background-color: #FF4231;color:#FFF !important\">\n" +
        "                            Trans-Neon Orange</option>\n" +
        "                          <option data-tab=\"All\" value=\"98\" data-name=\"Trans-Orange\" data-rgb=\"#D04010\" style=\"background-color: #D04010;color:#FFF !important\">\n" +
        "                            Trans-Orange</option>\n" +
        "                          <option data-tab=\"All\" value=\"17\" data-name=\"Trans-Red\" data-rgb=\"#9C0010\" style=\"background-color: #9C0010;color:#FFF !important\">\n" +
        "                            Trans-Red</option>\n" +
        "                          <option data-tab=\"All\" value=\"19\" data-name=\"Trans-Yellow\" data-rgb=\"#EBF72D\" style=\"background-color: #EBF72D;color:#000 !important\">\n" +
        "                            Trans-Yellow</option>\n" +
        "                          <option data-tab=\"All\" value=\"21\" data-name=\"Chrome Gold\" data-rgb=\"#F1F2E1\" style=\"background-color: #F1F2E1;color:#000 !important\">\n" +
        "                            Chrome Gold</option>\n" +
        "                          <option data-tab=\"All\" value=\"22\" data-name=\"Chrome Silver\" data-rgb=\"#DCDCDC\" style=\"background-color: #DCDCDC;color:#000 !important\">\n" +
        "                            Chrome Silver</option>\n" +
        "                          <option data-tab=\"All\" value=\"66\" data-name=\"Pearl Light Gray\" data-rgb=\"#ACB7C0\" style=\"background-color: #ACB7C0;color:#000 !important\">\n" +
        "                            Pearl Light Gray</option>\n" +
        "                          <option data-tab=\"All\" value=\"65\" data-name=\"Metallic Gold\" data-rgb=\"#B8860B\" style=\"background-color: #B8860B;color:#FFF !important\">\n" +
        "                            Metallic Gold</option>\n" +
        "                          <option data-tab=\"All\" value=\"60\" data-name=\"Milky White\" data-rgb=\"#D4D3DD\" style=\"background-color: #D4D3DD;color:#000 !important\">\n" +
        "                            Milky White</option>\n" +
        "                        </select> ";
}
let tagCount = 0;
$(document).ready(function () {
    window.tags = [];
    sortableTableId = "mainTable";
    addSortIcons();
    //const tags = $('#my-tag-list').tags();
    document.querySelectorAll("#mainTable th.sortable").forEach(function (item){
        item.addEventListener("click",sortTable)
    })
    $("#3").click();
    document.querySelectorAll('input.checkbox-scale').forEach(function (item) {
        item.addEventListener('click',makeCheckboxRequest)
    });
    document.querySelectorAll(".bl_img").forEach(function (item){
        item.addEventListener("click",show_modal)
    })
    if(detectBrowser()==="Firefox"){
        $("#dynamicTable").append("<tr style='height:150px'></tr>");
    }

    //show filter modal 
    $("#filterBtn").on('click',function(e){
        $("#filterModal").modal("show");
    })
    
    //filter: checked items
    $("#filterCheckboxes").on("click",function(e){
        const isChecked = $("#filterCheckboxes").prop("checked");
        if(isChecked){
            $("#dynamicTable tr").each(function(){
                if($(this).hasClass("row_checked")){
                    $(this).addClass('hide-filter-checked');
                }
            });
            $("#filterCheckboxesAutoHide").prop("disabled", false);
        }else{
            $("#dynamicTable tr").each(function(){
                if($(this).hasClass("row_checked")){
                    $(this).removeClass('hide-filter-checked');
                }
            });
            
            $("#filterCheckboxesAutoHide").prop("disabled", true);
        }
    });

    // Detect changes on new or used radio buttons
    $("#filterNuRadios input").on('change',function(){
        const val = $("#filterNUradios input:checked").val();
        $(".new_or_used-big").each(function(){
            if(val==="All"){
                $($(this).parents()[2]).removeClass("hide-filter-nu");
            }else{
                if(!$(this).text().includes(val)){
                    $($(this).parents()[2]).addClass("hide-filter-nu");
                }else{
                    $($(this).parents()[2]).removeClass("hide-filter-nu");
                }
            }
        });
    });

    // Tag debugging log
    // setInterval(function() {
    //     console.log(JSON.stringify(tags));
    //   }, 3000);

    // Filter: tag input handler
    $("#filterRemarksInput").on('keyup', function (e) {
            if (e.key === 'Enter') {
                createNewTagFromInput();
            }
        });
    $("#filterRemarksBtn").on('click',function(e){
        createNewTagFromInput();
    })

    // Filter: Remove tag handler
    $(".tag-list").on('click',".remove-tag",function(e){
        //1. remove tag in the tags variable
        tags.forEach(function(tag, index){
            if($(this).hasClass("tagID-"+tag.id)){
                tags.splice(index,1);
            }
        });
        //2. render all tags again
        renderAllTagsAgain();
    });

    //Filter: Turn tags on or off
    $("#tag-control").on('click','.control-tag',function(){
        //1. change class
        const _tag = $(this);
        if($(this).hasClass('on')){
            $(this).removeClass('on').addClass('off');
        }else{
            $(this).removeClass('off').addClass('on');
        }
        //2. update tags variable
        tags.forEach(function(tag,index){
            if($(_tag).hasClass('tagID-'+tag.id)){
                tags[index].status = (tag.status==='off')?"on":"off";
            }
        })
    });
});

function filterListOnTags (){
    // iterate all tags over all remarks
    //if there are no tags, show all
    if(tags.length===0){
        $("#dynamicTable tr").removeClass("hide-filter-tag");
    }else{
        tags.forEach(function(tag,index){
            console.log(`running tag ${tag}`);
            $(".remarks").each(function(){
                //1. check if is not already used by a filter
                if(index===0 || $($(this).parents()[3]).hasClass("hide-filter-tag")){
                    //2. check if this remarks should be hidden by this tag
                    if(!$(this).html().includes(tag)){
                        $($(this).parents()[3]).addClass("hide-filter-tag");
                    }else{
                        $($(this).parents()[3]).removeClass("hide-filter-tag");
                    }
                }
            });
        });
    }
}

function createNewTagFromInput(){
    //1. create tag
    const text = $("#filterRemarksInput").val();
    //2. check for tag already existing
    let isDuplicate = false;
    tags.forEach(function(tag){
        if(text===tag){
            isDuplicate = true;
        }
    });
    //3. check for xss
    if(isDuplicate || text.includes('<script>')|| text.trim()===""){
        $("#filterRemarksInput").addClass("is-invalid");
        return;
    }else{
        $("#filterRemarksInput").removeClass("is-invalid");
    }
    tags.push({text:text,id:tagCount,status:'off'});
    tagCount++;
    renderAllTagsAgain(); //will render all tags that are in the tags variable
    //5. remove input value
    $("#filterRemarksInput").val("");
}

function renderAllTagsAgain(){
    //clears all tags and starts rendering them again.

    //1. clear control area and list area
    $("#tag-list").empty();
    $("#tag-control").empty();

    //2. iterate over all tags
    tags.forEach(function(tag){
        //3. Add the tag to list area
        const taglistHTML = `<span class="tagID-${tag.id} tag badge badge-pill badge-info">
                                ${tag.text}
                                <a href="#" class="remove-tag">
                                    <i class="far fa-times-circle"></i>
                                </a>
                            </span>`;
        $("#tag-list").append(taglistHTML);
        //4. Add the tag to the control area
        const tagControlHTML = `<span class="tagID-${tag.id} control-tag tag badge badge-pill ${tag.status}">
                                    ${tag.text}
                                    <a href="#" class="remove-control-tag remove-tag">
                                        <i class="far fa-times-circle"></i>
                                    </a>
                                </span>`;
        $("#tag-control").append(tagControlHTML);
    })
}


function makeCheckboxRequest (e) {
    let id = e.target.id.substr(1);
    $.ajax({
        method: "PUT",
        url: window.location.pathname,
        data: {
            inventory_id:id
        },
        beforeSend: startLoading,
        error:function(error){
            console.log(error.message);
            if (window.alert("Checkbox gave an error. please reload.")) {
                location.reload();
            }
        },
        fail:function(error){
            console.log(error.message);
            if(window.alert("Checkbox failed. please reload.")){
                location.reload();
            }
        }
    }).done(function (data) {
        const progress = render_progress(data.order);
        $('.progress-bar').css("background-color",progress.progressBar.backgroundColor)
        $('.progress-bar').css('width',progress.progressBar.width+"%");
        $('.progress-numbers').css('color',progress.progressNumbers.style);
        data.order.items.forEach(function(batch){
            batch.forEach(function(item){
                if(item.isChecked){
                    $("#row"+item.inventory_id).addClass('row_checked');
                    if(!$("#filterCheckboxesAutoHide").prop("disabled") && $("#filterCheckboxesAutoHide").prop("checked")){
                        $("#row"+item.inventory_id).addClass('hide-filter-checked');
                    }
                    $("#C"+item.inventory_id).parent().parent().attr('data-order',2);
                }else{
                    $("#row"+item.inventory_id).removeClass('row_checked');
                    $("#C"+item.inventory_id).parent().parent().attr('data-order',1);
                }
            })
        })
        $('.progress-numbers').text(data.order.orders_checked+"/"+data.order.unique_count);
        stopLoading();
    });
}

function show_modal(e){
    let src;
    try{
     src = $("#"+e.target.id).attr('src');
    }catch(e){};
    frontend.order.items.forEach(function(batch){
        batch.forEach(function(i){
            if(i.inventory_id==e.target.id.substr(3)){
                const encode_str = i.item.name.replaceAll('&#40;','(').replaceAll("&#41;",")");
                $("#enlargedTitleLabel").text("Item no. "+i.item.no+" price: "+Number(i.unit_price_final).toFixed(2)+" "+i.currency_code);
                $("#enlargedFooter").text(unescape(encode_str)); //does not want to unescape
                const link = "https://www.bricklink.com/v2/inventory_detail.page?invID="+i.inventory_id;
                $("#enlargedItemLink").attr('href',link);
               } 
        })
    })
    $("#enlargedImg").attr('src',src);
    $('#enlarge').modal('show');
}
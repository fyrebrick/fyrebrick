$(document).ready(function () {
    //init constant variables
    const searchBarHTML = "";
    const loadingSpinnerHTML = "<button id=\"spinner\" class=\"btn btn-primary btn-lg my-2 my-sm-0\" type=\"button\" disabled>\n" + "  <span class=\"spinner-border spinner-border-sm\" role=\"status\" aria-hidden=\"true\"></span>\n" + "  Loading...\n" + "</button>";
    const imagesShowHTML = "";
    const colorListHTML = "";
    const remarks = "";
    //attach main listeners to DOM
    mainListeners();
    //functions below here
    function search(e){
        $("#main").empty()
        $.ajax({
            method: "POST",
            url: "/add/search",
            data: {
                search:$("#search").val()
            },
            beforeSend: startLoading
        }).done(function (data) {
            let stringCardsHtml = "";
            if(data.data && data.data.length){
                 data.data.forEach(function (o){
                     stringCardsHtml+="<div class=\"card\" style=\"width: 18rem;\">\n" +
                         "                                     <img src=\"" + o.image_url + "\" class=\"card-img-top\" alt=\"" + o.description + "\">\n" +
                    "                                     <div class=\"card-body\">\n"+
                                                            "<h5 class=\"card-title\">"+o.name+"</h5>" +
                                                            "<h6 class=\"card-subtitle mb-2 text-muted\">Item no " + o.no + " (" + o.type + ")</h6>"+
                    "                                         <p class=\"card-text\">"+o.description+"</p>\n"+
                                                            "<button id='"+o.type.substr(-o.type.length,1)+o.no+"' data-type='"+o.type.toUpperCase()+"' data-no='"+o.no+"' class=\"btn btn-primary use-item\">Use this item</a>"
                    "                                     </div>\n"+
                    "                                 </div>"
                });
            }else{
                stringCardsHtml="<div class=\"alert alert-warning\" role=\"alert\">\n" +
                                "                          Nothing found, try the searching in bricklink <a target='-blank' href='https://www.bricklink.com/v2/search.page?q="+$("#search").val()+"'> here</a>"+
                                "                        </div>";
                //nothing found
            }
            $("#main").append(stringCardsHtml);
            searchListening()
           stopLoading();
        })
        .fail(function (data){
            $("#spinner").empty()
            .append("Something went wrong, please reload");
        });
    }
    function getKnowColorSelector(e){
        $.ajax({
            method: "POST",
            url: "/add/getknowncolours",
            data: {
                type:$("#"+e.target.id).data('type').toUpperCase().trim(),
                no:$("#"+e.target.id).data('no')
            },
            beforeSend: startLoading
        }).done(function(data){
            //receives [{color_id,quantity}]
        let k = "<div class='row justify-content-md-center'>";
                k += "<div class='col'>";
                    k = "<ul class=\"list-group list-group-flush\"'>\n";
                    data.data.forEach(function(o){
                        k += "<li class=\"list-group-item\" id='"+o.color_id+"' style='border-left: "+o.rgb+" solid 57px;'>";
                            k += "<div class='row'>";
                                k += "<div class='col'>";
                                k += "<input class='colorBox' id='"+o.color_id+"' type='checkbox'></input>";
                                k += "</div>";
                                k += "<div class='col'>";
                                k += "<label for='"+o.color_id+"'>"+o.name+"</label>";
                                k += "</div>";
                                //- k += "<div class='col'>";
                                //- k += "<p>amount in stock: "+o.quantity+"</p>";
                                //- k += "</div>";
                            k += "</div>";
                        k+= "</li>\n";
                    });
                    k += "</ul>";
                k += "</div>";
            k +="</div>";
            k += "<div class='row justify-content-md-center'>";
            k += "<button id='colourUseButton' class=\"btn btn-primary use-item\">Use these colours</a>";
            k += "</div>"
            $("#main").empty();
            $("#main").append(k);
            addItemsListening();
            stopLoading();
        });
    }
    function addItems(e){
        startLoading();
        $("#main").empty();

        stopLoading();

    }
    function addItemsListening(){
        document.getElementById('colourUseButton').addEventListener('click',addItems);
    }
    function searchListening(){
        document.querySelectorAll(".use-item").forEach(function (item) {
            item.addEventListener('click',getKnowColorSelector );
        });
    }
    function stopLoading(){
        $("#loadingSection").empty();
    }
    function startLoading(){
        $("#loadingSection").append(loadingSpinnerHTML);
    }
    function mainListeners(){
        //search listeners
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
        document.getElementById("searchButton").addEventListener('click', search); //TODO:add function to listener
    }
});
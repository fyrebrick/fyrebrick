$(document).ready(function(){
    $("#next").click(function(){
      $("#consumerSection").
      animate({
        width: "toggle"
      });
      $("#tokenSection").
      animate({
        width: "toggle"
      });
    });
    $("#back").click(function () {
      $("#consumerSection").
      animate({
        width: "toggle"
      });
      $("#tokenSection").
      animate({
        width: "toggle"
      });
    });
  });
  function animationToggleForward(id){
    $(id).animate({
      width: "toggle"
    });
    }

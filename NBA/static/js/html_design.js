window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 15) {
      document.getElementById("header_scroll").style.fontSize = "30px";
      document.getElementById("header_scroll").style.height = "100px";
    } else {
      document.getElementById("header_scroll").style.fontSize = "90px";
      document.getElementById("header_scroll").style.height = "300px";
    }
    console.log("Hello");
  }



//   $(document).on("scroll", function(){
//       console.log("hello")
//     if($(document).scrollTop() > 100)
//     {
//        $("#logo").addClass("shrink");
//     }
//     else
//     {
//         $("#logo").removeClass("shrink");
//     }
// });
let proId = document.getElementById("proIds");
console.log("poid for..if.", proId.innerText);

// SINGLE PRODUCT SECTION//
if (window.location.pathname === `/view-single-product/${proId.innerText}`) {
  $(document).ready(function () {
    $(".small_img").click(function () {
      $(".big_img").attr("src", $(this).attr("src"));
    });
  });
  // Add active class to the current button (highlight it)
  var header = document.getElementById("myDIV");
  var btns = header.getElementsByClassName("btn");
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
      var current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      this.className += " active";
    });
  }
}

//========================//

// quantity = document.getElementById("#quantity").value
// productId = document.getElementById("#productId").value

function addToCartMain() {
  console.log("hello");

  var quantity = document.getElementById("quantity").value;
  var productId = document.getElementById("productId").value;

  console.log(" hello proiddd", productId);
  console.log(" hello quantiy", quantity);

  addToCart(productId, quantity);

  function addToCart(productId, quantity) {
    console.log("ajax pro id", productId);
    console.log("ajax quantity", quantity);

    $.ajax({
      url: "/add-to-cart/",
      data: {
        productid: productId,
        quantity: quantity,
      },
      method: "post",

      success: (response) => {
        if (response.status) {

          let count = $("#cart-count").html();
          count = parseInt(count) + 1;
          $("#cart-count").html(count);
          
          window.location.href = "/cart";
         
        }
      },
    });
  }
}

// function addToCart(proId) {
//     $.ajax({
//       url: "/add-to-cart/" + proId,
//       method: "get",
//       success: (response) => {
//         if (response.status) {
//           let count = $("#cart-count").html();
//           count = parseInt(count) + 1;
//           $("#cart-count").html(count);
//           swal("Item Added to Cart", { button: false, timer: 900 });
//         } else if (response.alertOnly) {
//           swal("Item Added to Cart", { button: false, timer: 900 });
//         } else {

//         }
//       },
//     })
//       .done(() => {
//         // window.location.href='/add-to-cart/:id'
//       })
//       .catch((e) => console.log("header.hbs error"));
//   }

const Cart = require("../models/cart");

module.exports = {
  getTotalAmount: async (userid) => {
    
    console.log("helper..",userid);

    return new Promise(async (resolve, reject) => {

      try{
        const usercart = await Cart.findOne({ user:userid })
        // .populate("user")
        .populate("cartitems.product", "price")
        .populate("cartitems.product").then((usercart)=>{

          if (usercart) {
            let cartproducts = usercart.cartitems;
            let prolistLength = cartproducts.length;
            console.log("length....", prolistLength);
            console.log("cartproducts....", cartproducts);
            var arr = [];
            for (let i = 0; i < prolistLength; i++) {
              var price = cartproducts[i].product.price;
              var quantity = cartproducts[i].quantity;
              totalPrice = cartproducts[i].product.price * cartproducts[i].quantity;
              arr.push(totalPrice);
            }
            let TotalCartValue = arr.reduce((a, b) => a + b, 0);
            console.log("SUM ...", TotalCartValue);
            var too = TotalCartValue;
            console.log("tooo", too);
          }

          let checkoutData={
            usercart:usercart,
            too:too
          }

          resolve(checkoutData)
        })
      }

      catch(err){
        console.log(err)
      } 
    });
  },






};

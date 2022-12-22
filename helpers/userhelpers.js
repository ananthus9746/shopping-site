const Cart = require("../models/cart");
const Razorpay=require('razorpay');


var instance = new Razorpay({
  key_id: 'rzp_test_xE9ViN7qNPez7M',
   key_secret: 'Q8Np8zqRmJ1GxDArdSfCPu1a'
})


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

  generateRazorpay:(orderid,total)=>{
    console.log("from generateRazorpay ..",orderid,total)
    

    // key_id: 'rzp_test_xE9ViN7qNPez7M',
    // key_secret: 'Q8Np8zqRmJ1GxDArdSfCPu1a',

    return new Promise((resolve,reject)=>{


      
      instance.orders.create({
        amount: total,
        currency: "INR",
        receipt:""+orderid,
        notes: {
          key1: "value3",
          key2: "value2"
        }
      },function(err,order){
        console.log("from generateRazorupay helpeers..",order)

        resolve(order)
      })


    })

  }






};

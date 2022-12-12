

// module.exports={
//     changeProductQuantity: (data) => {
//         count = parseInt(data.count)
//         return new Promise((resolve, reject) => {
//             try {
//                 db.cart.updateOne({ '_id': data.cart, 'cartItems.products': data.product }, {
//                     $inc: { 'cartItems.$.quantity': count }
//                 }).then(() => {
//                     resolve({ status: "success" })
//                 })
//             } catch (err) {
//                 console.log(err);
//             }
//         })
//     }
// }

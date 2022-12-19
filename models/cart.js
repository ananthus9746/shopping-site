const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//CART SCHEMA
const cartSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  cartitems: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        require: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Cart", cartSchema);

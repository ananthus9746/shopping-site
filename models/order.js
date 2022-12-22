const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//CATAGORY SCHEMA
const orderSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  cartid: {
    type: Schema.Types.ObjectId,
    ref: "Cart",
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
      dateCreated: {
        type: Date,
        default: Date.now,
      },
    }
  ],
  address: {
    type: Object,
    require: true,
  },
  totalPrice: {
    type: Number,
    require: true,
  },
  status: {
    type: String,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  created_at: Date
});
module.exports = mongoose.model("Order", orderSchema);

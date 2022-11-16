const mongoose = require("mongoose");

//PRODUCT SCHEMA
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  mrp: {
    type: Number,
  },
  discription: {
    type: String,
  },
  brand: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
  },
  stockAlart: {
    type: Number,
  },

  catagory: {
    
  type: mongoose.Schema.Types.ObjectId,
  ref: "Catagory",
    required: true,
  },

  isfeatured: {
    type: Boolean,
    default: false,
  },
  image: [
    //nested documents
    {
      img: { type: String },
    },
  ],
  review:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      review:String,
    }
  ],
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  
},{timestamps:true});
module.exports = mongoose.model("Product", productSchema);

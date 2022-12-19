const mongoose = require("mongoose");

//USER SCHEMA
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: true,
    trim: true,
  },
  lastName: {
    type: String,
    require: true,
    trim: true,
  },
  email: {
    type: String,
    require: true,
    trim: true,
    lowercase: true,
  },
  phone:{
    type: String,
  },
  password: {
    type: String,
    require: true,
  },
  blocked:{
    type:Boolean,
    default:false,
  }

},{timestamps:true});
module.exports = mongoose.model("User", userSchema);

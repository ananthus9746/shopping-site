const mongoose = require("mongoose");

//USER SCHEMA
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", userSchema);

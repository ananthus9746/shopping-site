
const mongoose=require('mongoose');
//PRODUCT SCHEMA

const productSchema=new mongoose.Schema({
    name:{
        type : String,
        require : true,
        trim: true,
    }
})
module.exports=mongoose.model('Catagory',catagorySchema);
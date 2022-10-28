
const mongoose=require('mongoose');

//CATAGORY SCHEMA
const catagorySchema=new mongoose.Schema({
    name:{
        type : String,
        require : true,
        trim: true,
        
    }
})
module.exports=mongoose.model('Catagory',catagorySchema);
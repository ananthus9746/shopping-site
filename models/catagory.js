const mongoose=require('mongoose');

const catagorySchema=new mongoose.Schema({
    name:{
        type : String,
        require : true,
        trim: true,
        min:2,
    }
})

module.exports=mongoose.model('Catagory',catagorySchema);
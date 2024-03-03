const mongoose=require("mongoose")

const collectionSchema=new mongoose.Schema({
    id:Number,
    name:String,
    price:Number,
    totalPrice:Number,
    quantity:Number,
    image:String,
    userId:String,
    
},
{timestamps:true});

const Collection=mongoose.model("collection",collectionSchema);
module.exports=Collection;
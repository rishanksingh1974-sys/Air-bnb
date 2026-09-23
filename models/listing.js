const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        type:String,
        default:"https://unsplash.com/photos/white-and-blue-volkswagen-t1-van-toy-on-gray-surface-tOa-dWrZgnk",
        set:(v)=>v===""?"https://unsplash.com/photos/white-and-blue-volkswagen-t1-van-toy-on-gray-surface-tOa-dWrZgnk":v
        
    },
    price:Number,
    location:String,
    country:String
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;
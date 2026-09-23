const express=require("express");
const app=express();

const mongoose=require("mongoose");
const Listing=require("./models/listing.js");

async function main(){
     await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main().then(()=>{
    console.log("data base is connected");
})
.catch((err)=>{
    console.log(err);
});

app.get("/testListing",async(req,res)=>{
    let sampleListing=new Listing({
        title:"My New Villa",
        description:"By the beach",
        price:1200,
        location:"Calanguate ,Goa",
        country:"India"
    });

await sampleListing.save();
console.log("sample was saved");
res.send("Successful testing");

});

app.listen(8080,()=>{
    console.log("Server is listening on port 8080");
});

app.get("/",(req,res)=>{
    res.send("req is working");
});

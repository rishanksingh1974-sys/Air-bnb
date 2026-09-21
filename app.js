const express=require("express");
const app=express();

const mongoose=require("mongoose");

async function main(){
     await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main().then(()=>{
    console.log("data base is connected");
})
.catch((err)=>{
    console.log(err);
});

app.listen(8080,()=>{
    console.log("Server is listening on port 8080");
});

app.get("/",(req,res)=>{
    res.send("req is working");
});

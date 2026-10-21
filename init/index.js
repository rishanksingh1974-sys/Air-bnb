const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

async function main(){
     await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main().then(()=>{
    console.log("data base is connected");
})
.catch((err)=>{
    console.log(err);
});


const initDB=async ()=>{
await Listing.deleteMany({});
initData.data=initData.data.map((obj)=>({
    ...obj,
    owner:"6ad793c629f15b57d7be4d23"
}));
await Listing.insertMany(initData.data);
console.log("Data was initialized");
};

initDB();
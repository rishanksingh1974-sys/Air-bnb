const express=require("express");
const app=express();
const users=require("./routes/user.js");
const posts=require("./routes/post.js");
const cookieParser=require("cookie-parser");

app.use(cookieParser("secretcode"));

app.get("/getsignedcookies",(req,res)=>{
    res.cookie("Sports","Cricket",{signed:true});   
    res.send("signed cookied are sent");
});

app.get("/verify",(req,res)=>{
console.log(req.signedCookies);
res.send("verified");
});

app.get("/getcookies",(req,res)=>{
   res.cookie("greet","namaste");
    res.cookie("age","20");
    res.send("cookies are set");
});

app.get("/greet",(req,res)=>{
let {name="unknown"}=req.cookies;
    res.send(`Hi, ${name}`);    

});

app.get("/",(req,res)=>{
    console.dir(req.cookies);
    res.send("Hi, i am root");
});

app.use("/users",users);
app.use("/posts",posts);


app.listen(3000,()=>{
    console.log("Server is listening on port 3000");
});

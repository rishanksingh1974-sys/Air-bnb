const express = require("express");
const app = express();

const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError.js");

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main().then(() => {
    console.log("data base is connected");
})
    .catch((err) => {
        console.log(err);
    });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// app.get("/testListing",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My New Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calanguate ,Goa",
//         country:"India"
//     });

// await sampleListing.save();
// console.log("sample was saved");
// res.send("Successful testing");

// });

app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});

app.get("/", (req, res) => {
    res.send("req is working");
});

// show routes
app.get("/listings", wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
}));


//Create listings
app.get("/listing/new", (req, res) => {
    res.render("listings/new.ejs");
});


app.post("/listings", wrapAsync(async (req, res, next) => {
    if(!req.body){
        throw new ExpressError(400,"something went wrong");
    }
    let { title, description, price, image, country, location } = req.body;

    

    let addList = new Listing({
        title: title,
        description: description,
        image: image,
        price: price,
        country: country,
        location: location
    });
    await addList.save();
    res.redirect("/listings");
}));

//update



//Indiviual listing
app.get("/listing/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}));

app.get("/listing/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    res.render("listings/edit.ejs", { listing });

}));


app.put("/listing/:id", wrapAsync(async (req, res) => {
      if(!req.body){
        throw new ExpressError(400,"something went wrong");
    }
    let { title, description, price, image, country, location } = req.body;
    let { id } = req.params;

    await Listing.findByIdAndUpdate(id, {
        title: title,
        description: description,
        image: image,
        price: price,
        country: country,
        location: location
    });

    res.redirect(`/listing/${id}`);
}));


app.delete("/listing/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));



app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!!" } = err;
    res.status(statusCode).render("error.ejs",{err});
});



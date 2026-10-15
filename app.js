const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings=require("./routes/listing.js")
const reviews=require("./routes/review.js");

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
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);


app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});

app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!!" } = err;
    res.status(statusCode).render("error.ejs",{message});
});



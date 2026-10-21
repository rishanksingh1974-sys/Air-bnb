const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");

const Listing = require("../models/listing.js");
const { isLoggedIn,isOwner,validateListing } = require("../middleware.js");



router.get("/", wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
}));



router.get("/new", isLoggedIn, (req, res) => {

    res.render("listings/new.ejs");

});


router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {

    let { title, description, price, image, country, location } = req.body;
    let addList = new Listing({
        title: title,
        description: description,
        image: image,
        price: price,
        country: country,
        location: location
    });
    addList.owner = req.user._id;
    await addList.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
}));






router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if (!listing) {
        req.flash("error", "The listing do not exist");
        res.redirect("/listings");
    }
    else {
        res.render("listings/show.ejs", { listing });
    }
}));

router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "The listing do not exist");
        res.redirect("/listings");
    }
    else {
        res.render("listings/edit.ejs", { listing });
    }
}));


router.put("/:id", isLoggedIn,isOwner, validateListing, wrapAsync(async (req, res) => {

    let { title, description, price, image, country, location } = req.body;
    let { id } = req.params;
           await Listing.findByIdAndUpdate(id, {
            title: title,
            description: description,
            image: image,
            price: price,
            country: country,
            location: location
        }, {
            runValidators: true,
        });
        req.flash("success", "Listing updated!");
        res.redirect(`/listings/${id}`);
    
}));


router.delete("/:id", isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
}));



module.exports = router;
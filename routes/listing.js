const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const Listing = require("../models/listing.js");


const validateListing=(req,res,next)=>{
     let { error } = listingSchema.validate({
        listing: req.body
    });
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

router.get("/", wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
}));



router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});


router.post("/", validateListing,wrapAsync(async (req, res, next) => {
   
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
    res.redirect("listings");
}));






router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
}));

router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    res.render("listings/edit.ejs", { listing });

}));


router.put("/:id",validateListing, wrapAsync(async (req, res) => {
    
    let { title, description, price, image, country, location } = req.body;
    let { id } = req.params;

    await Listing.findByIdAndUpdate(id, {
        title: title,
        description: description,
        image: image,
        price: price,
        country: country,
        location: location
    },{
        runValidators:true,
    });

    res.redirect(`/listings/${id}`);
}));


router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));



module.exports=router;
const Listing = require("./models/listing");
const Review = require("./models/review.js");
const {listingSchema, reviewSchema} = require("./schema.js"); //JOI schema
const ExpressError = require("./utils/ExpressError.js");

const isLoggedIn=(req, res, next)=>{
    // console.log(req.user);
    if(!req.isAuthenticated()){
        //if user is not logged in you have to redirect him to the original url he wanted to visit 
        req.session.redirectUrl = req.originalUrl;
        req.flash("failure", "You must be logged in to create a new Listings!");
        res.redirect("/login");
    }
    next();
}
module.exports = isLoggedIn;

module.exports.saveRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
        console.log(req.session.redirectUrl);   
    }
    next();
}

module.exports.isOwner = async(req, res, next) =>{
    let{id} = req.params;
    let listing = await Listing.findById(id);
    
    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash("failure", "You are not the owner of this listing!")
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//server side validation of Listing
module.exports.validateListing=(req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error);
    }
    else{
        next();
    }
}

//server side validation of review
module.exports.validateReview=(req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error);
    }
    else{
        next();
    }
}

module.exports.isReviewAuthor= async(req, res, next)=>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("failure", "You are not the author of this Review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
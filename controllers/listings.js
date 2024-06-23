const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    console.log(req.user);
    res.render("new.ejs");
  }

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({path: "reviews", populate:{path: "author"}})  //populating author as well as reviews
      .populate("owner");
    // console.log(listing);
    if (!listing) {
      req.flash("failure", "The Listing Doesn't Exist!");
      res.redirect("/listings");
    }
    
    // console.log(res.locals);

    res.render("show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {
    let newListing = req.body.listing;
    // console.log(listing);
    newListing.owner = req.user._id; //we want the current user's id in the newListing being created
    await Listing.insertMany(newListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
      req.flash("failure", "Listing Doesn't Exist!");
      res.redirect("/listings");
    }
    res.render("edit.ejs", { listing });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}
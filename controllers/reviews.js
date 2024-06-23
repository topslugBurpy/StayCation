const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async (req, res) => {
  let { id } = req.params;
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  console.log(newReview);
  let listing = await Listing.findById(id);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "New Review Added!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  // console.log(id, reviewId);
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //pull out the review with id equal to reviewId
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};

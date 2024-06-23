const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const validateReview = require("../middleware.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const isLoggedIn = require("../middleware.js");
const isReviewAuthor = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//Reviews
//Post review Route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

//Delete review Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  validateReview.isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;

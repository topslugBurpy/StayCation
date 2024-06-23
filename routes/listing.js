const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js"); //JOI schema
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const isLoggedIn = require("../middleware.js");
const isOwner = require("../middleware.js");
const validateListing = require("../middleware.js");
const { populate } = require("../models/review.js");
const listingController = require("../controllers/listings.js");

//Index Route
router.get(
  "/",
  wrapAsync(listingController.index)
);

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Show Route
router.get(
  "/:id",
  wrapAsync(listingController.showListing)
);

//Create Route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(listingController.createListing)
);

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isLoggedIn.isOwner,
  wrapAsync(listingController.renderEditForm)
);

//Update Route
router.put(
  "/:id",
  isLoggedIn,
  isLoggedIn.isOwner,
  validateListing,
  wrapAsync(listingController.updateListing)
);

//Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isLoggedIn.isOwner,
  wrapAsync(listingController.deleteListing)
);

module.exports = router;

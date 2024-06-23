const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default:
      "https://plus.unsplash.com/premium_photo-1684175656172-19a7ee56f0c8?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    set: (v) => {
      return v === ""
        ? "https://plus.unsplash.com/premium_photo-1684175656172-19a7ee56f0c8?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        : v;
    },
  },
  price: Number,
  location: String,
  country: String,
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review",
  }],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

//deleting all the reviews of a deleted listing
listingSchema.post("findOneAndDelete", async(listing)=>{
  if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}});  //delete all the reviews which had id in that listing.review array
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/staycation";

main().then(()=>{
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    const newOwnerId = "66774743ce8dff24e7a0fcf9";
    initData.data = initData.data.map((obj)=>({...obj, owner: newOwnerId}));
    await Listing.insertMany(initData.data);
    console.log("data initialised");
}

initDB();
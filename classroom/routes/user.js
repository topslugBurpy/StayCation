const express = require("express");
const router = express.Router();


//index
router.get("/", (req, res)=>{
    res.send("this is get for users")
});

//show
router.get("/:id", (req, res)=>{
    res.send("this is show for user id ")
});

//delete
router.delete("/:id", (req, res)=>{
    res.send("delete a user with id")
});


module.exports = router;

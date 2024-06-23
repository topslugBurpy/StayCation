const express = require("express");
const router = express.Router();

//index
router.get("/", (req, res)=>{
    res.send("this is get for posts")
});

//show
router.get("/:id", (req, res)=>{
    res.send("this is show for post id")
});

//delete
router.delete("/:id", (req, res)=>{
    res.send("delete a post with id")
});

module.exports = router;
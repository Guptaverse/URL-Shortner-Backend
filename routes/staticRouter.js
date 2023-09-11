const express = require("express");
const URL = require("../models/url")

const router = express.Router();

router.get("/",async(req,res)=>{
    const allURL = await URL.find({})
    return res.json({urls:allURL});
});


module.exports = router;
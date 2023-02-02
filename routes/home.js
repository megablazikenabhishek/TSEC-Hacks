const express = require("express");
const router = express.Router();

const Item = require("../models/item");

// Get all Item Data
router.get("/", async(req, res, next)=>{
    const data = await Item.find({sold:false});
    res.status(200).json(data);
})

// Get a single Item Data
router.get("/:id", async(req, res, next)=>{
    console.log(req.params);
    try {
        const item = await Item.findById(req.params.id);
        res.status(200).json(item);
    } catch (error) {
        console.log(error);
    }
})
module.exports = router;
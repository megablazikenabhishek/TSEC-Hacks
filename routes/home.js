const express = require("express");
const router = express.Router();
const path = require("path");

const Item = require("../models/item");

let ctn = 0

// Get all Item Data
router.get("/api", async(req, res, next)=>{
    const data = await Item.find({sold:false});
    res.status(200).json(data);
})

// Get a single Item Data
router.get("/api/:id", async(req, res, next)=>{
    // console.log(req.params);
    try {
        const item = await Item.findById(req.params.id);
        res.status(200).json(item);
    } catch (error) {
        console.log(error);
    }
})

// Place an Offer
router.post("/api/placeOffer", (req, res, nex)=>{
    (async ()=>{
        try {
            let loggedInUser = await req.user;
            const mv = require('mv');
            const formidable = require('formidable');
            const form = formidable({ multiples: true });
            form.parse(req, (err, fields, files) => {
                let imagesToString ='', newImageNames;

                if(files.images[0]){
                    for(let i=0; i< files.images.length; i++){
                        files.images[i].name = `img-a${ctn}.${files.images[i].name.substring(files.images[i].name.lastIndexOf(".")+1)}`;
                        ctn++;
                        imagesToString+= `${files.images[i].name},`;
                    }
                    newImageNames = imagesToString.substring(0, imagesToString.length-1);
                    for(let i=0; i< files.images.length; i++){
                        mv(files.images[i].path, path.join(__dirname, '../', '/*', '../public/uploads') + '/' + files.images[i].name, function (err) {
                            if(err) throw err;
                        });
                    }
                }
                else {
                    files.images.name = `img-${ctn}.${files.images.name.substring(files.images.name.lastIndexOf(".")+1)}`;
                    newImageNames = files.images.name;
                    mv(files.images.path, path.join(__dirname, '../', '/*', '../public/uploads') + '/' + files.images.name, function (err) {
                        if(err) throw err;
                    });
                }
                
                (async ()=>{
                    let userObj = {
                        user_id : loggedInUser._id,
                        product_name: fields.name, 
                        details: fields.details,
                        price : files.price,
                        images: newImageNames,
                        used_since: fields.used_since,
                        location: loggedInUser.location
                    }
                    console.log(userObj);
                    // const {offer}
                    res.send("hiii");
                })();
              });
            
        }
        catch(err){
            console.log(err);
        }
    })();
})
module.exports = router;
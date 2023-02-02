const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const path = require('path');
let checkAuthenticated = require('./functions.js').checkAuthenticated;
let Users = require(path.join(__dirname, '../models/index.js')).users;
let Items = require(path.join(__dirname, '../models/index.js')).items;
let Categories = require(path.join(__dirname, '../models/index.js')).categories;
let Bids = require(path.join(__dirname, '../models/index.js')).bids;

const Item = require("../models/item");

let ctn = 1;

router.get('/profile', checkAuthenticated, (req, res)=>{
    (async ()=>{
        try {
            let loggedInUser = await req.user;
            let items = await Items.find({user_id: loggedInUser._id}).sort({_id: -1});
            res.render('profile', {items});
        }
        catch(err){
            console.log(err);
        }
    })();
});


router.get('/profile/additem', checkAuthenticated, (req, res)=>{
    (async ()=>{
        try {
            let categories = await Categories.find({});
            let additem = true;
            res.render('profile', {additem, categories});
        }
        catch(err){
            console.log(err);
        }
    })();
});

router.post('/profile/additem', checkAuthenticated, (req, res)=>{
    (async ()=>{
        try {
            console.log(req.body);
            let loggedInUser = await req.user;
            const mv = require('mv');
            const formidable = require('formidable');
            const form = formidable({ multiples: true });
            form.parse(req, (err, fields, files) => {
                let imagesToString ='', newImageNames;

                if(files.images[0]){
                    for(let i=0; i< files.images.length; i++){
                        files.images[i].name = `img-${ctn}.${files.images[i].name.substring(files.images[i].name.lastIndexOf(".")+1)}`;
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
                    // await Items.create({user_id: loggedInUser._id, name: fields.name, detail: fields.detail, price: fields.price, images: newImageNames, category_id: fields.category, start_bid_date: fields.start_bid_date});
                    let userObj = {
                        user_id : loggedInUser._id,
                        product_name: fields.product_name, 
                        details: fields.details,
                        price : Number(fields.price),
                        images: newImageNames,
                        tags: fields.tags,
                        used_since: Number(fields.used_since),
                        location: loggedInUser.address
                    }
                    console.log(userObj);
                    await Items.create(userObj);
                    res.redirect('/profile');
                })();
              });
            
        }
        catch(err){
            console.log(err);
        }
    })();
});

// Get User
router.get("/profile/getUser",checkAuthenticated,async(req, res, next)=>{
    const user = await req.user;
    console.log(user);
    res.status(200).json({fullname:user.fullname, email:user.email, address:user.address, phone:user.phone})
})
// My List
router.get("/profile/myList", checkAuthenticated, async(req, res, next)=>{
    const logged_user = await req.user;
    const data = await Item.find({user_id:logged_user._id});
    res.status(200).json(data);
})
// My Offers
router.get("/profile/myOffers", checkAuthenticated, async(req, res, next)=>{
    res.send("hiiii");
})

module.exports = router;
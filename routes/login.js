const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const path = require('path');
let checkNotAuthenticated = require('./functions.js').checkNotAuthenticated;
let checkAuthenticated = require('./functions.js').checkAuthenticated;
let Users = require(path.join(__dirname, '../models/index.js')).users;


(async ()=>{
    try {
        let initializePassport = require('./passport-config');
        initializePassport(passport, (email) => {
            return (async ()=>{
                let user = await Users.find({email: email});
                if(user.length === 0){
                    return null;
                }
                else {
                    return user[0];
                }
            })();
        },
        (id) => {
            return (async ()=>{
                let user = await Users.find({_id: id});
                if(user.length === 0){
                    return null;
                }
                else {
                    return user[0];
                }
            })();
        });
        
    }
    catch(error) {
        console.log(error);
    }
})();


router.get('/login', checkNotAuthenticated, (req, res)=>{
    (async ()=>{
        try {
            let login = true;
            res.render('login', {login, login_errors: req.flash().error});
        }
        catch(err){
            console.log(err);
        }
    })();
});


router.post('/login', passport.authenticate('local', {
    successRedirect: '/home.html',
    failureRedirect: '/login',
    failureFlash: true
})
);

router.get('/logout', checkAuthenticated, (req, res)=>{
(async ()=>{
    try {
        req.logOut();
        res.redirect('/login');
    }
    catch(err){
        console.log(err);
    }
})();
});


router.get('/register', checkNotAuthenticated, (req, res)=>{
    (async ()=>{
        try {
            let register = true;
            // res.render('login', {register});
            res.redirect("/login.html")
        }
        catch(err){
            console.log(err);
        }
    })();
});

router.post('/register', checkNotAuthenticated, (req, res)=>{
    console.log(req.body);
    (async ()=>{
        try {
            let errors = [];
            let register = true;
            let submited = true;
            if(req.body.fullname == '' || req.body.email == '' || req.body.address == ''
            || req.body.phone == '' || req.body.password == '' || req.body.password2 == ''){
                    errors.push('Please fill all the fields');
            }
            if(req.body.password !== req.body.password2){
                    errors.push('Passwords are not mutch');
            }
            let checkEmail = await Users.find({email: req.body.email}, {_id: 1});
            console.log(checkEmail);
                let success = 'You are successfully signed up'
                let hashPassword = bcrypt.hashSync(req.body.password, 10);
                await Users.create({fullname: req.body.fullname, email: req.body.email, address: req.body.address, phone: req.body.phone, password: hashPassword});
                res.redirect("/home.html");
        }
        catch(err){
            console.log(err);
        }
    })();
});


module.exports = router;
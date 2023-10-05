const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const validateRegisterInput = require("../validation/registerValidation")



// @route  GET /api/auth/test
// @desc   Test the auth route
// @access Public
router.get("/test", (req, res) => {
    res.send("auth route working");
});


// @route  GET /api/auth/register
// @desc   create new user
// @access Public
router.post("/register", async (req, res) => {
    try{
        const {errors, isValid} = await validateRegisterInput(req.body);

        if(!isValid){
            return res.status(400).json({errors});
        }
        // check for existing user
        const existingEmail = await User.findOne({
            email: new RegExp("^" + req.body.email + "$", "i") 
        });

        if(existingEmail){
            res.status(400).json({error: "User already exists"});
        }

        //hashing password
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        
        //create new user 
        const newUser = new User({
            email: req.body.email,
            password: hashedPassword,
            name: req.body.name
        });

    // save the user to db
    const savedUser = await newUser.save();

    //return user
    return res.json(savedUser);

    }
    catch(err){
        console.log(err);
        res.status(500).send(err.message)
    }
});

module.exports = router;
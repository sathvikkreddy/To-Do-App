const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const validateRegisterInput = require("../validation/registerValidation")
const jwt = require("jsonwebtoken");


// @route  GET /api/auth/test
// @desc   Test the auth route
// @access Public
router.get("/test", (req, res) => {
    res.send("auth route working");
});


// @route  POST /api/auth/register
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


// @route  POST /api/auth/login
// @desc   Login user
// @access Public

router.post("/login", async (req, res) => {
    try{
        const user = await User.findOne({
            email: new RegExp("^" + req.body.email + "$", "i") 
        });

        if(!user){
            return res.status(400).json("Error while logging in");
        }

        const passwordsMatched = await bcrypt.compare(req.body.password, user.password);
        
        if(!passwordsMatched){
            return res.status(400).json("Error while logging in");
        }

        const payload = {userId: user._id}
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        res.cookie("access-token", token, {
            expires: new Date(Date.now() + 7 * 24 * 60* 60* 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        });

        const userToReturn = { ...user._doc };
        delete userToReturn.password;

        return res.json({
            token: token,
            user: userToReturn
        });
    }
    catch(err){
        console.log(err);
        return res.status(400).send(err.message);
    }
})

module.exports = router;
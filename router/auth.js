const jwt=require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const bcrypt= require("bcrypt");

require("../db/conn");

const User = require("../model/userSchema");

router.post("/register", async (req, res) => {
  const { name, email, password, cpassword } = req.body;
  if (!name || !email || !password || !cpassword) {
    return res.status(422).json({ error: "please filled the details" });
  }

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ err: "email already exist" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "passwords are not matched" });
    } else {
      const user = new User({ name, email, password, cpassword });
      await user.save();
      res.status(201).json({ message: "user registerd successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Intetrnal Server error" });
    console.log(error);
  }
});

router.post("/signin", async (req, res) => {
  try {
    let token;
    
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "please fil the data" });
    }

    const userLogin = await User.findOne({ email: email });
    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

       token= await userLogin.generateAuthTokens();
      console.log(token);

      res.cookie("jwttoken",token,{
        expires:new Date(Date.now()+25892000000),
        httpOnly:true
      })

      if (!isMatch) {
        res.status(400).json({ error: "invalid Credentials" });
      } else {
        res.json({ message: "user signin successfully" });
      }
    } else {
      res.status(400).json({ error: "invalid Credentials" });
    }
  } catch (error) {}
});

module.exports = router;

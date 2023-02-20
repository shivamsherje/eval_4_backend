const express = require("express");
const { UserModel } = require("../Models/User.model");
const userRoutes = express.Router();
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { connection } = require("../config/db");

userRoutes.post("/register", async (req, res) => {
  const { name, email, gender, password, age, city } = req.body;
  const user = await UserModel.findOne({ email });
  if (user) {
    res.send({ msg: "User already exist, please login" });
  } else {
    bcrypt.hash(password, 4, async function (err, hash) {
      if (err) {
        res.send({ msg: "Something went wrong please try after sometime.." });
      }
      const new_user = new UserModel({
        name,
        email,
        gender,
        password: hash,
        age,
        city,
      });
      try {
        await new_user.save();
        res.send({ msg: "Signup Successful" });
      } catch (err) {
        console.log("err:", err);
        res.send({ msg: "Something went wrong" });
      }
    });
  }
});

userRoutes.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (user) {
    const hashPass = user.password;
    const user_id = user._id;
    bcrypt.compare(password, hashPass, function (err, result) {
      if (err) {
        res.send({ msg: "Something went wrong please try after sometime.." });
      }
      if (result) {
        const token = jwt.sign(
          { user_id: user_id, email: email },
          process.env.key
        );
        res.send({ msg: "Login Successful", token });
      } else {
        res.send({ msg: "Login failed!" });
      }
    });
  } else {
    res.send({ msg: "User Not Found!!" });
  }
});

module.exports = {
  userRoutes,
};

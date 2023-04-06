const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
router.use(cookieParser());
//const {value}=require('./tokenFunc');

// Create a function to generate a JWT token
function createToken(user) {
  const token = jwt.sign(
    {
      // playername: user.playername,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "48h",
    }
  );
  //console.log('before'+token);
  return token;
}

// Create a middleware to verify JWT token
function checkingToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/login");
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } catch (err) {
    return res.status(500).send("Internal server Error");
  }
}

module.exports = {
  createToken,
  checkingToken,
};

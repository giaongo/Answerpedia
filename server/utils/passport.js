"use strict";
const passport = require("passport");
const jwt = require('jsonwebtoken');
const Strategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const bcrypt = require('bcryptjs');
const { getUserLogin } = require("../models/userModel");
require('dotenv').config();

// local strategy for username password login
passport.use(
  new Strategy(async (username, password, done) => {
    const params = [username];
    try {
      const [user] = await getUserLogin(params);
      console.log("Local strategy", user); // result is binary row
      if (user === undefined) {
        return done(null, false, { message: "Incorrect email." });
      }
      // Hash login password and compare it to the password hash in DB.
      const passwordOk = await bcrypt.compare(password, user.password);
      if (!passwordOk) {
        return done(null, false, { message: "Incorrect password." });
      }
      // use spread syntax to create shallow copy to get rid of binary row type
      return done(null, { ...user }, { message: "Logged In Successfully" }); 
    } catch (err) {
      return done(err);
    }
  })
);

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : process.env.JWT_SECRET,
},

  (jwtPayload, done) => {
     return done(null, jwtPayload);
  }
));

// TODO: JWT strategy for handling bearer token
// consider .env for secret, e.g. secretOrKey: process.env.JWT_SECRET

module.exports = passport;
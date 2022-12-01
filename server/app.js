'use strict';
const express = require('express');
const app = express();
const cors = require('cors');
const userRouter = require('./routes/userRoute');
const passport = require('./utils/passport')
const port = 4000;

app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({extended: true})); //for parsing application( x- ww form-urlencoded<

//Server uploaded files
app.use(express.static("uploads"));

app.use('/user',passport.authenticate('jwt', {session:false}), userRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
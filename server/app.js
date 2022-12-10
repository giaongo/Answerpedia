'use strict';
const express = require('express');
const app = express();
const cors = require('cors');
const authRouter = require('./routes/authRoute');
const userRouter = require('./routes/userRoute');
const questionRouter = require("./routes/questionRoute");
const savedRouter = require("./routes/savedRoute");
const answerRouter = require("./routes/answerRoute");
const passport = require("./utils/passport");

const port = 4000;

//Server uploaded files
app.use(express.static("uploads"));
app.use("/thumbnails",express.static("thumbnails"));


app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({extended: true})); //for parsing application( x- ww form-urlencoded<
app.use(passport.initialize());


app.use('/auth', authRouter);
app.use('/user', passport.authenticate('jwt', {session: false}), userRouter);
app.use('/answer', passport.authenticate('jwt', {session: false}), answerRouter);
app.use("/question",questionRouter);
app.use("/saved",passport.authenticate('jwt', {session: false}), savedRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


'use strict';
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
const questionRouter = require("./routes/questionRoute");

app.use(express.static("uploads"));
app.use("/thumbnails",express.static("thumbnails"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.listen(port,() => console.log(`App listening on port ${port}!`));

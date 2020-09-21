var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var cors = require("cors");
var dotenv = require("dotenv");
var { mongoUtil } = require("./utils");
var { userRoutes } = require("./routes");

// Init mongo and mongoose
mongoUtil.initMongoose();

// Init environment
dotenv.config();

// Init app
var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user", userRoutes);

module.exports = app;

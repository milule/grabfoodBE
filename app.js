const http = require("http");
const cors = require("cors");
const logger = require("morgan");
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const { mongoUtil } = require("./utils");
const { userRoutes, orderRoutes } = require("./routes");
// Create the http server

// Init mongo and mongoose
mongoUtil.initMongoose();

// Init environment
dotenv.config();

// Init app
const app = express();
const server = http.createServer(app);
require("./utils/socket").initSocket(server);

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.send("Hello");
});

app.use("/user", userRoutes);
app.use("/order", orderRoutes);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {});

// Error handler
app.use(function (err, req, res, next) {});

module.exports = { app: app, server: server };

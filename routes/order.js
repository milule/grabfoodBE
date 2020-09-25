const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { userModel, orderModel } = require("../schemas");
const { authMdw } = require("../middlewares");
const { HTTP, USER } = require("../constanst");

router.get("/check", authMdw.checkAuth, (req, res) => {
  try {
    console.log(req.user);
  } catch (error) {
    console.log("Cannot find");
  }
});

module.exports = router;

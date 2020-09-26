const express = require("express");
const router = express.Router();
const { orderModel } = require("../schemas");
const { authMdw } = require("../middlewares");
const { HTTP, ORDER } = require("../constanst");
const { setDriverActive, socketUsers } = require("../utils/socket");

router.get("/orderCheck", authMdw.checkAuth, async (req, res) => {
  try {
    const { username } = req.user;

    const order = await orderModel.find({
      driver: username,
      status: ORDER.ORDER_STATUS.IN_PROCESS,
    });

    if (!Array.isArray(order) || !order.length) throw Error;

    res.status(200).json({
      status: res.statusCode,
      code: HTTP.STATUS.SUCCESS,
      message: "",
      data: order[0],
    });
  } catch (error) {
    console.log("Cannot find order");
    res.status(200).json({
      status: res.statusCode,
      code: HTTP.STATUS.ERROR,
      message: "",
      data: null,
    });
  }
});

router.get("/orderDetails", authMdw.checkAuth, async (req, res) => {
  try {
    const { uuid } = req.query;
    const order = await orderModel.find({ uuid });

    if (!Array.isArray(order) || !order.length) throw Error;

    res.status(200).json({
      status: res.statusCode,
      code: HTTP.STATUS.SUCCESS,
      message: "",
      data: order[0],
    });
  } catch (error) {
    res.status(200).json({
      status: res.statusCode,
      code: HTTP.STATUS.ERROR,
      message: "",
      data: null,
    });
  }
});

router.post("/orderComplete", authMdw.checkAuth, async (req, res) => {
  try {
    const { username } = req.user;
    const { uuid, customer } = req.body;

    await orderModel.updateOne(
      { uuid },
      { status: ORDER.ORDER_STATUS.COMPLETED }
    );

    res.status(200).json({
      status: res.statusCode,
      code: HTTP.STATUS.SUCCESS,
      message: "",
      data: null,
    });

    const user = socketUsers[customer];
    if (!user) return;

    user.instance.emit("complete-request");
    setDriverActive(username);
  } catch (error) {
    console.log(error);
    res.status(200).json({
      status: res.statusCode,
      code: HTTP.STATUS.ERROR,
      message: "",
      data: null,
    });
  }
});

module.exports = router;

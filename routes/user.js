const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { userModel } = require("../schemas");
const { authMdw } = require("../middlewares");
const { HTTP, USER } = require("../constanst");

/**
 * @method - POST
 * @param - /signup
 * @description - User Signup
 */

router.post("/signup", async (req, res) => {
  const { username, password, email, role, phone, name } = {
    username: "user1",
    password: "123456",
    email: "user1@gmail.com",
    name: "Dũng Customer",
    phone: "09090909",
    role: USER.USER_ROLE.CUSTOMER,
  };
  try {
    let user = await userModel.findOne({ username });

    if (user) {
      res.status(400).json({
        status: res.statusCode,
        code: HTTP.STATUS.ERROR,
        message: HTTP.MESSAGE.USER.SIGNUP_EXIST,
        data: null,
      });
      return;
    }

    user = new userModel({
      username,
      email,
      password,
      role,
      phone,
      name,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(200).json({
      status: res.statusCode,
      code: HTTP.STATUS.SUCCESS,
      message: "",
      data: {
        username,
        email,
        password,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: res.statusCode,
      code: HTTP.STATUS.ERROR,
      message: HTTP.MESSAGE.COMMON.UNEXPECTED,
      data: null,
    });
  }
});

/**
 * @method - POST
 * @param - /login
 * @description - User Login
 */

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await userModel.findOne({ username });

    if (!user) {
      res.status(400).json({
        status: res.status,
        code: HTTP.STATUS.ERROR,
        message: HTTP.MESSAGE.USER.LOGIN_NOT_EXIST,
        data: null,
      });
      return;
    }

    const isCorrectPass = await bcrypt.compare(password, user.password);

    if (!isCorrectPass) {
      res.status(400).json({
        status: res.status,
        code: HTTP.STATUS.ERROR,
        message: HTTP.MESSAGE.USER.LOGIN_INCORRECT_PASS,
        data: null,
      });
      return;
    }

    const tokenData = {
      user: {
        id: user.id,
        username,
      },
    };

    const tokenJWT = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      algorithm: "HS512",
      expiresIn: 86400000 * 60,
    });

    res.status(200).json({
      status: res.status,
      code: HTTP.STATUS.SUCCESS,
      message: "",
      data: {
        user: user,
        token: tokenJWT,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: res.statusCode,
      code: HTTP.STATUS.ERROR,
      message: HTTP.MESSAGE.COMMON.UNEXPECTED,
      data: null,
    });
  }
});

/**
 * @method - GET
 * @param - /
 * @description - Get info user
 */

router.get("/me", authMdw.checkAuth, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    res.status(200).json({
      status: res.statusCode,
      code: HTTP.STATUS.SUCCESS,
      message: "",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({
      status: res.statusCode,
      code: HTTP.STATUS.ERROR,
      message: HTTP.MESSAGE.USER.GET_USER_FAILED,
      data: null,
    });
  }
});

module.exports = router;

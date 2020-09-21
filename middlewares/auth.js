const jwt = require("jsonwebtoken");
const { HTTP } = require("../constanst");

function checkAuth(req, res, next) {
  const token = req.headers["x-access-token"];

  if (!token) {
    res.status(401).json({
      status: res.statusCode,
      code: HTTP.STATUS.ERROR,
      message: HTTP.MESSAGE.USER.AUTH_USER_FAILED,
      data: null,
    });
    return;
  }

  try {
    const decodedJWT = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decodedJWT.user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({
      status: res.statusCode,
      code: HTTP.STATUS.ERROR,
      message: HTTP.MESSAGE.USER.AUTH_USER_FAILED,
      data: null,
    });
  }
}

module.exports = {
  checkAuth,
};

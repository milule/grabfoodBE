const STATUS = {
  ERROR: 0,
  SUCCESS: 1,
};

const MESSAGE = {
  USER: {
    SIGNUP_EXIST: "User already exists",
    SIGNUP_SUCCESS: "Sign up user success",
    LOGIN_NOT_EXIST: "User not exists",
    LOGIN_SUCCESS: "Login user success",
    LOGIN_INCORRECT_PASS: "Password not correct",
    GET_USER_FAILED: "Cannot get infomation of user",
    AUTH_USER_FAILED: "User authentication failed"
  },
  COMMON: {
    UNEXPECTED: "Unexpected error has occured",
  },
};

module.exports = {
  STATUS,
  MESSAGE,
};

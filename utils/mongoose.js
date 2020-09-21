const mongoose = require("mongoose");
const { mongoConfig } = require("../config");

const initMongoose = async () => {
  try {
    await mongoose.connect(mongoConfig.MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.info("Connect to Mongo DB");
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  initMongoose,
};

const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
  uuid: {
    type: String,
    require: true,
  },
  customer: {
    type: String,
    require: true,
  },
  driver: {
    type: String,
    require: true,
  },
  customerName: {
    type: String,
    require: true,
  },
  customerPhone: {
    type: String,
    require: true,
  },
  customerLat: {
    type: Number,
    require: true,
  },
  customerLng: {
    type: Number,
    require: true,
  },
  driverName: {
    type: String,
    require: true,
  },
  driverPhone: {
    type: String,
    require: true,
  },
  driverLat: {
    type: Number,
    require: true,
  },
  driverLng: {
    type: Number,
    require: true,
  },
  receiveName: {
    type: String,
    require: true,
  },
  receivePhone: {
    type: Number,
    require: true,
  },
  receiveAddress: {
    type: String,
    require: true,
  },
  receiveLat: {
    type: Number,
    require: true,
  },
  receiveLng: {
    type: Number,
    require: true,
  },
  productName: {
    type: String,
    require: false,
  },
  productWeight: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updateAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("order", OrderSchema);

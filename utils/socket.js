const socketio = require("socket.io");
const { v4: uuidv4 } = require("uuid");
const { ORDER, USER } = require("../constanst");
const { orderModel } = require("../schemas");

let instance = null;
let listUser = {};
let listDriver = {};

function initSocket(server) {
  instance = socketio(server);
  instance.on("connection", handleConnection);
}

function handleConnection(socket) {
  const {
    id: socketId,
    connected,
    handshake: { query },
  } = socket;

  const isCustommer = query.role === USER.USER_ROLE.CUSTOMER;
  const params = {
    ...query,
    socket: socketId,
    connect: connected,
    instance: socket,
    active: true,
  };

  if (isCustommer) {
    processCustomerService(params);
  } else {
    processDriverService(params);
  }

  console.log(Object.keys(listUser), Object.keys(listDriver));
}

function processCustomerService(params) {
  const info = params;
  listUser[info.username] = info;
  const socket = info.instance;

  socket.on("disconnect", () => {
    delete listUser[info.name];
    console.log(Object.keys(listUser));
  });

  socket.on("request", (data) => {
    const freeDriver = Object.values(listDriver).find(({ active }) => active);
    if (freeDriver) {
      const uuid = uuidv4();
      freeDriver.instance.emit("pending-request", {...data, uuid});
      return;
    }

    setTimeout(() => {
      socket.emit("cancel-request");
    }, 3000);
  });
}

async function processDriverService(params) {
  const info = params;
  const active = await checkBusy(info);

  listDriver[info.username] = { ...info, active };

  const socket = info.instance;

  socket.on("disconnect", () => {
    delete listDriver[info.name];
    console.log(Object.keys(listDriver));
  });

  socket.on("accept-request", async (data) => {
    const reqCustomer = Object.values(listUser).find(
      ({ username }) => username === data.customer
    );

    if (!reqCustomer) return;

    listDriver[info.username].active = false;

    reqCustomer.instance.emit("accept-request", data);

    const order = new orderModel({
      ...data,
      status: ORDER.ORDER_STATUS.IN_PROCESS,
    });

    await order.save();
  });

  socket.on("cancel-request", (data) => {
    const reqCustomer = Object.values(listUser).find(
      ({ username }) => username === data.customer
    );

    if (!reqCustomer) return;
    reqCustomer.instance.emit("cancel-request");
  });
}

async function checkBusy(info) {
  try {
    const { username } = info;

    const order = await orderModel.find({
      driver: username,
      status: ORDER.ORDER_STATUS.IN_PROCESS,
    });

    if (!Array.isArray(order) || !order.length) throw Error;

    return false;
  } catch (error) {
    return true;
  }
}

function setDriverActive(driver) {
  listDriver[driver].active = true;
}

module.exports = {
  initSocket,
  setDriverActive,
  socketInstance: () => instance,
  socketUsers: () => listUser,
  socketDriver: () => listDriver,
};

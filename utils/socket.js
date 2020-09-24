const socketio = require("socket.io");
const { v4: uuidv4 } = require("uuid");
const { USER } = require("../constanst");
const { ORDER } = require("../constanst");
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
  console.log(params);
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
  });

  socket.on("request", (data) => {
    const freeDriver = Object.values(listDriver).find(({ active }) => active);
    if (!freeDriver) {
      freeDriver.instance.emit("pending-request", data);
      return;
    }

    setTimeout(() => {
      socket.emit("cancel-request");
    }, 3000);
  });
}

function processDriverService(params) {
  const info = params;
  listDriver[info.username] = info;
  const socket = info.instance;

  socket.on("disconnect", () => {
    delete listDriver[info.name];
  });

  socket.on("accept-request", async (data) => {
    const reqCustomer = Object.values(listUser).find(
      ({ username }) => username === data.customer
    );

    if (!reqCustomer) return;
    listDriver[info.username].active = false;
    reqCustomer.instance.emit("accept-request", data);

    const uuid = uuidv4();
    listDriver[info.username].order = uuid;

    const order = new orderModel({
      uuid: uuid,
      status: ORDER.ORDER_STATUS.IN_PROCESS,
      ...data,
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

module.exports = {
  initSocket,
  socketInstance: () => instance,
  socketUsers: () => listUser,
  socketDriver: () => listDriver,
};

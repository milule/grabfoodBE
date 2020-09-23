const socketio = require("socket.io");
const { USER } = require("../constanst");

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

  const { _id: id, username, email, role, latitude, longitude } = query;
  if (role === USER.USER_ROLE.CUSTOMER) {
    listUser[username] = {
      id,
      username,
      email,
      role,
      latitude,
      longitude,
      socket: socketId,
      connect: connected,
    };
  } else {
    listDriver[username] = {
      id,
      username,
      email,
      role,
      latitude,
      longitude,
      socket: socketId,
      connect: connected,
    };
  }
}

module.exports = {
  initSocket,
  socketInstance: () => instance,
};

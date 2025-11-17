let io;

function initSocket(server) {
  const socketIo = require("socket.io");
  io = socketIo(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    socket.on("join_ticket", (ticketId) => {
      socket.join(`ticket_${ticketId}`);
    });

    socket.on("join_close_ticket", (roomIds) => {
      // Si 'roomIds' es un array, hacemos join para cada uno
      if (Array.isArray(roomIds)) {
        roomIds.forEach((r) => {
          socket.join(r);
        });
      } else {
        // O, si recibimos un solo string, unirse a uno solo
        socket.join(roomIds);
      }
    })
  });
}

function getIo() {
  if (!io) {
    throw new Error("Socket.io no ha sido inicializado.");
  }
  return io;
}

module.exports = { initSocket, getIo };

let onlineUser = [];

const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("New connection:", socket.id);

    // Khi user join
    socket.on("addNewUser", (userId) => {
      if (!onlineUser.some((user) => user.userId === userId)) {
        onlineUser.push({ userId, socketId: socket.id });
      }
      io.emit("getOnlineUser", onlineUser);
    });

    // Khi gửi message
    socket.on("sendMessage", (message) => {
      const user = onlineUser.find((u) => u.userId === message.recipientId);
      if (user) {
        io.to(user.socketId).emit("getMessage", message);
        io.to(user.socketId).emit("getNotification", {
          senderId: message.senderId,
          isRead: false,
          date: new Date(),
        });
      }
    });

    // Khi disconnect
    socket.on("disconnect", () => {
      onlineUser = onlineUser.filter((u) => u.socketId !== socket.id);
      io.emit("getOnlineUser", onlineUser);
    });
  });
};

export default initSocket;

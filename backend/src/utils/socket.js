const socket = require("socket.io");
const Message = require("../model/message");

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
        },
    });

    io.on("connection", (clientSocket) => {

        clientSocket.on("joinChat", ({ senderName, userId, targetUserId }) => {
            const roomId = [userId, targetUserId].sort().join("_");
            // console.log(senderName + " Joined Room: " + roomId);
            clientSocket.join(roomId);
        });

        clientSocket.on("sendMessage", async (msg) => {
            const roomId = [msg.userId, msg.targetUserId].sort().join("_");

            const savedMessage = await Message.create({
                senderId: msg.userId,
                receiverId: msg.targetUserId,
                text: msg.text || "",
                type: msg.type || "text",
                fileUrl: msg.fileUrl || "",
                fileName: msg.fileName || "",
                status: "delivered",
                photoUrl: msg.photoUrl,
            });

            const messageData = {
                id: savedMessage._id,
                senderName: msg.senderName,
                userId: msg.userId,
                targetUserId: msg.targetUserId,
                text: savedMessage.text,
                type: savedMessage.type,
                fileUrl: savedMessage.fileUrl,
                fileName: savedMessage.fileName,
                createdAt: savedMessage.createdAt,
                status: "delivered",
                photoUrl: msg.photoUrl,
            };

            io.to(roomId).emit("messageReceived", messageData);
        });

        clientSocket.on("markSeen", async ({ userId, targetUserId, messageId }) => {
            const roomId = [userId, targetUserId].sort().join("_");

            await Message.findByIdAndUpdate(messageId, {
                status: "seen",
            });

            io.to(roomId).emit("messagesSeen", {
                messageId,
            });
        });

        clientSocket.on("disconnect", () => {
            // console.log("User disconnected");
        });
    });

    return io;
};

module.exports = initializeSocket;
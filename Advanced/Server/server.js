// server.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const sequelize = require("./config/database");
const User = require("./models/User");
const Message = require("./models/Message");
const ChatRoom = require("./models/ChatRoom");
const authRoutes = require("./routes/authRoutes");
const chatRoomRoutes = require("./routes/chatRoomRoutes");

const path = require("path");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" },
});

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/chat-room", chatRoomRoutes);

// Real-time chat with Socket.IO
io.on("connection", (socket) => {
    console.log("New client connected");

    // Join a chat room
    socket.on("joinRoom", (chatRoomId) => {
        socket.join(chatRoomId);
        console.log(`User joined chat room: ${chatRoomId}`);
    });

    // Handle sending messages
    socket.on(
        "sendMessage",
        async ({ senderId, receiverId, chatRoomId, content }) => {
            const message = await Message.create({
                senderId,
                receiverId,
                chatRoomId,
                content,
            });

            io.to(chatRoomId).emit("receiveMessage", message);
        }
    );

    // Mark messages as read
    socket.on("markAsRead", async ({ messageId, chatRoomId }) => {
        const message = await Message.findByPk(messageId);
        if (message) {
            message.read = true;
            await message.save();

            // Notify users in the room
            io.to(chatRoomId).emit("messageRead", { messageId });
        }
    });

    // Typing status
    socket.on("typing", ({ chatRoomId, typing }) => {
        socket.to(chatRoomId).emit("typingStatus", { typing });
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

app.use("/", express.static(path.join(__dirname, "/public")));

const initializeDatabase = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log("Database synchronized");
    } catch (error) {
        console.error("Failed to synchronize database:", error);
    }
};
initializeDatabase();

server.listen(3005, () =>
    console.log("Server is running on http://localhost:3000")
);

// server.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors"); // Import the CORS middleware
const path = require("path");
const { Server } = require("socket.io");
const sequelize = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const chatRoomRoutes = require("./routes/chatRoomRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" },
});

// Middleware
app.use(cors({ origin: "http://localhost:5175" })); // Allow requests from React frontend
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/chat-room", chatRoomRoutes);

// Serve static files from the 'public' directory
app.use("/", express.static(path.join(__dirname, "/public")));

// Real-time chat with Socket.IO
io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("joinRoom", (chatRoomId) => {
        socket.join(chatRoomId);
        console.log(`User joined chat room: ${chatRoomId}`);
    });

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

    socket.on("markAsRead", async ({ messageId, chatRoomId }) => {
        const message = await Message.findByPk(messageId);
        if (message) {
            message.read = true;
            await message.save();
            io.to(chatRoomId).emit("messageRead", { messageId });
        }
    });

    socket.on("typing", ({ chatRoomId, typing }) => {
        socket.to(chatRoomId).emit("typingStatus", { typing });
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

const initializeDatabase = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log("Database synchronized");
    } catch (error) {
        console.error("Failed to synchronize database:", error);
    }
};
initializeDatabase();

server.listen(3005, () => {
    console.log("Server is running on http://localhost:3005");
});

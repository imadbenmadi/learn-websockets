const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws");
const app = express();

// Serve static files (for frontend)
app.use(express.static("public"));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const users = new Map(); // Store user connections

// Function to broadcast a message to all clients
const broadcast = (data) => {
    wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

wss.on("connection", (ws) => {
    console.log("New WebSocket connection established");

    // Handle incoming messages
    ws.on("message", (message) => {
        const parsedData = JSON.parse(message);

        switch (parsedData.type) {
            case "message":
                // Broadcast message to all clients
                broadcast({
                    type: "message",
                    user: parsedData.user,
                    content: parsedData.content,
                });
                break;

            case "notification":
                // Broadcast notification to all clients
                broadcast({
                    type: "notification",
                    notification: parsedData.notification,
                });
                break;

            case "register":
                // Register a user (for personal notifications)
                users.set(parsedData.userId, ws);
                break;

            default:
                console.log("Unknown message type");
        }
    });

    // Handle connection close
    ws.on("close", () => {
        console.log("Client disconnected");
        users.forEach((clientWs, userId) => {
            if (clientWs === ws) {
                users.delete(userId);
            }
        });
    });

    // Send welcome message
    ws.send(
        JSON.stringify({
            type: "message",
            user: "Server",
            content: "Welcome to the WebSocket server!",
        })
    );
});

server.listen(5000, () => {
    console.log("Server running on port 5000");
});

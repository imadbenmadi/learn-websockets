const express = require("express");
const fs = require("fs");
const path = require("path");
const http = require("http"); // Import HTTP module to create the server
const { WebSocketServer } = require("ws"); // Import WebSocketServer

const app = express();
app.use(express.static("public")); // Serve static files from public directory

// Video streaming route
app.get("/", (req, res) => {
    res.sendFile("hi");
});

// Create an HTTP server
const server = http.createServer(app);

// Initialize WebSocketServer
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
    console.log("New WebSocket connection");

    // Handle incoming WebSocket messages
    ws.on("message", (message) => {
        console.log(`Received message: ${message}`);
        ws.send(`You said: ${message}`);
    });

    // Send a welcome message when a client connects
    ws.send("Welcome to the WebSocket server!");

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});

// Start the HTTP server on a specific port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

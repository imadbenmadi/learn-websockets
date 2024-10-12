const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws"); // WebSocket Server from the ws library
const path = require("path");

const app = express();

// Serve the frontend (React app) from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Create an HTTP server
const server = http.createServer(app);

// Initialize WebSocket server
const wss = new WebSocketServer({ server });

let clients = [];

// Handle WebSocket connections
wss.on("connection", (ws) => {
    console.log("New WebSocket connection");

    // Add the new client to the list of clients
    clients.push(ws);

    // Send a welcome message to the new client
    ws.send("Welcome to the WebSocket server!");

    // Handle incoming messages from clients
    ws.on("message", (message) => {
        console.log(`Received message: ${message}`);

        // Broadcast the message to all connected clients
        clients.forEach((client) => {
            if (client.readyState === ws.OPEN) {
                client.send(`Client says: ${message}`);
            }
        });
    });

    // Handle client disconnection
    ws.on("close", () => {
        console.log("Client disconnected");
        // Remove the disconnected client from the list of clients
        clients = clients.filter((client) => client !== ws);
    });

    // Handle errors
    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

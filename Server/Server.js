const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { WebSocketServer } = require("ws");

const app = express();
app.use(express.json());

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5173/",
    "http://localhost:5174",
    "http://localhost:5174/",
];
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error(`Not allowed by CORS, origin: ${origin}`));
        }
    },
    optionsSuccessStatus: 200,
};
const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Credentials", true);
    }
    next();
};
require("dotenv").config();

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

//Add WebSocket server
const server = require("http").createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
    console.log("New WebSocket connection");

    // Handle incoming messages
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

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

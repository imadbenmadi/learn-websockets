import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
    const [messages, setMessages] = useState([]); // Store messages
    const [input, setInput] = useState(""); // Store the input message
    const ws = useRef(null); // WebSocket reference

    useEffect(() => {
        // Initialize WebSocket connection when the component mounts
        ws.current = new WebSocket("ws://localhost:5000");

        // Handle connection opening
        ws.current.onopen = () => {
            console.log("Connected to WebSocket server");
        };

        // Handle incoming messages
        ws.current.onmessage = (event) => {
            setMessages((prev) => [...prev, event.data]); // Append new message to the list
        };

        // Handle connection closing
        ws.current.onclose = () => {
            console.log("WebSocket connection closed");
        };

        // Handle errors
        ws.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        // Cleanup WebSocket connection when component unmounts
        return () => {
            ws.current.close();
        };
    }, []);

    // Function to send a message to the WebSocket server
    const sendMessage = () => {
        if (input && ws.current) {
            ws.current.send(input); // Send input to the WebSocket server
            setInput(""); // Clear the input field
        }
    };

    return (
        <div className="App">
            <h1>WebSocket Chat</h1>
            <div className="chat-box">
                <ul>
                    {messages.map((msg, index) => (
                        <li key={index}>{msg}</li>
                    ))}
                </ul>
            </div>
            <div className="input-area">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter message"
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}

export default App;

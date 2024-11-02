import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
    const [messages, setMessages] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [input, setInput] = useState("");
    const [userId] = useState(Math.random().toString(36).substring(7));
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket("ws://localhost:5000");

        ws.current.onopen = () => {
            console.log("Connected to WebSocket server");
            ws.current.send(
                JSON.stringify({ type: "register", userId: userId })
            );
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "message") {
                setMessages((prev) => [...prev, data]);
            }

            if (data.type === "notification") {
                setNotifications((prev) => [...prev, data.notification]);
            }
        };

        ws.current.onclose = () => {
            console.log("WebSocket connection closed");
        };

        ws.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => {
            ws.current.close();
        };
    }, [userId]);

    const sendMessage = () => {
        if (input && ws.current) {
            ws.current.send(
                JSON.stringify({
                    type: "message",
                    user: userId,
                    content: input,
                })
            );
            setInput("");
        }
    };

    const sendNotification = () => {
        if (ws.current) {
            ws.current.send(
                JSON.stringify({
                    type: "notification",
                    notification: "You have a new notification!",
                })
            );
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-4">
                <h1 className="text-2xl font-bold text-center mb-4">
                    WebSocket Chat & Notifications
                </h1>

                {/* Notification Section */}
                <div className="notification-box h-20 overflow-y-auto border border-gray-300 p-2 rounded-lg mb-4">
                    <h2 className="text-lg font-semibold">Notifications:</h2>
                    <ul className="space-y-1">
                        {notifications.map((note, index) => (
                            <li
                                key={index}
                                className="bg-yellow-200 p-2 rounded"
                            >
                                {note}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Chat Section */}
                <div className="chat-box h-64 overflow-y-auto border border-gray-300 p-2 rounded-lg mb-4">
                    <ul className="space-y-2">
                        {messages.map((msg, index) => (
                            <li
                                key={index}
                                className={`px-4 py-2 rounded-md text-white ${
                                    index % 2 === 0
                                        ? "bg-blue-500"
                                        : "bg-green-500"
                                }`}
                            >
                                {msg.user}: {msg.content}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Input Area */}
                <div className="input-area flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter message"
                        className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition duration-300"
                    >
                        Send Message
                    </button>
                </div>

                <div className="mt-4">
                    <button
                        onClick={sendNotification}
                        className="bg-yellow-500 text-white rounded-lg px-4 py-2 hover:bg-yellow-600 transition duration-300"
                    >
                        Send Notification
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;

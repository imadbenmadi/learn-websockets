// src/pages/ChatPage.js
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const ChatPage = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [chatRoomId, setChatRoomId] = useState(null);
    const socket = io("http://localhost:3005");

    useEffect(() => {
        // Join a chat room on load (e.g., room with ID 1)
        setChatRoomId(1);
        socket.emit("joinRoom", 1);

        // Listen for incoming messages
        socket.on("receiveMessage", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => socket.disconnect();
    }, [socket]);

    const sendMessage = () => {
        socket.emit("sendMessage", { content: message, chatRoomId });
        setMessage("");
    };

    return (
        <div className="p-6">
            <div className="h-64 overflow-y-auto mb-4">
                {messages.map((msg, index) => (
                    <div key={index} className="mb-2 p-2 bg-gray-100 rounded">
                        {msg.content}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="input w-full mb-2"
            />
            <button onClick={sendMessage} className="btn">
                Send
            </button>
        </div>
    );
};

export default ChatPage;

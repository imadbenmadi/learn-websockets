// src/components/ChatRoom.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api";
import io from "socket.io-client";

const socket = io("http://localhost:3005");

const ChatRoom = () => {
    const { chatUserId } = useParams();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        // Fetch previous messages when joining a chat room
        const fetchMessages = async () => {
            const response = await axios.get(
                `/chat-room/${chatUserId}/messages`
            );
            setMessages(response.data);
        };

        fetchMessages();
        socket.emit("joinRoom", chatUserId);

        socket.on("receiveMessage", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        socket.on("typingStatus", (status) => {
            setIsTyping(status.typing);
        });

        return () => socket.disconnect();
    }, [chatUserId]);

    const handleTyping = () => {
        socket.emit("typing", { chatRoomId: chatUserId, typing: true });
    };

    const sendMessage = () => {
        if (message.trim()) {
            socket.emit("sendMessage", {
                content: message,
                chatRoomId: chatUserId,
            });
            setMessage("");
            socket.emit("typing", { chatRoomId: chatUserId, typing: false });
        }
    };

    return (
        <div className="p-6">
            <div className="h-64 overflow-y-auto mb-4 border p-4">
                {messages.map((msg, index) => (
                    <div key={index} className="mb-2 p-2 bg-gray-100 rounded">
                        {msg.content}
                    </div>
                ))}
                {isTyping && (
                    <p className="italic text-gray-500">User is typing...</p>
                )}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onInput={handleTyping}
                onBlur={() =>
                    socket.emit("typing", {
                        chatRoomId: chatUserId,
                        typing: false,
                    })
                }
                placeholder="Type a message..."
                className="w-full p-2 border rounded mb-2"
            />
            <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Send
            </button>
        </div>
    );
};

export default ChatRoom;

// controllers/messageController.js
const Message = require("../models/Message");
const ChatRoom = require("../models/ChatRoom");

exports.sendMessage = async (req, res) => {
    const { content, senderId, receiverId, chatRoomId } = req.body;

    const message = await Message.create({
        content,
        senderId,
        receiverId,
        chatRoomId,
    });

    res.status(201).json(message);
};

exports.markAsRead = async (req, res) => {
    const { messageId } = req.params;
    const message = await Message.findByPk(messageId);

    if (!message) return res.status(404).json({ error: "Message not found" });

    message.read = true;
    await message.save();

    res.json({ message: "Message marked as read", message });
};

exports.getUnreadMessages = async (req, res) => {
    const { userId } = req.params;
    const unreadMessages = await Message.findAll({
        where: { receiverId: userId, read: false },
    });

    res.json(unreadMessages);
};

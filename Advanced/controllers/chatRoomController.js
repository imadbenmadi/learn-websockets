// controllers/chatRoomController.js
const ChatRoom = require("../models/ChatRoom");
const User = require("../models/User");

exports.getOrCreateChatRoom = async (req, res) => {
    const { user1Id, user2Id } = req.body;

    // Find an existing chat room between the two users
    let chatRoom = await ChatRoom.findOne({
        where: {
            user1Id,
            user2Id,
        },
    });

    // If it doesn’t exist, create it
    if (!chatRoom) {
        chatRoom = await ChatRoom.create({ user1Id, user2Id });
    }

    res.json(chatRoom);
};

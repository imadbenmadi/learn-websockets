// routes/chatRoutes.js
const express = require("express");
const {
    sendMessage,
    markAsRead,
    getUnreadMessages,
} = require("../controllers/messageController");
const { Message } = require("../models/Message");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
router.post("/send", sendMessage);
router.put("/read/:messageId", markAsRead);
router.get("/unread/:userId", getUnreadMessages);
router.get("/:chatRoomId/messages", async (req, res) => {
    const { chatRoomId } = req.params;
    const messages = await Message.findAll({
        where: { chatRoomId },
        order: [["createdAt", "ASC"]],
    });
    res.json(messages);
});
module.exports = router;

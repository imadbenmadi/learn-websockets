// routes/chatRoutes.js
const express = require("express");
const {
    sendMessage,
    markAsRead,
    getUnreadMessages,
} = require("../controllers/messageController");

const router = express.Router();

router.post("/send", sendMessage);
router.put("/read/:messageId", markAsRead);
router.get("/unread/:userId", getUnreadMessages);

module.exports = router;

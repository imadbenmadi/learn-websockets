// routes/chatRoomRoutes.js
const express = require("express");
const { getOrCreateChatRoom } = require("../controllers/chatRoomController");

const router = express.Router();

router.post("/", getOrCreateChatRoom);

module.exports = router;

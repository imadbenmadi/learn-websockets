// models/ChatRoom.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ChatRoom = sequelize.define("ChatRoom", {
    user1Id: { type: DataTypes.INTEGER, allowNull: false },
    user2Id: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = ChatRoom;

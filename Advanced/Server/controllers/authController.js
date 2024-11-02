// controllers/authController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Register a new user
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword });

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login a user and return a token
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findOne({ where: { username } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Create a JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ token, user: { id: user.id, username: user.username } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all users except the current logged-in user
exports.getUsers = async (req, res) => {
    try {
        const currentUserId = req.user.userId; // `req.user` populated by authentication middleware
        const users = await User.findAll({
            where: {
                id: { [Op.ne]: currentUserId },
            },
            attributes: ["id", "username"],
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

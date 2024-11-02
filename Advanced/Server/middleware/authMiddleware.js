// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

exports.authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access denied" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = user; // Attach decoded user info (userId) to request
        next();
    });
};

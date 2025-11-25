const jwt = require('jsonwebtoken');
const keys = require('./keys');
const User = require('../models/user.model');

module.exports = {
  isLoggedIn: async (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];

      if (!authHeader) {
        return res.status(403).json({ message: "No token provided" });
      }

      // Espera formato: "Bearer token"
      const token = authHeader.split(" ")[1];

      if (!token) {
        return res.status(403).json({ message: "Invalid token format" });
      }

      const decoded = jwt.verify(token, keys.secret);
      const user = await User.findById(decoded._id);

      if (!user) {
        return res.status(401).json({ message: "User does not exist" });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }
};

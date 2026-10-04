require("dotenv").config();
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.secretKey;

// Verifies the Bearer token (if any) and attaches the decoded payload to req.user.
const setUser = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  const token = authorizationHeader && authorizationHeader.split(" ")[1];

  if (!token || token === "null") {
    return next();
  }

  try {
    req.user = jwt.verify(token, SECRET_KEY);
  } catch (error) {
    req.user = undefined;
  }
  next();
};

const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not Logged In" });
  }
  next();
};

const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not Logged In" });
    }
    if (!roles.includes(req.user.adminType)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    next();
  };

module.exports = { setUser, requireAuth, requireRole };

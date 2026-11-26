
const express = require("express");
const router = express.Router();

// const chatbotController = require("../controllers/chatbotController");
const {
    getChatHistory,
    sendChatMessage,
    getAnalytics,
    getAllConversations,
    getConversationById
} = require("../controllers/chatbotController");

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.adminType)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource.",
      });
    }

    next();
  };
};

// Visitor APIs
router.get("/widget/history/", authorizeRoles("Admin1","Admin2"), getChatHistory);
router.post("/widget/chat", authorizeRoles("Admin1","Admin2"), sendChatMessage);

// Admin APIs
router.get("/analytics", authorizeRoles("Admin1"), getAnalytics);
router.get("/conversations", authorizeRoles("Admin1"), getAllConversations);
router.get("/conversations/:id", authorizeRoles("Admin1"), getConversationById);

module.exports = router;
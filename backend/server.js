require("dotenv").config();
const express = require("express");
const app = express();
const router = express.Router();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
// const Groq = require("groq-js");
const path = require("path");

const Admin = require("./models/admin");
const userRoutes = require("./routes/User");
const adminRoutes = require("./routes/Admin");
const eventRoutes = require("./routes/Event");
const connectDatabase = require("./database/conn");
const chatbotRoutes = require("./routes/Chatbot");
const config = require('./config/chatbotConfig');
const authMiddleware = require("./middleware/authMiddleware");


const CORS_URL = process.env.CORS_URL;
const port = process.env.PORT || 8000;

const moment = require("moment-timezone");
// Assuming you have the necessary imports and setup for the Event model

// Generate a secure secret key
// const secretKey = process.env.secretKey;


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use(bodyParser.json());

app.use(cors({ origin: CORS_URL, credentials: true }));

// Helmet sets secure HTTP headers.
// Since we are loading this chatbot as an iframe, we need to allow frame embedding.
app.use(helmet({
  contentSecurityPolicy: false, // Disabling strict CSP to allow flexible development and resource loading
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: false,
  frameguard: false // Essential: allows embedding the chat page in an iframe on user sites
}));

// Set up API rate limiting to protect backend resources
const chatbotLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', chatbotLimiter);


// Serve static assets from the public directory (for hosting widget.js)
app.use(express.static(path.join(__dirname, 'public')));

// router.get("/checkAuth", async (req, res) => {
// const authMiddleware = async (req, res) => {
//   console.log("/checkAuth");

//   // Retrieve the token from the Authorization header
//   const authorizationHeader = req.headers.authorization;

//   const token = authorizationHeader && authorizationHeader.split(" ")[1];

//   if (token === "null") {
//     return res.json({ success: false, message: "Not Logged In" });
//   }
//   else {
//     const decodedToken = jwt.decode(token);
//     const adminType = decodedToken.adminType;
//     const adminEmail = decodedToken.email;
//     const admin = Admin.findOne({ email: adminEmail });
//     if (!admin) {
//       return res.json({ success: false, message: "User Not found" });
//     }
//     // Attach authenticated admin information to request
//     req.admin = admin;
//     req.adminType = adminType;

//     return res.json({
//       success: true,
//       adminType: adminType,
//       message: "Already Logged In",
//     });
//   }
// };
router.get("/checkAuth", authMiddleware, (req, res) => {
  return res.json({
    success: true,
    adminType: req.adminType,
    message: "Already Logged In",
  });
});

//Setting up routes
app.use(userRoutes);
app.use(eventRoutes);
app.use(adminRoutes);
app.use(router);
// Chatbot routes
app.use("/api", authMiddleware, chatbotRoutes);

// Start the server
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();

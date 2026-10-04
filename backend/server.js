const express = require("express");
const app = express();
const router = express.Router();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Admin = require("./models/admin");
const userRoutes = require("./routes/User");
const adminRoutes = require("./routes/Admin");
const eventRoutes = require("./routes/Event");
const connectDatabase = require("./database/conn");
const rateLimiter = require("./middleware/rateLimiter");
const { setUser } = require("./middleware/auth");

require("dotenv").config();

const CORS_URL = process.env.CORS_URL;
const port = process.env.PORT || 8000;

const moment = require("moment-timezone");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({ origin: CORS_URL, credentials: true }));
app.use(setUser);
app.use(rateLimiter);

router.get("/checkAuth", async (req, res) => {
  try {
    if (!req.user) {
      return res.json({ success: false, message: "Not Logged In" });
    }

    const admin = await Admin.findOne({ email: req.user.email });

    if (!admin) {
      return res.json({ success: false, message: "User Not found" });
    }

    return res.json({
      success: true,
      adminType: admin.adminType,
      message: "Already Logged In",
    });
  } catch (error) {
    console.error("Error in /checkAuth:", error.message);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

// const setUser = (req,res,next)=>{
//     try{
//           console.log("/checkAuth");
//       // Retrieve the token from the Authorization header
//       const authorizationHeader = req.headers.authorization;

//       const token = authorizationHeader && authorizationHeader.split(" ")[1];
//       if (!token || token === "null") {
//         return next();
//         // return res.json({ success: false, message: "Not Logged In" });
//       }
//       else {
//         const decodedToken = jwt.decode(token);
//         const adminType = decodedToken.adminType;
//         const adminEmail = decodedToken.email;
//         req.user = decodedToken; // Attach the decoded token to the request object
//         console.log("set req.user ", req.user);
//         const admin = Admin.findOne({ email: adminEmail });
//         if (!admin) {
//           return res.json({ success: false, message: "User Not found" });
//         }
//         return res.json({
//           success: true,
//           adminType: adminType,
//           message: "Already Logged In",
//         });
//       }
//         next();
//     }
//     catch(error){
//         console.log("JWT error:",error.message);
//         next();
//     }
// };

// router.get("/checkAuth", setUser, rateLimiter, async (req, res) => {
//   // console.log("/checkAuth");

//   // // Retrieve the token from the Authorization header
//   // const authorizationHeader = req.headers.authorization;

//   // const token = authorizationHeader && authorizationHeader.split(" ")[1];

//   // if (!token || token === "null") {
//   //   return res.json({ success: false, message: "Not Logged In" });
//   // }
//   // else {
//   //   const decodedToken = jwt.decode(token);
//   //   const adminType = decodedToken.adminType;
//   //   const adminEmail = decodedToken.email;
//   //   req.user = decodedToken; // Attach the decoded token to the request object
//   //   console.log("set req.user ", req.user);
//   //   const admin = Admin.findOne({ email: adminEmail });
//   //   if (!admin) {
//   //     return res.json({ success: false, message: "User Not found" });
//   //   }
//   //   return res.json({
//   //     success: true,
//   //     adminType: adminType,
//   //     message: "Already Logged In",
//   //   });
//   // }
// });


//Setting up routes
app.use(userRoutes);
app.use(eventRoutes);
app.use(adminRoutes);
app.use(router);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

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

const setUser = (req,res,next)=>{

    try{

        console.log("setUser middleware");


        const authorizationHeader = req.headers.authorization;

        const token = authorizationHeader && authorizationHeader.split(" ")[1];


        if (!token || token === "null") {

            return next();

        }


        const decodedToken = jwt.decode(token);


        req.user = decodedToken;


        console.log("set req.user:", req.user);


        next();


    }
    catch(error){

        console.log("JWT error:", error.message);

        next();

    }

};
router.get(
"/checkAuth",
setUser,
rateLimiter,
async(req,res)=>{


    console.log("/checkAuth controller");


    if(!req.user){

        return res.json({
            success:false,
            message:"Not Logged In"
        });

    }


    const adminType = req.user.adminType;
    const adminEmail = req.user.email;


    const admin = await Admin.findOne({
        email:adminEmail
    });


    if(!admin){

        return res.json({
            success:false,
            message:"User Not found"
        });

    }


    return res.json({

        success:true,
        adminType,
        message:"Already Logged In"

    });


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
// app.use(rateLimiter);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

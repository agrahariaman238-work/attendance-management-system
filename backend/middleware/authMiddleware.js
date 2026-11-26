const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

const authMiddleware = async (req, res,next) => {
  console.log("/checkAuth");
  try{
  // Retrieve the token from the Authorization header
  const authorizationHeader = req.headers.authorization;

  const token = authorizationHeader && authorizationHeader.split(" ")[1];

  if (token === "null") {
    return res.json({ success: false, message: "Not Logged In" });
  }
  else {
    // const decodedToken = jwt.decode(token);
    const decodedToken = jwt.verify(token, process.env.secretKey);
    const adminType = decodedToken.adminType;
    const adminEmail = decodedToken.email;
    const admin = await Admin.findOne({ email: adminEmail });
    if (!admin) {
      return res.json({ success: false, message: "User Not found" });
    }
    // Attach authenticated admin information to request
    req.admin = admin;
    req.adminType = adminType;
    next(); // Call next() to proceed to the next middleware or route handler

    // return res.json({
    //   success: true,
    //   adminType: adminType,
    //   message: "Already Logged In",
    // });
  }
}
   catch (error) {
    console.error("Authentication error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;
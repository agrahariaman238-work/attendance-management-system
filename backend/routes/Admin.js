// Import the required modules
const express = require("express")
const router = express.Router()

//Import Controllers
const {
    addAdmin,
    showAdmins,
    updateAdmin,
    deleteAdmin,
    takeAttendance,
    deleteAttendance,
    login,
    sendotp,
    checkOTP
} = require("../controllers/Admin")

const authMiddleware = require("../middleware/authMiddleware");

const authorizeRoles = (...roles) => (req, res, next) => {
    if (!roles.includes(req.admin.adminType)) {
        return res.status(403).json({
            success: false,
            message: "You do not have permission to perform this action."
        });
    }
    next();
};

//Route for login
router.post("/login", login);

// Rouote for sendotp
router.post("/sendotp", sendotp);

// Rouote for sendotp
router.post("/checkOTP", checkOTP);

//Route for create an admin
router.post("/addAdmin", authMiddleware, authorizeRoles("Admin1"), addAdmin)

//Route to show the admin
router.get("/showAdmins", authMiddleware, authorizeRoles("Admin1"), showAdmins)

//Route to update the admin
router.put("/updateAdmin/:id", authMiddleware, authorizeRoles("Admin1"), updateAdmin)

//Route to delete the admin
router.delete("/deleteAdmin/:id", authMiddleware, authorizeRoles("Admin1"), deleteAdmin)

//Route to take attendance
router.post("/takeAttendance", authMiddleware, authorizeRoles("Admin1","Admin2"), takeAttendance)  

//Route to delete attendance
router.post("/deleteAttendance", authMiddleware, authorizeRoles("Admin1","Admin2"),deleteAttendance)


module.exports = router
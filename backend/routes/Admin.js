// Import the required modules
const express = require("express")
const router = express.Router()
const { requireAuth, requireRole } = require("../middleware/auth")
const { authRateLimiter } = require("../middleware/rateLimiter")

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


//Route for login
router.post("/login", authRateLimiter, login);

// Rouote for sendotp
router.post("/sendotp", authRateLimiter, sendotp);

// Rouote for sendotp
router.post("/checkOTP", authRateLimiter, checkOTP);

//Route for create an admin
router.post("/addAdmin", requireRole("Admin1"), addAdmin)

//Route to show the admin
router.get("/showAdmins", requireRole("Admin1"), showAdmins)

//Route to update the admin
router.put("/updateAdmin/:id", requireRole("Admin1"), updateAdmin)

//Route to delete the admin
router.delete("/deleteAdmin/:id", requireRole("Admin1"), deleteAdmin)

//Route to take attendance
router.post("/takeAttendance", requireAuth, takeAttendance)  

//Route to delete attendance
router.post("/deleteAttendance", requireAuth, deleteAttendance)


module.exports = router

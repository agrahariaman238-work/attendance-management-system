// Import the required modules
const express = require("express")
const router = express.Router()

//Import Controllers
const {
    addUser,
    showUsers,
    updateUser,
    deleteUser
} = require("../controllers/User")

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

//Route for create a user
router.post("/addUser", authMiddleware, authorizeRoles("Admin1"), addUser)

//Route to show the user
router.get("/showUsers", authMiddleware, authorizeRoles("Admin1","Admin2"),showUsers)

//Route to update the user
router.put("/updateUser/:id", authMiddleware, authorizeRoles("Admin1"),updateUser)

//Route to delete the user
router.delete("/deleteUser/:id", authMiddleware, authorizeRoles("Admin1"),deleteUser)

module.exports = router
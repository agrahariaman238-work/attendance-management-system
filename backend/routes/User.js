// Import the required modules
const express = require("express")
const router = express.Router()
const { requireAuth, requireRole } = require("../middleware/auth")

//Import Controllers
const {
    addUser,
    showUsers,
    updateUser,
    deleteUser
} = require("../controllers/User")


//Route for create a user
router.post("/addUser", requireRole("Admin1"), addUser)

//Route to show the user
router.get("/showUsers", requireAuth, showUsers)

//Route to update the user
router.put("/updateUser/:id", requireRole("Admin1"), updateUser)

//Route to delete the user
router.delete("/deleteUser/:id", requireRole("Admin1"), deleteUser)

module.exports = router

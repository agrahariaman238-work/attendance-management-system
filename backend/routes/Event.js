// Import the required modules
const express = require("express")
const router = express.Router()
const { requireAuth, requireRole } = require("../middleware/auth")

//Import the Controllers

const {
    addEvent,
    showEvents,
    updateEvent,
    deleteEvent
} = require("../controllers/Event")

//Route for creation of an event
router.post("/addEvent", requireRole("Admin1"), addEvent)

//Route to show all events
router.get("/showEvents", requireAuth, showEvents)

//Route to update an event
router.put("/updateEvent/:id", requireRole("Admin1"), updateEvent)

//Route for deletion of an event
router.delete("/deleteEvent/:id", requireRole("Admin1"), deleteEvent)

module.exports = router

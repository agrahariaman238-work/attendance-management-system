
const express = require("express");
const router = express.Router();

const {
    addEvent,
    showEvents,
    updateEvent,
    deleteEvent
} = require("../controllers/Event");

const authMiddleware = require("../middleware/authMiddleware");

// Role-based authorization
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.adminType)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action."
            });
        }

        next();
    };
};

// Both Admin1 and Admin2 can view events
router.get(
    "/showEvents",
    authMiddleware,
    authorizeRoles("Admin1", "Admin2"),
    showEvents
);

// Only Admin1 can manage events
router.post(
    "/addEvent",
    authMiddleware,
    authorizeRoles("Admin1"),
    addEvent
);

router.put(
    "/updateEvent/:id",
    authMiddleware,
    authorizeRoles("Admin1"),
    updateEvent
);

router.delete(
    "/deleteEvent/:id",
    authMiddleware,
    authorizeRoles("Admin1"),
    deleteEvent
);

module.exports = router;


// // Import the required modules
// const express = require("express")
// const router = express.Router()

// //Import the Controllers

// const {
//     addEvent,
//     showEvents,
//     updateEvent,
//     deleteEvent
// } = require("../controllers/Event")

// //Route for creation of an event
// router.post("/addEvent",addEvent)

// //Route to show all events
// router.get("/showEvents",showEvents)

// //Route to update an event
// router.put("/updateEvent/:id",updateEvent)

// //Route for deletion of an event
// router.delete("/deleteEvent/:id",deleteEvent)

// module.exports = router
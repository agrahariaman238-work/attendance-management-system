
const User = require("../models/user");
const Event = require("../models/event");

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

async function getMemberCount() {
  return User.countDocuments();
}

async function searchMembers({ search }, adminType) {
  if (!search || typeof search !== "string" || !search.trim()) {
    throw new Error("Please provide a member name or registration number.");
  }

  const searchRegex = new RegExp(escapeRegex(search.trim()), "i");

  const projection =
    adminType === "Admin2"
      ? "name registrationNumber branch year"
      : "name registrationNumber course branch year";

  return User.find({
    $or: [
      { name: searchRegex },
      { registrationNumber: searchRegex },
    ],
  })
    .select(projection)
    .limit(20)
    .lean();
}

async function getUpcomingEvents() {
  const now = new Date();

  return Event.find({
    startDate: { $gt: now },
  })
    .select("eventName startDate endDate")
    .sort({ startDate: 1 })
    .lean();
}

async function getCurrentEvents() {
  const now = new Date();

  return Event.find({
    startDate: { $lte: now },
    endDate: { $gte: now },
  })
    .select("eventName startDate endDate")
    .sort({ startDate: 1 })
    .lean();
}

async function getPastEvents() {
  return Event.find({
    endDate: { $lt: new Date() },
  })
    .select("eventName startDate endDate")
    .sort({ startDate: -1 })
    .lean();
}

async function getEventAttendance({ eventName }, adminType) {
  if (!eventName || typeof eventName !== "string") {
    throw new Error("Please provide an event name.");
  }

  const event = await Event.findOne({
    eventName: {
      $regex: `^${escapeRegex(eventName.trim())}$`,
      $options: "i",
    },
  }).lean();

  if (!event) {
    throw new Error("Event not found.");
  }

  const users = await User.find()
    .select("name registrationNumber branch year course events")
    .lean();

  const members = users.map((user) => {
    const member = {
      name: user.name,
      registrationNumber: user.registrationNumber,
      branch: user.branch,
      year: user.year,
      status: user.events?.includes(event.eventName)
        ? "Present"
        : "Absent",
    };

    // Course is visible to Admin1 only.
    if (adminType === "Admin1") {
      member.course = user.course;
    }

    return member;
  });

  const present = members.filter(
    (member) => member.status === "Present"
  ).length;

  return {
    eventName: event.eventName,
    eventStatus:
      event.endDate < new Date()
        ? "Past"
        : event.startDate > new Date()
        ? "Upcoming"
        : "Current",
    totalMembers: members.length,
    present,
    absent: members.length - present,
    members,
  };
}
async function getAllEventsAttendance() {
  const [totalMembers, attendanceCounts, events] = await Promise.all([
    User.countDocuments(),

    User.aggregate([
      { $unwind: "$events" },
      {
        $group: {
          _id: "$events",
          present: { $sum: 1 },
        },
      },
    ]),

    Event.find()
      .select("eventName startDate endDate")
      .sort({ startDate: -1 })
      .lean(),
  ]);

  const attendanceMap = new Map(
    attendanceCounts.map((item) => [item._id, item.present])
  );

  return events.map((event) => {
    const present = attendanceMap.get(event.eventName) || 0;
    const absent = totalMembers - present;

    return {
      eventName: event.eventName,
      totalMembers,
      present,
      absent,
      attendancePercentage:
        totalMembers > 0
          ? Number(((present / totalMembers) * 100).toFixed(2))
          : 0,
    };
  });
}

module.exports = {
  getMemberCount,
  searchMembers,
  getUpcomingEvents,
  getCurrentEvents,
  getPastEvents,
  getEventAttendance,
  getAllEventsAttendance
};


// const User = require("../models/user");
// const Event = require("../models/event");

// async function getMemberCount() {
//   return await User.countDocuments();
// }

// async function searchMembers({ search }) {
//   return await User.find({
//     $or: [
//       { name: { $regex: search, $options: "i" } },
//       { registrationNumber: { $regex: search, $options: "i" } },
//     ],
//   })
//     .select("name registrationNumber course branch year")
//     .limit(20)
//     .lean();
// }

// async function getActiveEvents() {
//   return await Event.find({
//     endDate: { $gte: new Date() },
//   })
//     .select("eventName startDate endDate")
//     .sort({ startDate: 1 })
//     .lean();
// }

// async function getEventAttendance({ eventName }) {
//   const event = await Event.findOne({ eventName }).lean();

//   if (!event) {
//     throw new Error("Event not found.");
//   }

//   const users = await User.find()
//     .select("name registrationNumber course branch year events")
//     .lean();

//   const attendance = users.map((user) => ({
//     name: user.name,
//     registrationNumber: user.registrationNumber,
//     course: user.course,
//     branch: user.branch,
//     year: user.year,
//     status: user.events?.includes(eventName) ? "Present" : "Absent",
//   }));

//   const present = attendance.filter(
//     (member) => member.status === "Present"
//   ).length;

//   return {
//     eventName,
//     totalMembers: attendance.length,
//     present,
//     absent: attendance.length - present,
//     members: attendance,
//   };
// }

// module.exports = {
//   getMemberCount,
//   searchMembers,
//   getActiveEvents,
//   getEventAttendance,
// };
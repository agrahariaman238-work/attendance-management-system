
const chatbotTools = require("./chatbotTools");

async function executeChatbotTool(adminType, toolName, args) {
  const allowedTools = {
        Admin1: [
    "get_member_count",
    "search_members",
    "get_upcoming_events",
    "get_current_events",
    "get_past_events",
    "get_event_attendance",
    "get_all_events_attendance",
    ],

    Admin2: [
    "search_members",
    "get_upcoming_events",
    "get_current_events",
    "get_past_events",
    "get_event_attendance",
    "get_all_events_attendance",
    ],
  };

  if (!allowedTools[adminType]?.includes(toolName)) {
    throw new Error("You do not have permission to perform this operation.");
  }

  const handlers = {
    get_member_count: chatbotTools.getMemberCount,
    search_members: (args) =>
      chatbotTools.searchMembers(args, adminType),
    get_upcoming_events: chatbotTools.getUpcomingEvents,
    get_current_events: chatbotTools.getCurrentEvents,
    get_past_events: chatbotTools.getPastEvents,
    get_event_attendance: (args) =>
      chatbotTools.getEventAttendance(args, adminType),
    get_all_events_attendance: () =>
    chatbotTools.getAllEventsAttendance()
  };

  const handler = handlers[toolName];

  if (!handler) {
    throw new Error("Unknown chatbot tool.");
  }

  return handler(args);
}

module.exports = { executeChatbotTool };



// const chatbotTools = require("./chatbotTools");

// async function executeChatbotTool(adminType, toolName, args) {
//   const allowedTools = {
//     Admin1: [
//       "get_member_count",
//       "search_members",
//       "get_active_events",
//       "get_event_attendance",
//     ],

//     Admin2: [
//       "get_member_count",
//       "search_members",
//       "get_active_events",
//       "get_event_attendance",
//     ],
//   };

//   if (!allowedTools[adminType]?.includes(toolName)) {
//     throw new Error("You do not have permission to perform this operation.");
//   }

//   const handlers = {
//     get_member_count: chatbotTools.getMemberCount,
//     search_members: chatbotTools.searchMembers,
//     get_active_events: chatbotTools.getActiveEvents,
//     get_event_attendance: chatbotTools.getEventAttendance,
//   };

//   const handler = handlers[toolName];

//   if (!handler) {
//     throw new Error("Unknown chatbot tool.");
//   }

//   return await handler(args);
// }

// module.exports = { executeChatbotTool };
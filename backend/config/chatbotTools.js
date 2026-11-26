
const getMemberCountTool = {
  type: "function",
  function: {
    name: "get_member_count",
    description: "Get the total number of registered NSS members.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
};

const searchMembersTool = {
  type: "function",
  function: {
    name: "search_members",
    description: "Search members by name or registration number. Return only fields permitted for the authenticated role.",
    parameters: {
      type: "object",
      properties: {
        search: {
          type: "string",
          description: "Member name or registration number",
        },
      },
      required: ["search"],
    },
  },
};

const getUpcomingEventsTool = {
  type: "function",
  function: {
    name: "get_upcoming_events",
    description: "Get events that have not started yet.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
};

const getCurrentEventsTool = {
  type: "function",
  function: {
    name: "get_current_events",
    description: "Get events currently in progress.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
};

const getPastEventsTool = {
  type: "function",
  function: {
    name: "get_past_events",
    description: "Get events that have already ended.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
};

const getEventAttendanceTool = {
  type: "function",
  function: {
    name: "get_event_attendance",
    description: "Get attendance summary and permitted member attendance details for an event.",
    parameters: {
      type: "object",
      properties: {
        eventName: {
          type: "string",
          description: "Event name",
        },
      },
      required: ["eventName"],
    },
  },
};

const getAllEventsAttendanceTool = {
  type: "function",
  function: {
    name: "get_all_events_attendance",
    description:
      "Get an attendance summary for every event, including event name, total members, present count, absent count, and attendance percentage.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
};

const commonTools = [
  searchMembersTool,
  getUpcomingEventsTool,
  getCurrentEventsTool,
  getPastEventsTool,
  getEventAttendanceTool,
  getAllEventsAttendanceTool,
];

module.exports = {
  Admin1Tools: [
    getMemberCountTool,
    ...commonTools,
  ],

  Admin2Tools: commonTools,
};


// const readTools = [
//   {
//     type: "function",
//     function: {
//       name: "get_member_count",
//       description: "Get the total number of registered NSS members.",
//       parameters: {
//         type: "object",
//         properties: {},
//         required: [],
//       },
//     },
//   },
//   {
//     type: "function",
//     function: {
//       name: "search_members",
//       description: "Search NSS members by name or registration number.",
//       parameters: {
//         type: "object",
//         properties: {
//           search: {
//             type: "string",
//             description: "Member name or registration number",
//           },
//         },
//         required: ["search"],
//       },
//     },
//   },
//   {
//     type: "function",
//     function: {
//       name: "get_active_events",
//       description: "Get all running and upcoming NSS events.",
//       parameters: {
//         type: "object",
//         properties: {},
//         required: [],
//       },
//     },
//   },
//   {
//     type: "function",
//     function: {
//       name: "get_event_attendance",
//       description: "Get attendance summary and member attendance for an event.",
//       parameters: {
//         type: "object",
//         properties: {
//           eventName: {
//             type: "string",
//             description: "Exact event name",
//           },
//         },
//         required: ["eventName"],
//       },
//     },
//   },
// ];

// module.exports = {
//   Admin1Tools: readTools,
//   Admin2Tools: readTools,
// };
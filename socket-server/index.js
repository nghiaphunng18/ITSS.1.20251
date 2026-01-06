const { Server } = require("socket.io");

const io = new Server(3001, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

console.log("Socket Server is running on port 3001");

// save classroom state
// structure: { activeCheckpoint: object, deadline: number }
const sessions = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join
  socket.on("JOIN_SESSION", ({ sessionId, userId, role }) => {
    socket.join(sessionId);
    console.log(`User ${userId} (${role}) joined session ${sessionId}`);

    // have any questions, send them to the new member immediately
    // include a deadline to calculate remaining time
    if (sessions[sessionId]?.activeCheckpoint) {
      socket.emit("SYNC_CURRENT_CHECKPOINT", {
        checkpoint: sessions[sessionId].activeCheckpoint,
        deadline: sessions[sessionId].deadline, // send saved deadline
      });
    }
  });

  // teacher opens questions (additional deadline applies)
  socket.on(
    "TEACHER_TRIGGER_CHECKPOINT",
    ({ sessionId, checkpointData, deadline }) => {
      console.log(
        `Session ${sessionId}: Start CP ${checkpointData.id} until ${deadline}`
      );

      // save both the question and the end time
      if (!sessions[sessionId]) sessions[sessionId] = {};
      sessions[sessionId].activeCheckpoint = checkpointData;
      sessions[sessionId].deadline = deadline;

      // to the students: both the data and the deadline.
      socket.to(sessionId).emit("NEW_CHECKPOINT_STARTED", {
        checkpoint: checkpointData,
        deadline: deadline,
      });
    }
  );

  // teacher stopped asking the question.
  socket.on("TEACHER_STOP_CHECKPOINT", ({ sessionId }) => {
    if (sessions[sessionId]) {
      sessions[sessionId].activeCheckpoint = null;
      sessions[sessionId].deadline = null;
    }
    socket.to(sessionId).emit("CHECKPOINT_STOPPED");
  });

  // students submit their assignments.
  socket.on(
    "STUDENT_SUBMIT_ANSWER",
    ({ sessionId, checkpointId, answerData }) => {
      socket.to(sessionId).emit("LIVE_STAT_UPDATE", {
        checkpointId,
        answerData,
      });
    }
  );

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

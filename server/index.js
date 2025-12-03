const channelRoute = require("./routes/channels");
const messageRoute = require("./routes/messages");
const Message = require("./models/Message"); // <--- Add this line
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const { Server } = require("socket.io"); // Import Socket.io
const http = require("http"); // Import HTTP module

dotenv.config();

// 1. Setup Express
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/channels", channelRoute);
// 2. Connect to Database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);
// 3. Create HTTP Server (Needed for Socket.io)
const server = http.createServer(app);

// 4. Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // Allow connection from Frontend
    methods: ["GET", "POST"],
  },
});

// Global variable to store online users
let onlineUsers = [];

io.on("connection", (socket) => {
  console.log(`⚡: User Connected: ${socket.id}`);

  // A. NEW: User "Logs In" (Add to Online List)
  socket.on("add_user", (userId) => {
    // Only add if not already in the list to avoid duplicates
    if (!onlineUsers.some((user) => user.userId === userId)) {
      onlineUsers.push({ userId, socketId: socket.id });
    }
    console.log("Online Users:", onlineUsers);
    // Send the updated list to EVERYONE
    io.emit("get_users", onlineUsers);
  });

  // B. User Joins Channel
  socket.on("join_channel", (channel) => {
    socket.join(channel);
  });

  // C. Send Message
  socket.on("send_message", async (data) => {
    try {
      const newMessage = new Message({
        sender: data.author,
        channel: data.channel,
        content: data.message,
        timestamp: data.time
      });
      await newMessage.save();
      socket.to(data.channel).emit("receive_message", data);
    } catch (err) {
      console.log(err);
    }
  });

  // D. NEW: User Disconnects (Remove from List)
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("get_users", onlineUsers); // Update everyone else
    console.log("🔥: User Disconnected");
  });
});
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);

// Add CORS configuration to Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  
  // Send a welcome message to the newly connected user
  //socket.emit("message", "Welcome to the chat!");
  
  socket.on("message", (data) => {
    console.log("Message received:", data);
    io.emit("message", data); // Send message to all users
  });
  
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

const PORT = 75;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});





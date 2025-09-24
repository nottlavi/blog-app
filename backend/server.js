const express = require("express");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const { connect } = require("./config/database");
const blogRoutes = require("./routes/blogRoutes");
const replyRoutes = require("./routes/replyRoutes");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT;

const allowedOrigins = [
  "http://localhost:3000",
  "https://blog-app-mu-green.vercel.app",
];

// CORS middleware must come before routes
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // explicitly allow these
    allowedHeaders: ["Content-Type", "Authorization"], // allow headers used in requests
  })
);

// Handle preflight requests for all routes
app.options("*", cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

connect();

app.get("/", (req, res) => {
  res.send("backend is up and running, make sure db is also running");
});

app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/reply", replyRoutes);

app.listen(PORT, () => {
  console.log("server started on port: ", PORT);
});
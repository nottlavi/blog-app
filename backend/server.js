const express = require("express");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const { connect } = require("./config/database");
const blogRoutes = require("./routes/blogRoutes");
const replyRoutes = require("./routes/replyRoutes");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ CORS setup: only allow your frontend
app.use(
  cors({
    origin: "https://blog-app-mu-green.vercel.app",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// ✅ Wait for DB connection before starting server
connect().then(() => {
  app.get("/", (req, res) => {
    res.send("backend is up and running, DB connected ✅");
  });

  app.use("/api/v1/blog", blogRoutes);
  app.use("/api/v1/user", userRoutes);
  app.use("/api/v1/reply", replyRoutes);

  app.listen(PORT, () => {
    console.log(`🚀 Server started on port: ${PORT}`);
  });
});

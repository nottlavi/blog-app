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
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

connect();

app.get("/", (req, res) => {
  res.send("backend is up and running, make sure db is also running");
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/reply", replyRoutes)

app.listen(PORT, () => {
  console.log("server started on port: ", PORT);
});

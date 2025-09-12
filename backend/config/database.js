const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log("connection to db established"))
    .catch((err) => console.log(err.message));
};

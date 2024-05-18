const express = require("express");
const connectDB = require("./config/db");

require("dotenv").config();
const app = express();
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("hello world");
});
app.use("/api", require("./Routes/Display"));

app.listen(8008);

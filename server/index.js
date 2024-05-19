const express = require("express");
const connectDB = require("./config/db");

require("dotenv").config();
const app = express();
app.use(express.json());

connectDB();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  next();
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});
app.use("/api", require("./Routes/Display"));

app.listen(8008);

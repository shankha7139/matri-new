const express = require("express");
const connectDB = require("./config/db");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const User = require("./Models/UserModel");

require("dotenv").config();
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

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

app.post('/api/user/profile', upload.array('photos', 10), async (req, res) => { 
  const { name, age, number, email, religion, motherTongue, sex, profession } = req.body;

  if (!name || !age || !number || !email || !religion || !motherTongue || !sex || !profession) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const newUser = new User({
      name,
      age,
      number,
      email,
      religion,
      motherTongue,
      sex,
      profession,
      photos: req.files.map(file => file.path) 
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: 'Profile submitted successfully.', userId: savedUser._id });
  } catch (err) {
    console.error('Error submitting profile:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// app.use("/api/user", require("./Routes/UserRoute"));
app.use("/api", require("./Routes/Display"));

app.listen(8008);

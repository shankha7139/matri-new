const express = require("express");
const connectDB = require("./config/db");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const User = require("./Models/UserModel");
const cloudinary = require("./Cloudinary");
const fs = require("fs");

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

app.post("/api/user/profile", upload.array("photos", 10), async (req, res) => {
  const {
    name,
    age,
    number,
    email,
    religion,
    motherTongue,
    sex,
    profession,
    chatId,
    description,
  } = req.body;

  if (
    !name ||
    !age ||
    !number ||
    !email ||
    !religion ||
    !motherTongue ||
    !sex ||
    !profession ||
    !chatId
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Upload images to Cloudinary
    const uploadPromises = req.files.map((file) =>
      cloudinary.uploader.upload(file.path)
    );
    const uploadedImages = await Promise.all(uploadPromises);

    // Delete local files after upload
    req.files.forEach((file) => fs.unlinkSync(file.path));

    const newUser = new User({
      name,
      chatId,
      age,
      number,
      email,
      religion,
      motherTongue,
      sex,
      profession,
      description,
      photos: uploadedImages.map((img) => img.secure_url), // Store image URLs
    });

    const savedUser = await newUser.save();
    res.status(201).json({
      message: "Profile submitted successfully.",
      userId: savedUser._id,
    });
  } catch (err) {
    console.error("Error submitting profile:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.post("/api/matriData", (req, res) => {
  try {
    res.send([global.testuser]);
  } catch (error) {
    console.error(error.message);
    res.send("server error");
  }
});

app.listen(8008);

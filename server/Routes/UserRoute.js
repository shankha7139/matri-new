const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const User = require("./models/User"); // Adjust the path as necessary

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.post("/api/profile", upload.array("photos", 10), async (req, res) => {
  // allow up to 10 photos
  const { name, age, number, email, religion, motherTongue, sex, profession } =
    req.body;

  if (
    !name ||
    !age ||
    !number ||
    !email ||
    !religion ||
    !motherTongue ||
    !sex ||
    !profession
  ) {
    return res.status(400).json({ error: "All fields are required." });
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
      photos: req.files.map((file) => file.path), // store file paths
    });

    const savedUser = await newUser.save();
    res
      .status(201)
      .json({
        message: "Profile submitted successfully.",
        userId: savedUser._id,
      });
  } catch (err) {
    console.error("Error submitting profile:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// const express = require("express");
// const router = express.Router();
// const User = require("../Models/UserModel");

// router.post("/profile", async (req, res) => {
//   try {
//     const { name, sex, mtongue, prof, desc, phone, reli } = req.body;
//     console.log(name);
//     const user = await User.create({
//       name,
//       sex,
//       mtongue,
//       prof,
//       desc,
//       phone,
//       reli,
//     });
//     if (user) {
//       res.status(200).json({
//         _id: user.id,
//         name: user.name,
//       });
//     } else {
//       res.status(400);
//       throw new Error("Failed to create the user");
//     }
//   } catch (err) {
//     console.log(err);
//     res.json({ success: false });
//   }
// });

// module.exports = router;

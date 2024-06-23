const express = require("express");
const connectDB = require("./config/db");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const User = require("./Models/UserModel");
const cloudinary = require("./Cloudinary");
const fs = require("fs");
const axios = require("axios");

require("dotenv").config();
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, "public")));

connectDB();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage
});

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

app.post("/api/generate-captcha", async (req, res) => {
  const captchaUrl =
    "https://tathya.uidai.gov.in/audioCaptchaService/api/captcha/v3/generation";
  const captchaHeaders = {
    Accept: "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
    Connection: "keep-alive",
    "Content-Type": "application/json",
    Origin: "https://myaadhaar.uidai.gov.in",
    Referer: "https://myaadhaar.uidai.gov.in/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-site",
  };
  const captchaData = {
    captchaLength: "6",
    captchaType: "2",
    audioCaptchaRequired: true,
  };

  try {
    console.log("Sending request to UIDAI API...");
    const response = await axios.post(captchaUrl, captchaData, {
      headers: captchaHeaders,
    });
    console.log("Response received:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error details:",
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .json({
        error: "Failed to generate captcha",
        details: error.message
      });
  }
});
app.post("/api/verify-aadhaar", async (req, res) => {
  const {
    aadhaar_number,
    transaction_id,
    captcha
  } = req.body;
  const verifyUidUrl =
    "https://tathya.uidai.gov.in/uidVerifyRetrieveService/api/verifyUID";
  const verifyUidHeaders = {
    Accept: "application/json, text/plain, */*",
    "Accept-Language": "verifyAadhaar_IN",
    Connection: "keep-alive",
    "Content-Type": "application/json",
    Origin: "https://myaadhaar.uidai.gov.in",
    Referer: "https://myaadhaar.uidai.gov.in/",
    "User-Agent": "Mozilla/5.0",
  };
  const verifyUidData = {
    uid: aadhaar_number,
    captchaTxnId: transaction_id,
    captcha: captcha,
    transactionId: transaction_id,
    captchaLogic: "V3",
  };

  try {
    const response = await axios.post(verifyUidUrl, verifyUidData, {
      headers: verifyUidHeaders,
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: "Failed to verify Aadhaar"
    });
  }
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
    adharVarified,
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
    !chatId ||
    !adharVarified
  ) {
    return res.status(400).json({
      error: "All fields are required."
    });
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
      adharVarified,
      photos: uploadedImages.map((img) => img.secure_url), // Store image URLs
    });

    const savedUser = await newUser.save();
    res.status(201).json({
      message: "Profile submitted successfully.",
      userId: savedUser._id,
    });
  } catch (err) {
    console.error("Error submitting profile:", err);
    res.status(500).json({
      error: "Internal server error."
    });
  }
});

app.get("/test", (req, res) => {
  res.send("yay");
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
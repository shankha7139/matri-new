const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  religion: {
    type: String,
    required: true,
  },
  motherTongue: {
    type: String,
    required: true,
  },
  sex: {
    type: String,
    required: true,
  },
  profession: {
    type: String,
    required: true,
  },
  photos: {
    type: [String], // Array of strings to store the paths of uploaded photos
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

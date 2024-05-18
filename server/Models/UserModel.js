const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  motherTongue: { type: String, required: true },
  sex: { type: String, required: true },
  Phone: { type: String, required: true },
  prof: { type: String, required: true },
  religion: { type: String, required: true },
});

module.exports = mongoose.model("User", UserSchema);

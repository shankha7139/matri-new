const mongoose = require("mongoose");
const { Schema } = mongoose;


const UserSchema = new Schema({
  name: { type: String, required: true },
  mtongue: { type: String, required: false },
  sex: { type: String, required: true },
  phone: { type: String, required: false },
  prof: { type: String, required: true },
  reli: { type: String, required: false },
  desc: { type: String, required: true },
});

// UserSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// UserSchema.pre("save", async function (next) {
//   if (!this.isModified) {
//     next();
//   }
//   const salt = await bcrypt.genSalt(12);
//   this.password = await bcrypt.hash(this.password, salt);
// });

const User = mongoose.model("User", UserSchema);
module.exports = User;
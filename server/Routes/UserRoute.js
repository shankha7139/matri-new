const express = require("express");
const router = express.Router();
const User = require("../Models/UserModel");

router.post("/profile", async (req, res) => {
  try {
    const { name, sex, mtongue, prof, desc, phone, reli } = req.body;
    console.log(name);
    const user = await User.create({
      name,
      sex,
      mtongue,
      prof,
      desc,
      phone,
      reli,
    });
    if (user) {
      res.status(200).json({
        _id: user.id,
        name: user.name,
      });
    } else {
      res.status(400);
      throw new Error("Failed to create the user");
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

module.exports = router;

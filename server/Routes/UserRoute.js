const express = require("express");
const router = express.Router();
const User = require("../Models/UserModel");
const bcrypt = require("bcrypt");

router.post("/profile", async (req, res, next) => {
  try {
    const { name, sex, mtongue, prof, desc, phone, reli } = req.body;
    const user = await User.create({
      name,
      sex,
      mtongue,
      prof,
      desc,
      phone,
      reli,
    });
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;

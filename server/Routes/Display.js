const express = require("express");
const router = express.Router();

router.post("/matriData", (req, res) => {
  try {
    res.send([global.testuser]);
  } catch (error) {
    console.error(error.message);
    res.send("server error");
  }
});

module.exports = router;

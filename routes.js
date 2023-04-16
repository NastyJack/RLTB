const express = require("express");
const router = express.Router();
const tradeBumper = require("./tradeBumper");

router.post("/start", tradeBumper.start);

module.exports = router;

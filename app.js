require("dotenv").config({ path: "credentials.env" });
const express = require("express");
const app = express();
const tradeBumper = require("./routes");
const fs = require("fs");

app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/tradeBumper", tradeBumper);

app.get("/", function (req, res) {
  res.send("Hi there!");
});

app.listen(process.env.PORT, async () => {
  console.log(
    `\n RLTB is listening at port ${process.env.PORT} @ ${process.env.NODE_ENV}`
  );
});

module.exports = app;

let setup = require("./helpers");
let tradeBumper = {};

tradeBumper.start = async function (req, res, next) {
  try {
    let toContinue;
    toContinue = await setup.Puppeteer();

    if (toContinue) return res.status(200).send("RLTB is running");
    else throw toContinue;
  } catch (e) {
    console.log("Error at tradeBumper.setup", e);
    return res.status(500).send(e);
  }
};

module.exports = tradeBumper;

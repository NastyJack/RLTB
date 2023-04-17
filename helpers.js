let puppeteer = require("puppeteer");
let keyDown1 = 0,
  keyDown2 = 0;

let setup = {
  Puppeteer: async function () {
    let page,
      browser = await puppeteer.launch({
        headless: false,
        executablePath:
          "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-site-isolation-trials",
          "--disable-background-timer-throttling",
          "--disable-backgrounding-occluded-windows",
          "--disable-renderer-backgrounding",
        ],
      });
    page = await browser.newPage();
    try {
      await page.setViewport({ width: 1920, height: 1080 });
      await page.goto(process.env.RLG_LOGIN_URL);
      await page.waitForTimeout(8 * 1000);

      await clickIAccept(page);
      await doLogin(page);
      await performBumping(page, 1);

      return true;
    } catch (e) {
      await browser.close();
      console.log("Error at setup.Puppeteer", e);
      return false;
    }
  },
};

async function clickIAccept(page) {
  try {
    await page.evaluate(() => {
      document.querySelector("#acceptPrivacyPolicy").click();
    });

    console.log("\n > Clicked I Accept...");
  } catch (e) {
    console.log("Failed at clickIAccept", e);
  }
}

async function doLogin(page) {
  try {
    await page.waitForTimeout(2 * 1000);
    await page.waitForSelector("input[name=email]");
    console.log("\n > Logging In...");

    await page.type("input[name=email]", process.env.RLG_USER, {
      delay: 200,
    });
    await page.type("input[name=password]", process.env.RLG_PASS, {
      delay: 200,
    });

    await page.click("input[name=submit]");
    await page.waitForTimeout(10 * 1000);
    await page.goto(process.env.RLG_USER_URL);
    console.log("\n > At My Trades Page...");
  } catch (e) {
    console.log("Failed at doLogin", e);
  }
}

async function performBumping(page) {
  try {
    keyDown1 = 0;
    for (; keyDown1 < 44; keyDown1++) await page.keyboard.press("ArrowDown");
    console.log("\n > Bumping Trades...", keyDown1);

    for (let tradeCounter = 1; tradeCounter > 0; tradeCounter++) {
      try {
        let timeout = generateRandomNumbers();
        console.log(
          "\n > Bumping trade:",
          tradeCounter,
          "in",
          timeout,
          "seconds"
        );
        await page.waitForTimeout(timeout * 1000);
        let bumpButton = await page.$x(
          `/html/body/main/section/div/div[3]/div[2]/div/div[4]/div[${tradeCounter}]/div[2]/button`
        );

        // console.log("bumpButton", bumpButton);
        if (!bumpButton.length) throw new Error("End of trades");

        if (
          process.env.NODE_ENV &&
          process.env.NODE_ENV.trim() === "PRODUCTION"
        )
          await bumpButton[0].click();

        await page.waitForTimeout(3 * 1000);
        await page.keyboard.press("Escape");

        keyDown2 = 0;
        for (; keyDown2 < 11; keyDown2++)
          await page.keyboard.press("ArrowDown");
      } catch (e) {
        let waiting = generateRandomNumbers(16 * 60, 18 * 60);
        console.log(
          "\n > End of Trades, total bumped trades =",
          tradeCounter - 1
        );
        console.log(`\n > Waiting for ${waiting / 60} minutes...`);
        await page.reload();
        await page.waitForTimeout(waiting * 1000);
        await page.evaluate(() => {
          window.scroll(0, 0);
        });
        await page.waitForTimeout(3 * 1000);

        keyDown1 = 0;
        for (; keyDown1 < 44; keyDown1++)
          await page.keyboard.press("ArrowDown");

        //restart for loop all over again
        tradeCounter = 0;
      }
    }

    console.log("\n > Bumping Done...");
  } catch (e) {
    console.log("Failed at performBumping", e);
  }
}

function generateRandomNumbers(num1 = 5, num2 = 60) {
  return Math.floor(Math.random() * (num2 - num1 + 1) + num1);
}

module.exports = setup;

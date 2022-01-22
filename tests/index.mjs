import { dirname, resolve as resolvePath } from "path";
import { fileURLToPath } from "url";
import { checks, devices, openBrowser, closeBrowser } from "./browser.mjs";
import runServer from "./server.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const screenshotsPath = resolvePath(__dirname, "screenshots");

const runCheckForDevice = async ({ deviceName, device, port, page, checkName, check: { url, selectors } }) => {
  let success = true;

  try {
    await page.goto(`http://localhost:${port}${url}`);

    const screenshotName = `${deviceName}-${checkName}-${device.colorScheme ?? "default"}`
      .toLowerCase()
      .replace(/[^0-9a-z]+/g, "-");
    const screenshotPath = resolvePath(screenshotsPath, `${screenshotName}.png`);
    await page.screenshot({ path: screenshotPath });

    for (const selector in selectors) {
      const { minCount, maxCount } = selectors[selector];
      const elements = await page.$$(selector);
      const result = elements.length >= minCount && elements.length <= maxCount;
      success = success && result;

      if (!result) {
        console.error(`${checkName}: Found ${elements.length} results for selector "${selector}"!`);
      }
    }

    return success;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const runChecksForDevice = async ({ deviceName, device, port }) => {
  let success = true;

  try {
    const { browser, page } = await openBrowser({ deviceName, device });

    for (const checkName in checks) {
      const check = checks[checkName];
      const result = await runCheckForDevice({ deviceName, device, port, page, checkName, check });
      success = success && result;
    }

    await closeBrowser({ browser });

    return success;
  } catch (error) {
    console.error(error);

    return false;
  }
};

const runChecksForAllDevices = async ({ port }) => {
  let success = true;

  for (const deviceName in devices) {
    const device = devices[deviceName];
    const resultLight = await runChecksForDevice({
      deviceName,
      device: { ...device, colorScheme: "light" },
      port,
    });
    const resultDark = await runChecksForDevice({
      deviceName,
      device: { ...device, colorScheme: "dark" },
      port,
    });
    success = success && resultLight && resultDark;
  }

  return success;
};

runServer(runChecksForAllDevices);

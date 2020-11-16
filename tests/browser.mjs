import * as playwright from "playwright";

export const checks = {
  home: {
    url: "/",
    selectors: {
      ".h-feed": { minCount: 1, maxCount: 1 },
      ".h-entry": { minCount: 1, maxCount: 25 },
      ".h-card[rel=me]": { minCount: 1, maxCount: 1 },
    },
  },
  about: {
    url: "/about/",
    selectors: {
      ".h-card[rel=me]": { minCount: 1, maxCount: 1 },
    },
  },
  "blog-index": {
    url: "/blog/",
    selectors: {
      ".h-feed": { minCount: 1, maxCount: 1 },
      ".h-entry": { minCount: 1, maxCount: 25 },
      ".h-card[rel=me]": { minCount: 1, maxCount: 1 },
    },
  },
  "playground-index": {
    url: "/playground/",
    selectors: {
      ".h-feed": { minCount: 1, maxCount: 1 },
      ".h-entry": { minCount: 1, maxCount: 25 },
      ".h-card[rel=me]": { minCount: 1, maxCount: 1 },
    },
  },
  "blog-article": {
    url: "/blog/github-ribbon-using-css-transforms/",
    selectors: {
      ".h-entry": { minCount: 1, maxCount: 1 },
      ".h-card[rel=me]": { minCount: 1, maxCount: 1 },
    },
  },
};

export const devices = {
  "iPhone 11": playwright.devices["iPhone 11"],
  "Pixel 2": playwright.devices["Pixel 2"],
  "Desktop Chromium": {
    defaultBrowserType: "chromium",
  },
  "Desktop Firefox": {
    defaultBrowserType: "firefox",
  },
  "Desktop Webkit": {
    defaultBrowserType: "webkit",
  },
};

export const openBrowser = async ({ deviceName, device }) => {
  const { defaultBrowserType: browserName } = device;

  console.log(`Running ${deviceName} (${browserName}) with ${device.colorScheme ?? "default"} color scheme...`);

  const browser = await playwright[browserName].launch();
  const page = await browser.newPage(device);

  return { browser, page };
};

export const closeBrowser = async ({ browser }) => {
  await browser.close();
};

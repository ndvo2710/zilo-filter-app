const puppeteer = require('puppeteer');

async function startBrowser() {
    let browser;
    try {
        console.log("Opening the browser......");
        browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium-browser',
            headless: false,
            args: ["--disable-setuid-sandbox"],
            'ignoreHTTPSErrors': true
        });
    } catch (err) {
        console.log("Could not create a browser instance => : ", err);
    }
    await new Promise(resolve => setTimeout(resolve, 5000));
    return browser;
}

module.exports = {
    startBrowser
};


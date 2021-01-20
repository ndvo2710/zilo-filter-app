const pageScraper = require('./pageScraper');
async function scrapeAll(browserObject, url) {

    console.log('pageController url: ', url);

    let browser;

    try {
        //Start the browser and create a browser instance
        browser = await browserObject.startBrowser();
        const eachPageData = await pageScraper.scraper(browser, url);
        await browser.disconnect();
        await browser.close();
        await new Promise(resolve => setTimeout(resolve, 5000));
        return eachPageData;
    }
    catch (err) {
        console.log("Could not resolve the browser instance => ", err);
    }
}

module.exports = (browserObject, url) => scrapeAll(browserObject, url);
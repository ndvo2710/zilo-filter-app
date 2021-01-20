

// var CronJob = require('cron').CronJob;
// const fetchGithub = require('./tasks/fetch-github');

// var job = new CronJob('* * * * *', fetchGithub, null, true, 'America/Los_Angeles');
// job.start();


const fs = require('fs');
const browserObject = require('./browser');
const scraperController = require('./pageController');

const storeData = (data, path) => {
    try {
        fs.writeFileSync(path, JSON.stringify(data))
    } catch (err) {
        console.error(err)
    }
}

const urls = [
    'https://www.zillow.com/homes/for_sale/Manor,-TX_rb/',
    'https://www.zillow.com/homes/for_sale/Georgetown,-TX_rb/',
    'https://www.zillow.com/homes/for_sale/Round-Rock,-TX_rb/',
    'https://www.zillow.com/homes/for_sale/Leander,-TX_rb/',
    'https://www.zillow.com/homes/for_sale/Hornsby-Bend,-Austin,-TX_rb/',
    'https://www.zillow.com/homes/for_sale/Austin,-TX_rb/',
];

async function runScraper(browserObject, urls) {
    let scrapeData = [];

    for (const url of urls) {
        // Pass the browser instance to the scraper controller
        console.log('index url: ', url);
        let pageData = await scraperController(browserObject, url);
        scrapeData = [...scrapeData, ...pageData];
    }

    return scrapeData;
}

runScraper(browserObject, urls).then(scrapeData => storeData(
    scrapeData,
    'data.json'
));
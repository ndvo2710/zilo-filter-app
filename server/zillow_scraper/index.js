

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
    { location: 'Manor', pageUrl: 'https://www.zillow.com/homes/for_sale/Manor,-TX_rb/' },
    { location: 'Georgetown', pageUrl: 'https://www.zillow.com/homes/for_sale/Georgetown,-TX_rb/' },
    { location: 'Round-Rock', pageUrl: 'https://www.zillow.com/homes/for_sale/Round-Rock,-TX_rb/' },
    { location: 'Leander', pageUrl: 'https://www.zillow.com/homes/for_sale/Leander,-TX_rb/' },
    { location: 'Hornsby-Bend', pageUrl: 'https://www.zillow.com/homes/for_sale/Hornsby-Bend,-Austin,-TX_rb/' },
    { location: 'Austin', pageUrl: 'https://www.zillow.com/homes/for_sale/Austin,-TX_rb/' },
];

async function runScraper(browserObject, urls) {
    let scrapeData = {};

    for (const url of urls) {
        // Pass the browser instance to the scraper controller
        console.log('index url: ', url.pageUrl);
        let pageData = await scraperController(browserObject, url.pageUrl);
        scrapeData[url.location] = pageData;
    }

    return scrapeData;
}

runScraper(browserObject, urls).then(scrapeData => storeData(
    scrapeData,
    'data.json'
));
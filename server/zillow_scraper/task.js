const mongoose = require('mongoose');
const connectDB = require('../config/connectDB');
const browserObject = require('./browser');
const scraperController = require('./pageController');

module.exports = async function scrapAndFetchMongo() {
    async function runScraper(browserObject, urls) {
        try {
            for (const url of urls) {
                // Pass the browser instance to the scraper controller
                console.log('index url: ', url.locationURL);
                await scraperController(browserObject, url);
            }

            await mongoose.disconnect();
        } catch (err) {
            console.log('Error. Uncomment to see error ');
            // console.log('Error: ', err);
        } finally {
            console.log('Job Done!');
        }

    }

    connectDB();
    const urls = [
        { location: 'Manor', locationURL: 'https://www.zillow.com/homes/for_sale/Manor,-TX_rb/' },
        { location: 'Georgetown', locationURL: 'https://www.zillow.com/homes/for_sale/Georgetown,-TX_rb/' },
        { location: 'Round-Rock', locationURL: 'https://www.zillow.com/homes/for_sale/Round-Rock,-TX_rb/' },
        { location: 'Leander', locationURL: 'https://www.zillow.com/homes/for_sale/Leander,-TX_rb/' },
        { location: 'Hornsby-Bend', locationURL: 'https://www.zillow.com/homes/for_sale/Hornsby-Bend,-Austin,-TX_rb/' },
        { location: 'Austin', locationURL: 'https://www.zillow.com/homes/for_sale/Austin,-TX_rb/' },
    ];
    runScraper(browserObject, urls)
};
// })();
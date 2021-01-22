const scrapAndFetchMongo = require('./task.js');
const cron = require('node-schedule');

// cron.schedule('1 * * * * *', async () => (scrapAndFetchMongo)());
const temp = cron.scheduleJob('* * /24 * * *', (async () => await scrapAndFetchMongo()));


const mongoose = require('mongoose');
const getDsDate = require('../utils/getDsDate');
const zillowModel = require('../models/zillow.model.js');


// autoScroll source: https://github.com/chenxiaochun/blog/issues/38;
async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 10);
        });
    });
}


const scraperObject = {
    ds: getDsDate(),
    async scraper(browser, url) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        let page = await browser.newPage();
        await page.goto(url.locationURL, { waitUntil: "domcontentloaded", timeout: 300000 });

        // Wait for the required DOM to be rendered
        await page.waitForSelector('.search-page-list-container');
        let pageUrls = await page.$$eval(
            'div > nav > ul > li > a',
            links => {
                links = links.filter(link => link.title.includes('Page'));
                links = links.map(el => el.href);
                return links;
            }
        );
        console.log(pageUrls);

        // Loop through each of those links, open a new page instance and get the relevant data from them
        let pagePromise = (link, dsTimeStamp, location) => new Promise(async (resolve, reject) => {
            let newPage = await browser.newPage();
            await newPage.goto(link);
            await newPage.waitForSelector('.search-page-list-container');
            await autoScroll(newPage);
            // await new Promise(resolve => setTimeout(resolve, 5000));

            // Solution to solve ReferenceError: https://github.com/puppeteer/puppeteer/issues/5165#issuecomment-584185458
            let dataObj = await newPage.$$eval(
                'div > ul > li > article',
                (elements, ds, loc) => {
                    const dataList = elements.map(el => {
                        let data = {};
                        price = el.querySelector('.list-card-price').textContent;
                        data['price'] = parseInt(price.replace('+', '').replace('$', '').replace(',', ''));
                        data['details'] = el.querySelector('.list-card-details').textContent;
                        data['url'] = el.querySelector('.list-card-link').href;
                        imgTag = el.querySelector('.list-card-top img').outerHTML;
                        const re = /<img[^>]+src="(https:\/\/[^">]+)/g;
                        reResult = re.exec(imgTag);
                        data['imageLink'] = reResult[1];
                        data['location'] = loc;
                        data['ds'] = ds;
                        return data
                    });
                    return dataList;
                },
                dsTimeStamp,
                location
            );

            resolve(dataObj);
            await newPage.close();
        });

        let allDataList = []
        for (link in pageUrls) {
            let currentDataList = await pagePromise(pageUrls[link], this.ds, url.location);

            currentDataList.forEach(async (dp) => {
                modelStore = new zillowModel(dp);
                try {
                    await modelStore.save();
                } catch (err) {
                    throw new Error(`Error: ${err} \n ${dp}`);
                }
            })
            allDataList = [...allDataList, ...currentDataList];
        }
        await page.close();
        await new Promise(resolve => setTimeout(resolve, 5000));
        return allDataList;

    }
}

module.exports = scraperObject;
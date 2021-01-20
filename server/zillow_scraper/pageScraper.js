
// autoScroll source: https://github.com/chenxiaochun/blog/issues/38
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
    async scraper(browser, url) {
        let page = await browser.newPage();
        console.log(`Navigating to ${url}...`);
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 300000 });

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
        let pagePromise = (link) => new Promise(async (resolve, reject) => {
            // let dataObj = {};
            let newPage = await browser.newPage();
            await newPage.goto(link);
            await newPage.waitForSelector('.search-page-list-container');
            await autoScroll(newPage);
            // await new Promise(resolve => setTimeout(resolve, 5000));
            let dataObj = await newPage.$$eval(
                'div > ul > li > article',
                elements => {
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
                        // data['imageLink'] = imgTag;
                        return data
                    });
                    Promise.all(dataList).then(() => console.log('done'))
                    return dataList;
                }
            )
            // console.log(dataObj);
            resolve(dataObj);
            await newPage.close();
        });

        let allDataList = []
        for (link in pageUrls) {
            let currentDataList = await pagePromise(pageUrls[link]);
            console.log(currentDataList.length);
            allDataList = [...allDataList, ...currentDataList];
        }
        console.log(allDataList.length);
        console.log('--------------------------');
        allDataList.forEach(elem => console.log(elem.imageLink));
        // console.log(allDataList);
        console.log('--------------------------');
        await page.close();
        await new Promise(resolve => setTimeout(resolve, 5000));
        return allDataList;

    }
}

module.exports = scraperObject;
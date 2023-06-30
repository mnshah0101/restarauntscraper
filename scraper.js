const puppeteer = require('puppeteer');
const fs = require('fs');
const progressBar = require("progress-bar-cli");


function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

let getReviews = async function (url) {
    let start = new Date();
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('.LRkQ2', { visible: true });
    const elements = await page.$$('.LRkQ2');

    await elements[1].click();




    await page.waitForSelector('.jANrlb .fontBodySmall', { visible: true });

    const innerText = await page.$eval('.jANrlb .fontBodySmall', (element) => element.innerText);
    console.log(innerText)

    let reviews_number = innerText.replace(' reviews', '');
    reviews_number = parseInt(reviews_number.replace(/,/g, ""));
    await page.waitForSelector('div.m6QErb.DxyBCb.kA9KIf.dS8AEf ');

    const divHandle = await page.$('.m6QErb.DxyBCb.kA9KIf.dS8AEf ');
    let divReviews = await page.$$('div.jJc9Ad');

    let time_start = new Date();

    while (divReviews.length < reviews_number) {
        progressBar.progressBar(divReviews.length, reviews_number, start);

        await divHandle.evaluate((div) => {
            div.scrollTop = div.scrollHeight;
        });

        await delay(100);
        divReviews = await page.$$('div.jJc9Ad');
        if (new Date() - time_start > 1000 * 60 * 5) {
            console.log("Timeout")
            break;
        }
    }


    const divs = await page.$$('div.jJc9Ad');

    const jsonObjects = [];

    for (const div of divs) {
        try {
            const name = await div.$eval('div.d4r55', (el) => el.innerText);
            const time = (await div.$eval('div.DU9Pgb', (el) => el.innerText)).replace('\nNEW', '');
            const stars = parseInt((await div.$eval('span.kvMYJc', (el) => el.getAttribute('aria-label'))).split(' ')[0]);
            const review = '';
            try {
                review = await div.$eval('span.wiI7pd', (el) => el.innerText);
            } catch (err) {
                ;
            }
            const jsonObject = {
                name: name,
                time: time,
                review: review,
                stars: stars
            };

            jsonObjects.push(jsonObject);
        } catch (err) {
            console.log(err)
        }




    }
    await browser.close();
    console.log('Number of reviews: ' + reviews_number)

    console.log("Number found" + jsonObjects.length)
    console.log("Time taken: " + (new Date() - start) / 1000 + " seconds")
    console.log('\n')

    return jsonObjects

};

module.exports = getReviews;
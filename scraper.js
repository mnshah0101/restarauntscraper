const puppeteer = require('puppeteer');
const fs = require('fs');
const progressBar = require("progress-bar-cli");
const { time } = require('console');


function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

let getReviews = async function (url) {
    let start = new Date();
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/83.0.4103.97 Chrome/83.0.4103.97 Safari/537.36');
    await page.goto(url);
    await page.waitForSelector('.LRkQ2', { visible: true });
    const elements = await page.$$('.LRkQ2');

    await elements[1].click();
    console.log("Clicked")
    await page.waitForSelector('.GMtm7c', { visible: true });
    console.log("Waited")
    await delay(1000);
    const click_sort = await page.$$('.GMtm7c');
    await click_sort[1].click();
    console.log("Clicked 2")

    await page.waitForSelector('.mLuXec', { visible: true });
    const click_sort_2 = await page.$$('.mLuXec');
    console.log(click_sort_2.length)
    await click_sort_2[1].click();


    await delay(1000);


    const innerText = await page.$eval('.jANrlb .fontBodySmall', (element) => element.innerText);
    console.log(innerText)

    let reviews_number = innerText.replace(' reviews', '');
    reviews_number = parseInt(reviews_number.replace(/,/g, ""));
    await page.waitForSelector('div.m6QErb.DxyBCb.kA9KIf.dS8AEf ');

    const divHandle = await page.$('.m6QErb.DxyBCb.kA9KIf.dS8AEf ');
    let divReviews = await page.$$('div.jJc9Ad');


    let length_arr = [];

    while (divReviews.length < reviews_number) {
        progressBar.progressBar(divReviews.length, reviews_number, start);

        await divHandle.evaluate((div) => {
            div.scrollTop = div.scrollHeight;
        });

        await delay(500);
        length_arr.push(divReviews.length);
        divReviews = await page.$$('div.jJc9Ad');

        if (length_arr.length > 5 && length_arr[length_arr.length - 5] == length_arr[length_arr.length - 1]) {
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
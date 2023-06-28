const puppeteer = require('puppeteer');
const fs = require('fs');


function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

let getReviews = async function (url, file) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('.M77dve ', { visible: true });
    console.log('clicking button')
    const elements = await page.$$('.hh2c6');

    await elements[1].click();




    await page.waitForSelector('.jANrlb .fontBodySmall', { visible: true });

    const innerText = await page.$eval('.jANrlb .fontBodySmall', (element) => element.innerText);
    console.log(innerText)

    let reviews_number = innerText.replace(' reviews', '');
    reviews_number = parseInt(reviews_number.replace(/,/g, ""));
    console.log('wait for selector')
    await page.waitForSelector('div.m6QErb.DxyBCb.kA9KIf.dS8AEf ');

    const divHandle = await page.$('.m6QErb.DxyBCb.kA9KIf.dS8AEf ');
    let scrollTimes = Math.ceil(reviews_number / 10);
    for (let i = 0; i < scrollTimes; i++) {
        await divHandle.evaluate((div) => {
            div.scrollTop = div.scrollHeight;
        });

        console.log('scroll');
        await delay(100);

    }

    const divs = await page.$$('div.jJc9Ad');

    const jsonObjects = [];

    for (const div of divs) {
        const name = await div.$eval('div.d4r55', (el) => el.innerText);
        const time = (await div.$eval('div.DU9Pgb', (el) => el.innerText)).replace('\nNEW', '');
        const stars = parseInt((await div.$eval('span.kvMYJc', (el) => el.getAttribute('aria-label'))).split(' ')[0]);
        const review = await div.$eval('span.wiI7pd', (el) => el.innerText);

        const jsonObject = {
            name: name,
            time: time,
            review: review,
            stars: stars
        };

        jsonObjects.push(jsonObject);
    }



    const jsonString = JSON.stringify(jsonObjects);
    const filePath = file;

    fs.writeFile(filePath, jsonString, (err) => {
        if (err) {
            console.error('Error writing JSON file:', err);
            return;
        }
        console.log('JSON data has been written to the file successfully.');
    });







    await browser.close();

};

getReviews('https://www.google.com/maps/search/?api=1&query=36.7139198%2C-95.9359731&query_place_id=ChIJ24juBIQRt4cRHDRRmeObTG0', 'mcdonalds.json');
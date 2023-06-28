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

    // Click on the second element
    await elements[1].click();




    //check if really clicked
    await page.waitForSelector('.jANrlb .fontBodySmall', { visible: true });

    const innerText = await page.$eval('.jANrlb .fontBodySmall', (element) => element.innerText);
    console.log(innerText)

    //get rid of the last 8 characters
    let reviews_number = innerText.replace(' reviews', '');
    reviews_number = parseInt(reviews_number.replace(/,/g, ""));
    console.log('wait for selector')
    await page.waitForSelector('div.m6QErb.DxyBCb.kA9KIf.dS8AEf ');

    // Get a reference to the scrollable div element
    const divHandle = await page.$('.m6QErb.DxyBCb.kA9KIf.dS8AEf ');
    let scrollTimes = Math.ceil(reviews_number / 10);
    for (let i = 0; i < scrollTimes; i++) {
        // Scroll the div to the bottom
        await divHandle.evaluate((div) => {
            div.scrollTop = div.scrollHeight;
        });

        console.log('scroll');
        // Wait for the scroll to finish
        await delay(100); // Delay of 2000 milliseconds (2 seconds)

    }

    const divs = await page.$$('div.jJc9Ad');

    const jsonObjects = [];

    // Loop through the divs and construct JSON objects
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
    // Specify the file path
    const filePath = file;

    // Write the JSON string to the file
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
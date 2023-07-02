const puppeteer = require('puppeteer');
const fs = require('fs');
const progressBar = require("progress-bar-cli");
const { time } = require('console');

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
let getLinks = async function (zipcode, restaurant_name, restaraunt_url_name) {
    let start = Date.now();
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();


    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/83.0.4103.97 Chrome/83.0.4103.97 Safari/537.36');
    await page.goto("https://www.google.com/maps/search/" + zipcode);
    await page.waitForSelector('.searchboxinput', { visible: true });


    await page.type('.searchboxinput', " " + restaurant_name);
    await page.keyboard.press('Enter');
    await delay(2500);


    let page_url = page.url();

    if (page_url.includes("place")) {
        browser.close();
        let return_arr = [];
        return_arr.push(page_url);
        return return_arr;

    }
    try {
        await page.waitForSelector('.hfpxzc', { visible: true, timeout: 5000 });
    } catch (err) {
        page_url = page.url();
        if (page_url.includes("place")) {
            browser.close();
            let return_arr = [];
            return_arr.push(page_url);
            return return_arr;

        }

    }

    let HlvSqB = await page.$('.PbZDve');
    while (!HlvSqB) {
        HlvSqB = await page.$('.PbZDve');
        let search_objects = await page.$$('.hfpxzc');
        let search_object = search_objects[search_objects.length - 1];
        await search_object.scrollIntoView();
        await delay(500);
        if (start + 1000 * 20 < Date.now()) {
            break;
        }
    }










    //press space button to load more reviews


    await delay(100);

    let link_objects = await page.$$('.hfpxzc');




    let links = [];
    //links are the href of the a tag
    for (let link of link_objects) {
        let link_href = await page.evaluate((el) => el.href, link);
        if (link_href.includes(restaraunt_url_name)) {
            links.push(link_href);
        }
    }




    browser.close();

    return links;
}

module.exports = getLinks;
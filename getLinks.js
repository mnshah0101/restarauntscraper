const puppeteer = require('puppeteer');
const fs = require('fs');
const progressBar = require("progress-bar-cli");
const { time } = require('console');

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
let getLinks = async function (zipcode, restaurant_name) {
    console.log(zipcode)
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();


    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/83.0.4103.97 Chrome/83.0.4103.97 Safari/537.36');
    await page.goto("https://www.google.com/maps/search/" + zipcode);
    await delay(2000);
    await page.waitForSelector('.searchboxinput');


    await page.type('.searchboxinput', " " + restaurant_name);
    await page.keyboard.press('Enter');
    await delay(2000);





    let page_url = page.url();

    if (page_url.includes("place")) {
        browser.close();
        console.log(page_url)
        let return_arr = [];
        return_arr.push(page_url);
        return return_arr;

    }
    let HlvSqB = await page.$('.PbZDve');
    while (!HlvSqB) {
        HlvSqB = await page.$('.PbZDve');
        let search_objects = await page.$$('.hfpxzc');
        console.log(search_objects.length)
        let search_object = search_objects[search_objects.length - 1];
        await search_object.scrollIntoView();
        await delay(1000);
    }










    //press space button to load more reviews


    await delay(100);

    let link_objects = await page.$$('.hfpxzc');




    let links = [];
    //links are the href of the a tag
    for (let link of link_objects) {
        let link_href = await page.evaluate((el) => el.href, link);
        if (link_href.includes('place')) {
            links.push(link_href);
        }
    }




    browser.close();
    console.log(links)

    return links;
}

module.exports = getLinks;
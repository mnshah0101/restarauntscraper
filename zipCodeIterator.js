const usZips = require('us-zips/array')
const getLinks = require('./getLinks.js');
var fs = require("fs");




let zipCodeIterator = async function (restaurant_name, restaraunt_url_name) {
    let placeIDLinks = [];
    for (let zip of usZips) {
        try {
            let links = await getLinks(zip['zipCode'], restaurant_name, restaraunt_url_name);
            placeIDLinks.push(links);
        } catch (err) {
            console.log(err);
        }
    }
    return placeIDLinks;

}


let parallelZipCodeIterator = async function (restaurant_name, restaraunt_url_name) {
    let placeIDLinks = [];
    let promises = [];
    let zips = usZips.slice(0, 20);
    for (let i = 0; i < zips.length; i += 10) {
        promises = [];
        for (let j = i; j < i + 10; j++) {
            let zip = usZips[j];
            let promise = getLinks(zip['zipCode'], restaurant_name, restaraunt_url_name);
            promises.push(promise);
        }
        let results = await Promise.all(promises);
        //push all results into placeIDLinks
        for (let result of results) {
            placeIDLinks.push(result);
        }

    }



    return placeIDLinks;
}


parallelZipCodeIterator("McDonald's", "McDonald%27s").then((data) => {
    fs.writeFileSync("./linksdata.json", JSON.stringify(data));
    console.log("Done");
}
).catch((err) => {
    console.log(err);
}
)
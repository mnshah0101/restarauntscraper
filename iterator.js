var fs = require("fs");
var scraper = require("./scraper.js");


var text = fs.readFileSync("./urls.txt").toString('utf-8');
var textByLine = text.split("\n")
textByLine = [...new Set(textByLine)]


let getAllReviews = async function (link_array) {

    let scraper_json = {};

    for (let line of link_array) {
        try {
            scraper_json[line] = await scraper(line);
        } catch (err) {
            scraper_json[line] = 'error: ' + err;
        }

        console.log("Done: " + line)

    }

    return scraper_json;
}

getAllReviews(textByLine).then((data) => {
    fs.writeFileSync("./data.json", JSON.stringify(data));
    console.log("Done");
}
).catch((err) => {
    console.log(err);
}
)

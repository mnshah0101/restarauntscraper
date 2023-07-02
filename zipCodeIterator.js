const usZips = require('us-zips/array')
const getLinks = require('./getLinks.js');



let zipCodeIterator = async function (restaurant_name) {
    let placeIDLinks = [];
    for (let zip of usZips) {
        try {
            let links = await getLinks(zip['zipCode'], restaurant_name);
            placeIDLinks.push(links);
        } catch (err) {
            console.log(err);
        }
    }
    return placeIDLinks;

}

zipCodeIterator("McDonald's").then((data) => {
    console.log(data);
}
).catch((err) => {
    console.log(err);
}
)
const path = require("path");
const util = require("util");
const fs = require("fs");

const groupBy = require("lodash/groupBy");

const { images } = require("../source/metadata_json/all");

for (let i = 0; i < images.length; i++) {
    delete images[i].CaptionAbstract;
    delete images[i].Keywords;
}

const seasonGroups = groupBy(images, "Season");
const seasonCounts = [];
["spring", "summer", "autumn", "winter"].forEach(season => {
    seasonCounts.push({ name: season, count: seasonGroups[season].length });
});

const countryGroups = groupBy(images, "CountryPrimaryLocationName");
const countryCounts = [];
Object.keys(countryGroups).forEach((key) => {
    countryCounts.push({ name: key, count: countryGroups[key].length });
});

countryCounts.sort((a, b) => {
    return a.name < b.name ? -1 : 1;
});


const data = {
    images,
    countryCounts,
    seasonCounts,
};

util.promisify(fs.writeFile)(path.resolve(`${__dirname}/../source/static/data/images.json`), JSON.stringify(data))
    .then(() => {
        console.log("Wrote /data/images.json");
    })
    .catch((err) => {
        console.log("Could not write /data/images.json");
        console.log(err);
    });

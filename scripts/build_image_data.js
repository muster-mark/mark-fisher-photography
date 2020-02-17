const allImages = require( './../source/metadata_json/all');
const groupBy = require('lodash/groupBy');
const path = require('path');

const fs = require('fs').promises;

const images = allImages.images;

images.map(image => {
   delete image.CaptionAbstract; //Not currently needed
   delete image.Keywords; //Not currently needed
   return image;
});

let seasonGroups = groupBy(images, 'Season');
const seasonCounts = [];
Object.keys(seasonGroups).map(function (key) {
    seasonCounts.push({name: key, count: seasonGroups[key].length});
});

let countryGroups = groupBy(images, 'CountryPrimaryLocationName');
const countryCounts = [];
Object.keys(countryGroups).map(function (key) {
    countryCounts.push({name: key, count: countryGroups[key].length});
});

const data = {
    "images": allImages.images,
    "countryCounts": countryCounts,
    "seasonCounts": seasonCounts,
};

fs.writeFile(path.resolve(__dirname + '/../source/static/data/images.json'), JSON.stringify(data))
    .then(() => {
        console.log('Wrote /data/images.json');
    })
    .catch((err) => {
        console.log('Could not write /data/images.json');
        console.log(err);
    });


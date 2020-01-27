const nunjucks = require('nunjucks');
const path = require('path');
const fs = require('fs').promises;
const glob = require('glob-promise');
const galleries = require('./../local_modules/galleries.js');

const templatesPath = path.resolve(__dirname + '/../templates');
const metadataDir = path.resolve(__dirname + '/../source/metadata_json');
const publicDir = path.resolve(__dirname + '/../public');
const homepageImages = [
    'after-brendan',
    'monoculture',
    'the-last-of-autumns-bounty',
    'zebra-ngorongoro-crater',
    'zebras-of-the-serengeti',
    'impala-in-the-grass',
    'swan-in-a-tree',
    'rain-over-bryce-canyon',
    'monet-pool',
    'cow-pooing-at-black-rock',
    'moonbolt',
    'deer-at-dusk',
    'loch-scavaig',
    'beneath-bla-bheinn',
    'neptunes-canvas',
    'cows-by-loch-brittle',
    'boreray',
    'barnacle-unconformity',
    'green-embrace',
];

const getImageData = async slug => {
    const jsonFiles = await glob(`${metadataDir}/*/*_${slug}.json`);
    if (jsonFiles.length !== 1) {
        throw new Error(`Unexpected number of JSON files for ${slug}`);
    }

    return fs.readFile(jsonFiles[0], {encoding: 'utf-8'});
};

const getImagesData = async () => {
    return Promise.all(homepageImages.map(image => getImageData(image)))
};


let favouriteImages;

getImagesData().then(data => {
    favouriteImages = data.map(string => {
        const imageData = JSON.parse(string);
        imageData.cssGridRowSpan = Math.round(200 * (imageData.ImageHeight / imageData.ImageWidth) + 15);
        return imageData;
    });


    const environment = nunjucks.configure(templatesPath, {
        throwOnUndefined: false,
        trimBlocks: true,
    });

    environment.addGlobal('header_nav_links', galleries.getUrlToNameMapping());

    let output;
    try {
        output = nunjucks.render('_pages/homepage.html.nunj', {
            page: {
                url: '/'
            },
            favouriteImages: favouriteImages,
            copyrightYear: new Date().getFullYear(),
        });
    } catch (err) {
        console.error('ERROR: could not render homepages');
        console.error(err);
        return;
    }

    if (output === null) {
        console.error('ERROR: homepage rendered to null');
        return;
    }


    const outputFile = `${publicDir}/index`;

    try {
        fs.writeFile(outputFile, output);
        console.log('Wrote HTML for homepage');
    } catch (error) {
        console.error(`ERROR: could not create homepage`);
        console.error(error);
    }
});



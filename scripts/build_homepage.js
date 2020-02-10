const nunjucks = require('nunjucks');
const path = require('path');
const fs = require('fs').promises;
const glob = require('glob-promise');
const galleries = require('./../local_modules/galleries.js');
const renderAndWriteTemplate = require('./../local_modules/render_and_write_template');

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

const environment = nunjucks.configure(templatesPath, {
    throwOnUndefined: false,
    trimBlocks: true,
});

environment.addGlobal('header_nav_links', galleries.getUrlToNameMapping());

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
        imageData.brickHeight = Math.round((200 * (imageData.ImageHeight / imageData.ImageWidth) + 15));
        imageData.cssGridRowSpan = Math.round(imageData.brickHeight / 3);
        return imageData;
    });

    renderAndWriteTemplate(
        '_pages/homepage.html.nunj',
        `${publicDir}/index`,
        {
            page: {
                url: '/'
            },
            favouriteImages: favouriteImages,
            copyrightYear: new Date().getFullYear(),
        },
        nunjucks
    ).catch(error => {
        console.log(error);
    });

});



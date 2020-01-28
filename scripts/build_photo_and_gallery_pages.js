const path = require('path');
const glob = require('glob-promise');
const galleries = require('./../local_modules/galleries.js');
const nunjucks = require('nunjucks');
const fs = require('fs').promises;
const renderAndWriteTemplate = require('./../local_modules/render_and_write_template');

const templatesPath = path.resolve(__dirname + '/../templates');
const metadataDir = path.resolve(__dirname + '/../source/metadata_json/');
const publicDir = path.resolve(__dirname + '/../public/');

const environment = nunjucks.configure(templatesPath, {
    throwOnUndefined: false,
    trimBlocks: true,
});

environment.addGlobal('header_nav_links', galleries.getUrlToNameMapping());
environment.addFilter("date", require("nunjucks-date"));

async function createGalleryPage(gallery) {

    const jsonFiles = await glob(metadataDir + '/' + gallery + '/*.json');
    const jsonStrings = await Promise.all(jsonFiles.map(file => fs.readFile(file, {encoding: 'utf-8'})));
    const imageMetadata = jsonStrings.map(string => {
        const json = JSON.parse(string);
        json.cssGridRowSpan = Math.round(200 * (json.ImageHeight / json.ImageWidth) + 15);
        return json;
    });

    await fs.mkdir(`${publicDir}/${gallery}`, {recursive: true});

    renderAndWriteTemplate(
        '_pages/gallery.html.nunj',
        `${publicDir}/${gallery}/index`,
        {
            page: {
                meta_title: galleries.names[gallery],
                url: `/${gallery}/`
            },
            gallery: gallery,
            gallery_meta_description: galleries.metaDescriptions[gallery],
            photos: imageMetadata
        },
        nunjucks
    ).catch(error => {
        console.log(error);
    });

    await createImagePages(gallery, imageMetadata)

}

async function createImagePages(gallery, galleryMetadata) {
    for (let i = 0; i < galleryMetadata.length; i++) {
        let previousIndex = i - 1;
        let nextIndex = i + 1;

        if (i === 0) {
            previousIndex = galleryMetadata.length - 1;
        } else if (i + 1 === galleryMetadata.length) {
            nextIndex = 0;
        }

        renderAndWriteTemplate(
            templatesPath + '/_pages/photo.html.nunj',
            `${publicDir}/${gallery}/${galleryMetadata[i].SpecialInstructions}`,
            {
                page: {
                    meta_title: galleryMetadata[i].Title,
                    url: '/' + gallery + '/' + galleryMetadata[i].SpecialInstructions
                },
                gallery: gallery,
                gallery_name: galleries.names[gallery],
                photo: galleryMetadata[i],
                previous_photo: galleryMetadata[previousIndex],
                next_photo: galleryMetadata[nextIndex],
                test_data: new Date()
            },
            nunjucks
        ).catch(error => {
            console.log(error);
        });

    }
}

async function main() {

    let galleries = await glob(metadataDir + '/*');
    galleries = galleries.map(dir => path.basename(dir));


    galleries.forEach(gallery => {
        createGalleryPage(gallery);
    });
}

main();

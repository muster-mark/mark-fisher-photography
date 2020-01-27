const path = require('path');
const glob = require('glob-promise');
const galleries = require('./../local_modules/galleries.js');
const nunjucks = require('nunjucks');
const fs = require('fs').promises;
const nunjucksDate = require("nunjucks-date");

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

    let output;

    try {
        output = nunjucks.render('_pages/gallery.html.nunj', {
            page: {
                meta_title: galleries.names[gallery],
                url: `/${gallery}/`
            },
            gallery: gallery,
            gallery_meta_description: galleries.metaDescriptions[gallery],
            photos: imageMetadata
        });
    } catch (error) {
        console.log(error);
    }

    if (output === null) {
        console.log('ERROR: failed to create gallery index page for ' + galleries.names[gallery]);
        return;
    }

    try {
        await fs.mkdir(`${publicDir}/${gallery}`, {recursive: true});
        await fs.writeFile(`${publicDir}/${gallery}/index`, output, {encoding: 'utf-8'});
        console.log(`Wrote gallery index page for ${galleries.names[gallery]}`);
    } catch (error) {
        console.error('ERROR: failed to write gallery index page for ' + galleries.names[gallery]);
        console.log(error);
    }

    await createImagePages(gallery, imageMetadata)

}

async function createImagePages(gallery, galleryMetadata) {
    for (let i=0; i<galleryMetadata.length; i++) {
        let previousIndex = i - 1;
        let nextIndex = i + 1;

        if(i === 0) {
            previousIndex = galleryMetadata.length - 1;
        } else if (i + 1 === galleryMetadata.length) {
            nextIndex = 0;
        }

        let output = nunjucks.render(templatesPath + '/_pages/photo.html.nunj', {
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
        });

        if (output === null ) {
            console.error(`ERROR: photo page for ${galleryMetadata[i].Title} rendered to null`);
            return;
        }

        const outputFile = `${publicDir}/${gallery}/${galleryMetadata[i].SpecialInstructions}`;

        try {
            await fs.writeFile(outputFile, output);
            console.log(`Wrote HTML in ${gallery} for photo: ${galleryMetadata[i].Title}`);
        } catch (error) {
            console.error(error);
        }


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

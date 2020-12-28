const fs = require("fs");
const path = require("path");
const util = require("util");
const glob = require("glob-promise");
const nunjucks = require("../local_modules/nunjucks");

const galleries = require("../local_modules/galleries.js");
const renderAndWriteTemplate = require("../local_modules/render_and_write_template");

const templatesPath = path.resolve(`${__dirname}/../templates`);
const metadataDir = path.resolve(`${__dirname}/../source/metadata_json/`);
const publicDir = path.resolve(`${__dirname}/../public/`);

async function createImagePages(galleryData, galleryMetadata) {
    for (let i = 0; i < galleryMetadata.length; i++) {
        let previousIndex = i - 1;
        let nextIndex = i + 1;

        if (i === 0) {
            previousIndex = galleryMetadata.length - 1;
        } else if (i + 1 === galleryMetadata.length) {
            nextIndex = 0;
        }

        renderAndWriteTemplate(
            `${templatesPath}/_pages/photo.html.nunj`,
            `${publicDir}/${galleryData.slug}/${galleryMetadata[i].Slug}`,
            {
                page: {
                    meta_title: galleryMetadata[i].Title,
                    url: `/${galleryData.slug}/${galleryMetadata[i].Slug}`,
                },
                gallery: galleryData.slug,
                gallery_name: galleryData.name,
                photo: galleryMetadata[i],
                previous_photo: galleryMetadata[previousIndex],
                next_photo: galleryMetadata[nextIndex],
            },
            nunjucks,
        ).catch((error) => {
            console.log(error);
        });
    }
}

async function createGalleryPage(gallery) {
    const jsonFiles = await glob(`${metadataDir}/${gallery}/*.json`);
    const jsonStrings = await Promise.all(
        jsonFiles.map((file) => util.promisify(fs.readFile)(file, { encoding: "utf-8" })),
    );
    const imageMetadata = jsonStrings.map((string) => {
        const json = JSON.parse(string.toString());
        json.brickHeight = Math.round((200 * (json.ImageHeight / json.ImageWidth) + 15));
        json.cssGridRowSpan = Math.round(json.brickHeight / 3);
        return json;
    });
    imageMetadata.sort((a, b) => new Date(b.DatePublished) - new Date(a.DatePublished));

    await util.promisify(fs.mkdir)(`${publicDir}/${gallery}`, { recursive: true });

    const galleryData = galleries.find(data => data.slug === gallery);

    renderAndWriteTemplate(
        "_pages/gallery.html.nunj",
        `${publicDir}/${gallery}/index`,
        {
            page: {
                meta_title: galleryData.name,
                url: `/${gallery}/`,
            },
            gallery,
            gallery_meta_description: galleryData.metaDescription,
            photos: imageMetadata,
        },
        nunjucks,
    ).catch((error) => {
        console.log(error);
    });

    await createImagePages(galleryData, imageMetadata);
}

async function main() {
    let allGalleries = await glob(`${metadataDir}/*`);
    allGalleries = allGalleries.filter(gallery => {
       return fs.statSync(gallery)?.isDirectory();
    });
    allGalleries = allGalleries.map((dir) => path.basename(dir));

    allGalleries.forEach((gallery) => {
        createGalleryPage(gallery);
    });
}

main();

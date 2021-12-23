const path = require("node:path");
const fs = require("node:fs");
const util = require("node:util");
const glob = require("glob-promise");

const nunjucks = require("../local_modules/nunjucks");
const renderAndWriteTemplate = require("../local_modules/render_and_write_template");
const allImages = require("../source/metadata_json/all.json").images;
const galleries = require("../local_modules/galleries.json").galleries;

const metadataDir = path.resolve(`${__dirname}/../source/metadata_json`);
const publicDir = path.resolve(`${__dirname}/../public`);

// Get 20 most recent images
const homepageImages = allImages
    .sort((a, b) => new Date(b.DatePublished) - new Date(a.DatePublished))
    .slice(0, 21)
    .map((image) => image.Slug);

const getImageData = async (slug) => {
    const jsonFiles = await glob(`${metadataDir}/*/${slug}.json`);
    if (jsonFiles.length !== 1) {
        throw new Error(`Unexpected number of JSON files for ${slug}`);
    }

    return util.promisify(fs.readFile)(jsonFiles[0], { encoding: "utf-8" });
};

const getImagesData = async () => Promise.all(homepageImages.map((image) => getImageData(image)));

const main = async function() {
    const favouriteImages = await getImagesData()
        .then(data => {
            return data.map(string => {
                const imageData = JSON.parse(string.toString());
                imageData.brickHeight = Math.round((200 * (imageData.ImageHeight / imageData.ImageWidth) + 15));
                imageData.cssGridRowSpan = Math.round(imageData.brickHeight / 3);
                return imageData;
            });
        });

    renderAndWriteTemplate(
        "_pages/homepage.html.nunj",
        `${publicDir}/index`,
        {
            page: {
                url: "/",
                skipJs: true,
            },
            favouriteImages,
            featuredGalleries: galleries
                .filter(gallery => gallery.featured)
                .map(gallery=> {
                    gallery.image = allImages.find(image => image.Slug === gallery.imageSlug);
                    return gallery;
                }),
            copyrightYear: new Date().getFullYear(),
        },
        nunjucks,
    ).catch((error) => {
        console.log(error);
    });
};

main();

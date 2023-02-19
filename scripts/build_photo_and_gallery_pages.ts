import fs from "node:fs";
import path from "node:path";
import util from "node:util";
import glob from "glob-promise";

import nunjucks from "../local_modules/nunjucks";
import galleries from "../local_modules/galleries";
import renderAndWriteTemplate from "../local_modules/render_and_write_template";

const rootPath = path.join(__dirname, "..");

const templatesPath = path.join(rootPath, "templates");
const metadataDir = path.join(rootPath, "source", "metadata_json");
const publicDir = path.join(rootPath, "public");

async function createImagePages(galleryData: any, galleryMetadata: any) {
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
                    skipJs: true,
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

async function createGalleryPage(gallery: string) {
    const jsonFiles = await glob(`${metadataDir}/${gallery}/*.json`);
    const jsonStrings = await Promise.all(
        jsonFiles.map((file) => util.promisify(fs.readFile)(file, { encoding: "utf-8" })),
    );
    const imageMetadata = jsonStrings.map((string) => {
        const json = JSON.parse(string.toString());
        json.brickHeight = Math.round((200 * (json.ImageHeight / json.ImageWidth) + 15));
        return json;
    });
    imageMetadata.sort((a, b) => new Date(b.DatePublished).getTime() - new Date(a.DatePublished).getTime());

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
            gallery_description: galleryData.description,
            gallery_title: galleryData.name,
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
    allGalleries = allGalleries.filter(gallery => fs.statSync(gallery)?.isDirectory());
    allGalleries = allGalleries.map((dir) => path.basename(dir));

    allGalleries.forEach((gallery) => {
        createGalleryPage(gallery);
    });
}

main();

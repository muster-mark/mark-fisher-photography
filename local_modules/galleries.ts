import fs from "node:fs";
import path from "node:path";

//@ts-ignore
import MarkdownIt from 'markdown-it';


const md = new MarkdownIt();
const rootDir = path.resolve(`${__dirname}/../`);

const getGalleryDescription = function (galleryName: string) {
    return md.render(fs.readFileSync(`${rootDir}/source/content/gallery_descriptions/${galleryName}.md`).toString());
}

export default [
    {
        "slug": "highlands",
        "name": "Highlands",
        "metaDescription": "Stunning landscape images of the Scottish highlands and islands, including Skye, St. Kilda, Lewis and Harris and Arran.",
        "_unused_homepageDescription": "The UK's crown jewels",
        "featured": true,
        "imageSlug": "rainbow-valley",
        "imageAltText": "Scottish Highlands photography by Mark Fisher",
        "description": getGalleryDescription("highlands"),
    },
    {
        "slug": "landscapes",
        "name": "Landscapes",
        "metaDescription": "Landscape photographs by Mark Fisher. Stunning images of England, Wales, the United States and more.",
        "_unused_homepageDescription": "Everywhere other than the Highlands",
        "featured": true,
        "imageSlug": "last-light",
        "imageAltText": "Landscape photography by Mark Fisher",
        "description": getGalleryDescription("landscapes"),
    },
    {
        "slug": "animals",
        "name": "Animals",
        "metaDescription": "Nature photos by Mark Fisher from the UK and Africa.",
        "_unused_homepageDescription": "Lorem ipsum dolor sit amet",
        "featured": true,
        "imageSlug": "cows-by-loch-brittle",
        "imageAltText": "Wildlife photography by Mark Fisher",
        "description": getGalleryDescription("animals"),
    },
    {
        "slug": "plants",
        "name": "Plants and Trees",
        "metaDescription": "From lilies to lime trees, and birch to bracken - photographs of plants and trees by Mark Fisher.",
        "homepageDescription": "Bringing colour and calm",
        "featured": true,
        "imageSlug": "the-other-side",
        "imageAltText": "Photographs of the plant kingdom, from grass to trees, by Orpington based photographer Mark Fisher",
        "description": null,
    },
    {
        "slug": "dusk-to-dawn",
        "name": "Dusk to Dawn",
        "metaDescription": "A collection of photos taken after the sun has set, or when it is not yet risen. More of the former, as Mark is an expert sleeper.",
        "homepageDescription": "When darkness reigns",
        "featured": true,
        "imageSlug": "moonbolt",
        "imageAltText": "Images taken when the sun don't shine. Photography by Mark Fisher",
        "description": getGalleryDescription("dusk-to-dawn"),
    },
    {
        "slug": "city",
        "name": "City",
        "metaDescription": "Urban photographs of the UK, Europe and the United States by Mark Fisher.",
        "featured": false,
        "description": null,
    },
    {
        "slug": "people",
        "name": "People",
        "metaDescription": "On rare occasions, I pluck up the courage to point my camera at other people. Here are the results.",
        "featured": false,
        "description": null,
    }
]

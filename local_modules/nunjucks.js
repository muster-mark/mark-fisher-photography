const path = require("path");
const nunjucks = require("nunjucks");
const nunjucksDate = require("nunjucks-date");

const manifest = require("../public/assets/manifest.json");

const templatesPath = path.resolve(`${__dirname}/../templates`);
const { galleries } = require("./galleries.json");

require("dotenv").config({ path: `${__dirname}/../.production.env` });

const environment = nunjucks.configure(templatesPath, {
    throwOnUndefined: false,
    trimBlocks: true,
});

const stripHTML = string => string.replace(/(<([^>]+)>)/gi, "");

environment.addGlobal("featured_galleries", galleries.filter(gallery => gallery.featured));
environment.addGlobal("env", process.env);
environment.addFilter("date", nunjucksDate);
environment.addFilter("chunk", (name) => {
    const outputFile = manifest[name];
    if (!outputFile) {
        throw new Error(`No entry in manifest.json for ${name}`);
    }
    return `/assets/${outputFile.replace("/public/", "")}`;
});
environment.addFilter("captionToMetaDesc", caption => {
    // Remove html tags
    const MIN_DESC_LENGTH = 300;

    const split = stripHTML(caption).split(". ");
    let desc = "";

    while (desc.length < MIN_DESC_LENGTH && split.length) {
        desc += `${split.shift()}`;
        if (split.length) {
            desc += ". ";
        }
    }
    return desc;
});

module.exports = nunjucks;

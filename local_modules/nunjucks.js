const path = require("path");
const nunjucks = require("nunjucks");
const fs = require("fs");
const nunjucksDate = require("nunjucks-date");

const manifest = JSON.parse(fs.readFileSync(path.resolve(`${__dirname}/../public/assets/manifest.json`), "utf-8"));

const templatesPath = path.resolve(`${__dirname}/../templates`);
const galleries = require("./galleries.js");

const environment = nunjucks.configure(templatesPath, {
    throwOnUndefined: false,
    trimBlocks: true,
});

environment.addGlobal("header_nav_links", galleries.getUrlToNameMapping());
environment.addFilter("date", nunjucksDate);
environment.addFilter("chunk", (name) => {
    const outputFile = manifest[name];
    if (!outputFile) {
        throw new Error(`No entry in manifest.json for ${name}`);
    }
    return `/assets/${outputFile.replace("/public/", "")}`;
});

module.exports = nunjucks;

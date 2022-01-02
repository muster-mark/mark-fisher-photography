const path = require("node:path");
const fs = require("node:fs/promises");

const Mustache = require("mustache");

const {galleries} = require("../local_modules/galleries.js");
const {images} = require("../source/metadata_json/all.json");

const base = "https://www.markfisher.photo";
const publicDir = path.resolve(`${__dirname}/../public`);

const urls: {
    loc: string;
    lastMod: string;
}[] = [];

async function main() {
    urls.push({
        loc: `${base}/`,
        lastMod: new Date().toISOString(),
    });

    ["about", "contact", "privacy", "explore"].forEach(page => {
        urls.push({
            loc: `${base}/${page}`,
            lastMod: new Date().toISOString(),
        })
    });

    galleries.forEach((gallery: any) => {
        urls.push({
            loc: `${base}/${gallery.slug}`,
            lastMod: new Date().toISOString(),
        })
    });

    images.forEach((image: any) => {
        urls.push({
            loc: `${base}/${image.Gallery}/${image.Slug}`,
            lastMod: new Date().toISOString(),
        })
    });

    const output = Mustache.render(
            `<?xml version="1.0" encoding="utf-8" standalone="yes" ?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{{#urls}}
    <url>
        <loc>{{&loc}}</loc>
        <lastmod>{{&lastMod}}</lastmod>
    </url>
{{/urls}}
</urlset>
`
            , {urls,});

    await fs.writeFile(`${publicDir}/sitemap.xml`, output, {encoding: "utf-8"});
}

main();

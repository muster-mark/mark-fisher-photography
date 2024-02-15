import path from "node:path";
import fs from "node:fs/promises";

import Mustache from "mustache";

import galleries from "../local_modules/galleries";
import images from "../source/metadata_json/all.json";

const base = "https://www.markfisher.photo";
const publicDir = path.join(__dirname, "..", "public");

const imagesSortedDateDescending = images.sort((a, b) => {
    return new Date(b.DatePublished).getTime() - new Date(a.DatePublished).getTime();
});

const urls: {
    loc: string;
    lastMod?: string;
}[] = [];

async function main() {
    urls.push({
        loc: `${base}/`,
        lastMod: new Date(imagesSortedDateDescending[0].DatePublished).toISOString(),
    });

    ["about", "contact", "privacy", "explore"].forEach(page => {
        urls.push({
            loc: `${base}/${page}`,
        });
    });

    galleries.forEach(gallery => {
        const lastPublishedImage = imagesSortedDateDescending.filter(image => image.Gallery === gallery.slug)[0];

        urls.push({
            loc: `${base}/${gallery.slug}`,
            lastMod: new Date(lastPublishedImage.DatePublished).toISOString(),
        })
    });

    images.forEach(image => {
        urls.push({
            loc: `${base}/${image.Gallery}/${image.Slug}`,
            lastMod: new Date(image.DatePublished).toISOString(),
        })
    });

    const output = Mustache.render(
            `<?xml version="1.0" encoding="utf-8" standalone="yes" ?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{{#urls}}
    <url>
        <loc>{{&loc}}</loc>
        {{#lastMod}}
        <lastmod>{{&lastMod}}</lastmod>
        {{/lastMod}} 
    </url>
{{/urls}}
</urlset>
`
            , {urls,});

    await fs.writeFile(`${publicDir}/sitemap.xml`, output, {encoding: "utf-8"});
}

main();

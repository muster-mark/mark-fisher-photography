import fs from "node:fs/promises";
import path from "node:path";
import dotenv from "dotenv";
import escape from "escape-html";
import mustache from "mustache";

import images from "../src/metadata_json/all.json" assert { type: "json" };

dotenv.config({ path: path.resolve(import.meta.dirname, "..", ".production.env") });

function stripHtmlTags(string: string): string {
    return string.replace(/(<([^>]+)>)/gi, "");
}

async function main() {
    const items = images
        .sort((a, b) => {
            return Math.sign(new Date(a.DatePublished).getTime() - new Date(b.DatePublished).getTime());
        })
        .map((image) => ({
            title: "NEW IMAGE: " + escape(image.Title),
            description: escape(stripHtmlTags(image.CaptionAbstract ?? image.AltText)),
            link: `https://${process.env.URL}/${image.Gallery}/${image.Slug}`,
            pubDate: new Date(image.DatePublished).toUTCString(),
            guid: escape(image.Slug),
        }));

    const publicDir = path.join(import.meta.dirname, "..", "public");

    const output = mustache.render(
        `
<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">

<channel>
  <title>New Work - Mark Fisher Photography</title>
  <link>https://{{&websiteUrl}}</link>
  <description>New images published on {{&websiteUrl}}</description>
  <category>Art/Photography/Nature photography</category>
  <category>Art/Photography/Landscape photography</category>
  <webMaster>mark@markfisher.photo</webMaster>
  <language>en-gb</language>
  <lastBuildDate>{{&lastBuildDate}}</lastBuildDate>
  <pubDate>{{&pubDate}}</pubDate>
  <ttl>60</ttl>
{{#items}}
    <item>
        <title>{{&title}}</title>
        <description>{{&description}}</description>
        <link>{{&link}}</link>
        <pubDate>{{&pubDate}}</pubDate>
    </item>
{{/items}}

</channel>

</rss>`.trim(),
        {
            items,
            websiteUrl: process.env.URL,
            lastBuildDate: new Date().toUTCString(),
            pubDate: items[items.length - 1].pubDate,
        },
    );

    await fs.writeFile(`${publicDir}/new-images.xml`, output, { encoding: "utf-8" });
}

main();

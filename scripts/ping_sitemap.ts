import https from "node:https";
import dotenv from "dotenv";

dotenv.config({path: `${__dirname}/../.production.env`});

const sitemapUrl = `https://${process.env.URL}/sitemap.xml`;

const ping = function (url: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const options = new URL(url);
        const req = https.request(options, (res) => {
            if (res.statusCode < 200 || res.statusCode > 299) {
                reject(`Status code for ${url} was ${res.statusCode}`);
            } else {
                resolve();
            }
        });
        req.end();
    });
}

/**
 * @Will need to ping bing and yandex manually for now, with a URL like the following
 *
 * https://bing.com/indexnow?url=https://www.markfisher.photo&key=a1c51b4da2bb46c2947541b2cde1fc6e
 * https://bing.com/indexnow?url=https://www.markfisher.photo&key=a1c51b4da2bb46c2947541b2cde1fc6e
 *
 * N.B. the key is stored in  a1c51b4da2bb46c2947541b2cde1fc6e.txt at website root
 * Could submit a set of URLS by POSTing JSON; would need to compute which pages have changed.
 */
async function main() {
    const urlsToPing = [
        `https://www.google.com/webmasters/sitemaps/ping?sitemap=${sitemapUrl}`,
    ];
    Promise.allSettled(urlsToPing.map(url => ping(url)))
            .then(results => {
                for (let i = 0; i < urlsToPing.length; i++) {
                    const result = results[i];
                    if (result.status === "fulfilled") {
                        console.log(`Successfully pinged ${urlsToPing[i]}`);
                    } else {
                        console.error(`Failed to ping ${urlsToPing[i]}.`, result.reason);
                    }
                }
            });
}


main();

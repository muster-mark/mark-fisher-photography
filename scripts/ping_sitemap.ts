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

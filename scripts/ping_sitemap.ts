const https = require('node:https');
const IncomingMessage = require("node:http").IncomingMessage;
require("dotenv").config({ path: `${__dirname}/../.production.env` });

const sitemapUrl = `https://${process.env.URL}/sitemap.xml`;

const ping = function(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const options = new URL(url);
        const req = https.request(options, (res: typeof IncomingMessage) => {
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
    const googleUrl = `https://www.google.com/webmasters/sitemaps/ping?sitemap=${sitemapUrl}`;
    const bingUrl = `https://bing.com/webmaster/ping.aspx?sitemap=${sitemapUrl}`;

    console.log(`Pinging ${googleUrl}`);
    console.log(`Pinging ${bingUrl}`);

    try {
        await Promise.all([ping(googleUrl), ping(bingUrl)]);
        console.log("Success");
    } catch (err) {
        console.error("Failed to ping search engines: ", err);
    }
}


main();

const path = require('path');
const fs = require('fs');
const clearCloudFrontCache = require('./../local_modules/clear_cloudfront_cache');
const syncS3 = require('./../local_modules/sync_s3');

const readConfig = async function readConfig(destination) {

    let configString = '';
    try {
        configString = await fs.promises.readFile(__dirname + `/../conf.${destination}.json`, 'utf8');
    } catch {
        console.log(`Could not read the conf.${destination}.json. Create this file, using conf.example.json as a template`);
        process.exit(1);
    }

    const defaultConfig = {
        S3_DELETE: true
    };

    let configObject;

    try {
        configObject = JSON.parse(configString);
    } catch {
        console.error('Could not parse config file');
        process.exit(1);
    }


    return Promise.resolve(Object.assign(configObject, defaultConfig));
};

const main = async function main() {

    const printUsage = function (exitCode = 1, message = null) {
        if (message) {
            console.log(message);
        }
        console.log("Usage: node " + path.basename(__filename) + ' [--dryrun] staging|production');
        process.exit(exitCode);
    };

    const destination = process.argv.pop();

    if (['staging', 'production'].indexOf(destination) === -1) {
        console.error('Invalid destination');
        printUsage(2);
    }

    let isDryRun = false;

    if (process.argv.length > 2) {
        if (process.argv.length > 3 || process.argv[2] !== "--dryrun") {
            printUsage(3);
        }

        isDryRun = true;
    }

    const config = await readConfig(destination);


    let syncResult = await syncS3(config.S3_BUCKET, config.S3_REGION, config.S3_DELETE, isDryRun);

    console.log(`${syncResult}`);


    if (isDryRun) {
        console.log('Not invalidating CDN for dry run');
    } else  if (!syncResult) {
        console.log("Not invalidating CDN as no changes to sync");
    } else {
        clearCloudFrontCache(config.DISTRIBUTION_ID, config.CF_INVALIDATOR_KEY, config.CF_INVALIDATOR_SECRET);
    }


};

return main();

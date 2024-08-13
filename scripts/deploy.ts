/**
 * @file Deploys public directory to S3 bucket
 * @type {module:path | path.PlatformPath | path}
 */

import path from "node:path";

import clearCloudFrontCache from "../local_modules/clear_cloudfront_cache";
import syncS3Bucket from "../local_modules/sync_s3_bucket";

function printUsage(exitCode = 1, message?: string) {
    if (message) {
        console.log(message);
    }
    console.log(`Usage: node ${path.basename(__filename)} [--dryrun]`);
    process.exit(exitCode);
}

const main = async function main() {
    let isDryRun = false;

    if (process.argv.length > 2) {
        if (process.argv.length > 3 || process.argv[2] !== "--dryrun") {
            printUsage(3);
        }

        isDryRun = true;
    }

    const s3Bucket =
        process.env.S3_BUCKET ??
        (function () {
            throw new Error("S3_BUCKET is not in environment");
        })();
    const s3Region =
        process.env.S3_REGION ??
        (function () {
            throw new Error("S3_REGION is not in environment");
        })();
    const s3Delete = (process.env.S3_DELETE ?? false) === "true";
    const cloudFrontDistributionId =
        process.env.DISTRIBUTION_ID ??
        (function () {
            throw new Error("DISTRIBUTION_ID is not in environment");
        })();
    const cloudFrontInvalidatorKey =
        process.env.CF_INVALIDATOR_KEY ??
        (function () {
            throw new Error("CF_INVALIDATOR_KEY is not in environment");
        })();
    const cloudFrontInvalidatorSecret =
        process.env.CF_INVALIDATOR_SECRET ??
        (function () {
            throw new Error("CF_INVALIDATOR_SECRET is not in environment");
        })();

    const syncResult = await syncS3Bucket(s3Bucket, "", s3Region, s3Delete, isDryRun);

    console.log(`${syncResult}`);

    if (isDryRun) {
        console.log("Not invalidating CDN for dry run");
    } else if (!syncResult) {
        console.log("Not invalidating CDN as no changes to sync");
    } else {
        clearCloudFrontCache(cloudFrontDistributionId, cloudFrontInvalidatorKey, cloudFrontInvalidatorSecret);
    }
};

main();

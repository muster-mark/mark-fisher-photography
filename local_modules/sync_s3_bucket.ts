import { exec as _exec } from "node:child_process";
import util from "node:util";

const exec = util.promisify(_exec);

/**
 * Syncs the publi directory to a bucket
 */
export default async function syncS3Bucket(bucketName: string, key = "", bucketRegion: string, deleteRemoved: boolean, dryRun: boolean) {
    const excludes = [
        "entrypoints.json",
        "manifest.json",
        ".DS_Store",
    ];

    let excludeArgs = "";

    excludes.forEach(item => {
        excludeArgs += ` --exclude="${item}" `;
    });

    const deleteArg = deleteRemoved ? "--delete" : "";

    const dryRunArg = dryRun ? "--dryrun" : "";

    const cmd = `aws2 s3 sync ${__dirname}/../public${key} s3://${bucketName}${key} ${dryRunArg} ${deleteArg} --region=${bucketRegion} ${excludeArgs} --acl="public-read" --size-only`;

    console.log("Syncing to S3");
    console.log(cmd);

    const { stdout, stderr } = await exec(cmd);

    if (stderr) {
        throw new Error(`There was a problem syncing to ${bucketName}: ${stderr}`);
    }

    return Promise.resolve(stdout);
};

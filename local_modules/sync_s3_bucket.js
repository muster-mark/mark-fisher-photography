const util = require('util');
const exec = util.promisify(require('child_process').exec);


module.exports = async function syncS3Bucket(bucketName, key='', bucketRegion, deleteRemoved, dryRun) {
    //Syncs the public directory to a bucket

    const excludes = [
        'entrypoints.json',
        'manifest.json',
        '.DS_Store',
        'sitemap.xml'
    ];

    let excludeArgs = '';

    excludes.forEach(function(item) {
        excludeArgs += ` --exclude="${item}" `
    });

    const deleteArg = deleteRemoved ? '--delete' : '';

    const dryRunArg = dryRun ? '--dryrun' : '';

    let cmd = `aws2 s3 sync ${__dirname}/../public${key} s3://${bucketName}${key} ${dryRunArg} ${deleteArg} --region=${bucketRegion} --size-only ${excludeArgs} --acl="public-read"`;

    console.log('Syncing to S3');
    console.log(cmd);

    let {stdout, stderr} = await exec(cmd);

    if (stderr) {
        console.error('There was a problem syncing');
        process.exit(1);
    }

    return Promise.resolve(stdout);
};

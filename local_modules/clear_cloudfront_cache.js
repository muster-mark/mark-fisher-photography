const AWS = require('aws-sdk');

module.exports = function clearCloudfrontCache(distributionId, key, secret) {
    const config = new AWS.Config({
        accessKeyId: key,
        secretAccessKey: secret,
        region: 'us-west-2', // CF is global
    });

    const cloudfront = new AWS.CloudFront(config);

    const invalidationParams = {
        DistributionId: distributionId, /* required */
        InvalidationBatch: { /* required */
            CallerReference: Date.now().toString(), // required - unique identifier to prevent multiple requests
            Paths: { // required
                Quantity: 1, // required
                Items: [
                    '/*',
                ],
            },
        },
    };

    cloudfront.createInvalidation(invalidationParams, (err, data) => {
        if (err) {
            throw new Error(`Could not invalidate the cache for distribution ${distributionId}: ${err.message}`);
        } else {
            console.log(data);
            console.log(`Invalidating CF cache for distribution: ${distributionId}`);
        }
    });
};

module.exports =  function(distributionId, key, secret) {
    const AWS = require('aws-sdk');

    const config = new AWS.Config({
        accessKeyId: key,
        secretAccessKey: secret,
        region: 'us-west-2', //CF is global
    });

    const cloudfront = new AWS.CloudFront(config);

    let invalidationParams = {
        DistributionId: distributionId, /* required */
        InvalidationBatch: { /* required */
            CallerReference: Date.now() + '', /* required - unique identifier to prevent multiple requests */
            Paths: { /* required */
                Quantity: 1, /* required */
                Items: [
                    '/*',
                ]
            }
        }
    };

    cloudfront.createInvalidation(invalidationParams, function(err, data) {
        if (err){
            console.log(err, err.stack);
            process.exit(1);
        } else {
            console.log(data);
            console.log(`Invalidating CF cache for distribution: ${distributionId}`);
        }
    });
};



### About

A personal [landscape and nature photography website](https://www.markfisher.photo), hosted as a static website on S3 and delivered by CloudFront.

[![Rain over bryce canyon](https://production-markfisher-photo.s3.eu-west-2.amazonaws.com/photos/w200/rain-over-bryce-canyon.jpg)](https://www.markfisher.photo/landscapes/rain-over-bryce-canyon)
[![Monet pool](https://production-markfisher-photo.s3.eu-west-2.amazonaws.com/photos/w200/monet-pool.jpg)](https://www.markfisher.photo/plants/monet-pool)
[![Cows by Loch Brittle](https://production-markfisher-photo.s3.eu-west-2.amazonaws.com/photos/w200/cows-by-loch-brittle.jpg)](https://www.markfisher.photo/animals/cows-by-loch-brittle)

### Getting started

```
npm install
```

Add photos as desired - see [adding photos](#adding-photos)

```
npm run build
```

Use `.env.example` as a starting point to create config files for deployment to staging and production: `.env.production` and `.env.staging`.


### Adding photos

* Add photos of appropriate sizes to source/static/photos/ subdirectories, in both @1x (implicit) and @2x sizes
    * e.g photos in l840 directory should contain photos 840px on the long edge (either width or height)
    * photos in w200 directory should contain photos 200px wide
    * photos in h300 directory should contain photos 300px tall
* Add thumbnail image containing all metadata to source/metadata_images/&lt;gallery&gt;/ folder
* `npm run add-photo` extracts metadata and rebuilds the gallery and photo pages

### Environment

The following need to be installed and in the PATH

  * Node.js
  * npm
  * exiftool

### Build

```
npm run build
```

### Serve

Start an express server and open in default browser

```
npm run serve
```

### Testing

Javascript is an enhancement for maximum robustness, so check with and without javascript enabled


### Deploying

The deployment scripts deploys to an s3 bucket using aws2 and invalidates the relevant distribution

```
npm run deploy staging|production [--dryrun]
```

### TODO

See [issues](https://github.com/muster-mark/mark-fisher-photography/issues)

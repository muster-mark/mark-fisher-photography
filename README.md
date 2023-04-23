### About

A personal [landscape and nature photography website](https://www.markfisher.photo), hosted as a static website on S3 and delivered by CloudFront.

[![Oaks by Loch Drunkie in Autumn](https://production-markfisher-photo.s3.eu-west-2.amazonaws.com/photos/w200/oaks-by-loch-drunkie-in-autumn.jpg)](https://www.markfisher.photo/highlands/oaks-by-loch-drunkie-in-autumn)
[![Rowan Nursery](https://production-markfisher-photo.s3.eu-west-2.amazonaws.com/photos/w200/rowan-nursery.jpg)](https://www.markfisher.photo/plants/rowan-nursery)
[![Rainbow Valley](https://production-markfisher-photo.s3.eu-west-2.amazonaws.com/photos/w200/rainbow-valley.jpg)](https://www.markfisher.photo/highlands/rainbow-valley)


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
* Add thumbnail image containing all metadata to source/metadata_images/&lt;gallery&gt;/ folder
* `npm run add-photos` extracts metadata and rebuilds the gallery and photo pages

### Environment

The following need to be installed and in the PATH

  * Node.js - version as specified in .nvmrc
  * npm
  * exiftool

### Build

```
npm run build
```

### Serve

Start an express server

```
npm run serve
```

### Deploying

The deployment scripts deploys to an s3 bucket using aws2 and invalidates the relevant distribution

```
npm run deploy staging|production [--dryrun]
```

### TODO

See [issues](https://github.com/muster-mark/mark-fisher-photography/issues)

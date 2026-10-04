### About

A personal [landscape and nature photography website](https://www.markfisher.photo), hosted as a static website on S3 and delivered by CloudFront.

[![Opening Time](https://production-markfisher-photo.s3.eu-west-2.amazonaws.com/photos/w200/opening-time.jpg)](https://www.markfisher.photo/plants/opening-time)
[![Beinn Tharsuinn Chaol from A’ Mhaighdean](https://production-markfisher-photo.s3.eu-west-2.amazonaws.com/photos/w200/beinn-tharsuinn-chaol-from-a-mhaighdean.jpg)](https://www.markfisher.photo/highlands/beinn-tharsuinn-chaol-from-a-mhaighdean)
[![High Fliers](https://production-markfisher-photo.s3.eu-west-2.amazonaws.com/photos/w200/high-fliers.jpg)](https://www.markfisher.photo/animals/high-fliers)


### Getting started

```
pnpm i
```

Add photos as desired - see [adding photos](#adding-photos)

```
pnpm run build
```

Use `.env.example` as a starting point to create config files for deployment to staging and production: `.env.production` and `.env.staging`.


### Adding photos

* Add photos of appropriate sizes to src/static/photos/ subdirectories, in both @1x (implicit) and @2x sizes
    * e.g photos in l840 directory should contain photos 840px on the long edge (either width or height)
    * photos in w200 directory should contain photos 200px wide
* Add thumbnail image containing all metadata to src/metadata_images/&lt;gallery&gt;/ folder
* `pnpm run add-photos` extracts metadata and rebuilds the gallery and photo pages

### Environment

The following need to be installed and in the PATH

  * Node.js - version as specified in .nvmrc
  * nppm
  * exiftool

### Build

```
pnpm run build
```

### Serve

Start an express server

```
pnpm run serve
```

### Deploying

The deployment scripts deploys to an s3 bucket using aws2 and invalidates the relevant distribution

```
pnpm run deploy staging|production [--dryrun]
```

### TODO

See [issues](https://github.com/muster-mark/mark-fisher-photography/issues)

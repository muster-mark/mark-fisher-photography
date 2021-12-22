const path = require('node:path');
const getImageMetadata = require('./get_image_metadata.js');

const rootDir = path.resolve(`${__dirname}/../`);
const testImagesDir = `${rootDir}/source/tests/images`;


test('Returns correct number of fields', async () => {
    const metaData = await getImageMetadata(`${testImagesDir}/green-sotol.jpg`, 'plants');
    expect(Object.keys(metaData)).toHaveLength(30);
});

test('Fields which should be truthy are truthy for file with correct metadata', async () => {
    const metaData = await getImageMetadata(`${testImagesDir}/green-sotol.jpg`, 'plants');
    expect(metaData.Gallery).toBeTruthy();
    expect(metaData.FileName).toBeTruthy();
    expect(metaData.Slug).toBeTruthy();
    expect(metaData.Make).toBeTruthy();
    expect(metaData.Model).toBeTruthy();
    expect(metaData.Lens).toBeTruthy();
    expect(metaData.ExposureTime).toBeTruthy();
    expect(metaData.FNumber).toBeTruthy();
    expect(metaData.ISO).toBeTruthy();
    expect(metaData.DateTimeOriginal).toBeTruthy();
    expect(metaData.Flash).toBeTruthy();
    expect(metaData.FocalLength).toBeTruthy();
    expect(metaData.Keywords).toBeTruthy();
    expect(metaData.Headline).toBeTruthy();
    expect(metaData.Title).toBeTruthy();
    expect(metaData.CountryPrimaryLocationName).toBeTruthy();
    expect(metaData.CountryPrimaryLocationCode).toBeTruthy();
    expect(metaData.GPSLatitudeRef).toBeTruthy();
    expect(metaData.GPSLongitudeRef).toBeTruthy();
    expect(metaData.ImageWidth).toBeTruthy();
    expect(metaData.ImageHeight).toBeTruthy();
    expect(metaData.ImageAspectRatio).toBeTruthy();
    expect(metaData.ImageAspectRatioIdentifier).toBeTruthy();
    expect(metaData.Colors).toBeTruthy();
    expect(metaData.Season).toBeTruthy();
});

test('Fields are of correct format for file with correct metadata', async () => {
    const metaData = await getImageMetadata(`${testImagesDir}/green-sotol.jpg`, 'plants');
    expect(metaData.FileName).toMatch(/[a-z]+(-[a-z]+)*\.jpg/);
    expect(metaData.Slug).toMatch(/^[a-z]+(-[a-z]+)+$/);
    // Exposure time either number or "1/[number]"
    expect(typeof metaData.FNumber).toBe('number');
    expect(typeof metaData.ISO).toBe('number');
    expect(metaData.DateTimeOriginal).toMatch(/^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/);
    // ExposureCompensation either "+1" or "+4/3"
    expect(typeof metaData.Flash).toBe('string');
    expect(metaData.FocalLength).toMatch(/^([0-9.])+ mm$/);
    expect(Array.isArray(metaData.Keywords)).toBeTruthy();
    expect(metaData.CountryPrimaryLocationCode).toMatch(/^[A-Z]{2,3}$/);
    expect(metaData.GPSLatitudeRef).toMatch(/^(North|South)$/);
    expect(metaData.GPSLongitudeRef).toMatch(/^(East|West)$/);
    expect(typeof metaData.ImageWidth).toBe('number');
    expect(typeof metaData.ImageHeight).toBe('number');
    expect(typeof metaData.ImageAspectRatio).toBe('number');
    expect(typeof metaData.ImageAspectRatioIdentifier).toBe('string');
    expect(Array.isArray(metaData.Colors)).toBeTruthy();
    expect(metaData.Colors[0]).toMatch(/^#[a-z0-9A-Z]{6}$/);
    expect(metaData.Season).toMatch(/^(spring|summer|autumn|winter)$/);
});

test('Throws if crucial metadata missing', async () => {
    await expect(getImageMetadata(`${testImagesDir}/title-missing.jpg`)).rejects.toThrow(/title/i);
    await expect(getImageMetadata(`${testImagesDir}/headline-missing.jpg`)).rejects.toThrow(/headline/i);
    await expect(getImageMetadata(`${testImagesDir}/country-missing.jpg`)).rejects.toThrow(/country/i);
    await expect(getImageMetadata(`${testImagesDir}/country-code-invalid.jpg`)).rejects.toThrow(/country.*code/i);
    await expect(getImageMetadata(`${testImagesDir}/publish-date-invalid.jpg`)).rejects.toThrow(/publish.*date/i);
});

const galleries = require("./galleries.js");

test("Meta descriptions all end in full stop", () => expect(galleries
    .map(gallery => gallery.metaDescription[gallery.metaDescription.length - 1])
    .every(last => [".", "?", "!"].indexOf(last) !== -1)).toBeTruthy());

const galleries = require('./galleries.js');

test('Meta descriptions all end in full stop', () => expect(Object.values(galleries.metaDescriptions)
    .map(description => description[description.length - 1])
    .every(last => last === '.')).toBeTruthy());

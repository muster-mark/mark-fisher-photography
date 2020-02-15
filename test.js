

let date = new Date('2020-01-15 17:10:52');
console.log(date);

var createSeasonResolver = require('date-season')

// The season resolver will default to the Northern hemisphere
var seasonNorth = createSeasonResolver({north: true, autumn:true});
var seasonSouth = createSeasonResolver({north: false, autumn: true});

console.log(seasonNorth(date));
console.log(seasonSouth(date));



import allImages from './../../../../source/metadata_json/all';
import  { groupBy } from 'lodash';

const images = allImages.images;

let seasonGroups = groupBy(images, 'Season');
const seasonCounts = [];
Object.keys(seasonGroups).map(function(key) {
    seasonCounts.push({name: key, count: seasonGroups[key].length});
});

let countryGroups = groupBy(images, 'CountryPrimaryLocationName');
const countryCounts = [];
Object.keys(countryGroups).map(function(key) {
    countryCounts.push({name: key, count: countryGroups[key].length});
});

export default {
    images,
    countryCounts,
    seasonCounts
}

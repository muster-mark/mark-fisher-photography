const galleries = {
    names: {
        highlands: "Highlands",
        landscapes: "Landscapes",
        animals: "Animals",
        "dusk-to-dawn": "Dusk to Dawn",
        plants: "Plants",
        city: "City",
        people: "People",
        "black-and-white": "Black and White",
    },
    metaDescriptions: {
        highlands: "Stunning landscape images of the Scottish highlands and islands, including Skye, St. Kilda, Lewis and Harris and Arran.",
        landscapes: "Landscape photographs by Mark Fisher. Stunning images of England, Wales, the United States and more.",
        animals: "Nature photos by Mark Fisher from the UK and Africa ",
        "dusk-to-dawn": "A collection of photos taken after the sun has set, or when it is not yet risen. More of the former, as Mark is an expert sleeper.",
        plants: "From lilies to lime trees, and birch to bracken - photographs of plants and trees by Mark Fisher.",
        city: "Urban photographs of the UK, Europe and the United States by Mark Fisher.",
        people: "On rare occasions, I pluck up the courage to point my camera at other people. Here are the results.",
        "black-and-white": "Stripping away colour and letting form and texture do the talking, here is a collection of black and white photographs by London-based photographer Mark Fisher.",
    },
    getUrlToNameMapping() {
        const urlsToNames = {};
        Object.keys(this.names).forEach((slug) => {
            urlsToNames[`/${slug}/`] = this.names[slug];
        });
        return urlsToNames;
    },
};

module.exports = galleries;

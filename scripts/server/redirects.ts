/**
 * Ensure this is kept up to date with the redirects in the AWS configuration
 */

const redirects = new Map<string, string>();

const movedImages = new Map<string, {
    previousGalleries: string[],
    current: string
}>();

movedImages.set("alone-in-the-woods", {
    previousGalleries: ["dusk-to-dawn"],
    current: "plants",
});
movedImages.set("after-brendan", {
    previousGalleries: ["dusk-to-dawn"],
    current: "plants",
});
movedImages.set("moonbolt", {
    previousGalleries: ["dusk-to-dawn"],
    current: "plants",
});
movedImages.set("disused-mine-shaft-and-trails", {
    previousGalleries: ["dusk-to-dawn"],
    current: "landscapes",
});
movedImages.set("tangle", {
    previousGalleries: ["highlands"],
    current: "abstracts",
});
movedImages.set("loch-ba-reflections", {
    previousGalleries: ["highlands"],
    current: "abstracts",
});
movedImages.set("exhale", {
    previousGalleries: ["highlands"],
    current: "abstracts",
});
movedImages.set("abstract-1", {
    previousGalleries: ["highlands"],
    current: "abstracts",
});
movedImages.set("beaulieu-river-ripples", {
    previousGalleries: ["landscapes"],
    current: "abstracts",
});
movedImages.set("maritime-motif", {
    previousGalleries: ["landscapes"],
    current: "abstracts",
});
movedImages.set("", {
    previousGalleries: ["plants"],
    current: "abstracts",
});
movedImages.set("the-underwater-crowd", {
    previousGalleries: ["plants"],
    current: "abstracts",
});
movedImages.set("abstract-2", {
    previousGalleries: ["plants"],
    current: "abstracts",
});
movedImages.set("heather-eddy", {
    previousGalleries: ["plants"],
    current: "abstracts",
});

movedImages.forEach((value, key) => {
    value.previousGalleries.forEach((previousGallery) => {
        redirects.set(`/${previousGallery}/${key}`, `/${value.current}/${key}`);
    });
});

export default redirects;
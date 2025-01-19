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
movedImages.forEach((value, key) => {
    value.previousGalleries.forEach((previousGallery) => {
        redirects.set(`/${previousGallery}/${key}`, `/${value.current}/${key}`);
    });
});

export default redirects;
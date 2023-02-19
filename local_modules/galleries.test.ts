import galleries from "./galleries";
import { expect, test } from "@jest/globals";

test("Meta descriptions all end in full stop", () => {
    const doAllGalleryDescriptionsEndInPeriod = galleries
        .map(gallery => gallery.metaDescription[gallery.metaDescription.length - 1])
        .every(last => [".", "?", "!"].indexOf(last) !== -1);
    expect(doAllGalleryDescriptionsEndInPeriod).toBeTruthy();
});

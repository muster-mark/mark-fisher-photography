import { expect, test } from "@jest/globals";

import galleries from "./galleries";

test("Meta descriptions all end in full stop", () => {
    const doAllGalleryDescriptionsEndInPeriod = galleries
        .map((gallery) => gallery.metaDescription[gallery.metaDescription.length - 1])
        .every((last) => [".", "?", "!"].indexOf(last) !== -1);
    expect(doAllGalleryDescriptionsEndInPeriod).toBeTruthy();
});

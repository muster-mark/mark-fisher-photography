/**
 * @jest-environment jsdom
 */

import { describe, expect, test } from "@jest/globals";

import images from "../src/metadata_json/all.json";

describe("Image descriptions should not contain straight quote characters", () => {
    const element = document.createElement("div");
    for (const image of images) {
        element.innerHTML = image.Description || "";
        const textContent = element.textContent || "";
        if (textContent) {
            test(`Image ${image.Slug} description should not contain straight quote characters`, () => {
                expect(textContent).not.toMatch(/["']/);
            });
        }
    }
});

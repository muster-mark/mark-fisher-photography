import {expect, test} from "@jest/globals";

import getImageAspectRatioIdentifier from "./get_image_aspect_ratio_identifier";

test('Correct aspect ratio identifiers are returned when aspect ratio is exact', () => {
    expect(getImageAspectRatioIdentifier(840, 594)).toEqual('a4landscape');
    expect(getImageAspectRatioIdentifier(594, 840)).toEqual('a4portrait');
    expect(getImageAspectRatioIdentifier(840, 840)).toEqual('1to1');
    expect(getImageAspectRatioIdentifier(840, 630)).toEqual('4to3');
    expect(getImageAspectRatioIdentifier(630, 840)).toEqual('3to4');
    expect(getImageAspectRatioIdentifier(840, 560)).toEqual('3to2');
    expect(getImageAspectRatioIdentifier(560, 840)).toEqual('2to3');
    expect(getImageAspectRatioIdentifier(840, 420)).toEqual('2to1');
    expect(getImageAspectRatioIdentifier(420, 840)).toEqual('1to2');
    expect(getImageAspectRatioIdentifier(840, 600)).toEqual('7to5');
    expect(getImageAspectRatioIdentifier(600, 840)).toEqual('5to7');
});

test('Error is thrown when aspect ratio is slightly larger than exact match', () => {
    expect(() => getImageAspectRatioIdentifier(840, 593)).toThrow(); // a4landscape
    expect(() => getImageAspectRatioIdentifier(595, 840)).toThrow(); // a4portrait
    expect(() => getImageAspectRatioIdentifier(840, 839)).toThrow(); // 1to1
    expect(() => getImageAspectRatioIdentifier(840, 629)).toThrow(); // 4to3
    expect(() => getImageAspectRatioIdentifier(631, 840)).toThrow(); // 3to4
    expect(() => getImageAspectRatioIdentifier(840, 559)).toThrow(); // 3to2
    expect(() => getImageAspectRatioIdentifier(561, 840)).toThrow(); // 2to3
    expect(() => getImageAspectRatioIdentifier(840, 419)).toThrow(); // 2to1
    expect(() => getImageAspectRatioIdentifier(421, 840)).toThrow(); // 1to2
    expect(() => getImageAspectRatioIdentifier(840, 599)).toThrow(); // 7to5
    expect(() => getImageAspectRatioIdentifier(601, 840)).toThrow(); // 5to7
});

test('Error is thrown when aspect ratio is slightly smaller than exact match', () => {
    expect(() => getImageAspectRatioIdentifier(840, 595)).toThrow(); // a4landscape
    expect(() => getImageAspectRatioIdentifier(593, 840)).toThrow(); // a4portrait
    expect(() => getImageAspectRatioIdentifier(839, 840)).toThrow(); // 1to1
    expect(() => getImageAspectRatioIdentifier(840, 631)).toThrow(); // 4to3
    expect(() => getImageAspectRatioIdentifier(629, 840)).toThrow(); // 3to4
    expect(() => getImageAspectRatioIdentifier(840, 561)).toThrow(); // 3to2
    expect(() => getImageAspectRatioIdentifier(559, 840)).toThrow(); // 2to3
    expect(() => getImageAspectRatioIdentifier(840, 421)).toThrow(); // 2to1
    expect(() => getImageAspectRatioIdentifier(419, 840)).toThrow(); // 1to2
    expect(() => getImageAspectRatioIdentifier(840, 601)).toThrow(); // 7to5
    expect(() => getImageAspectRatioIdentifier(599, 840)).toThrow(); // 5to7
});

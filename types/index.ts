export interface ImageMetadata {
    Gallery: string;
    FileName: string;
    Make?: string;
    Model: string;
    Lens: string;
    ExposureTime: string;
    FNumber: number;
    ISO: number;
    ExposureCompensation: number;
    Flash: string;
    FocalLength: string;
    Keywords: string[];
    AltText: string;
    Title: string;
    Sublocation: string;
    CountryPrimaryLocationName: string;
    CountryPrimaryLocationCode: string;
    State: string;
    GPSLatitudeRef: "North" | "South";
    GPSLongitudeRef: "East" | "West";
    ImageWidth: number;
    ImageHeight: number;
    ImageAspectRatio: number;
    ImageAspectRatioIdentifier: string;
    Slug: string;
    DateTimeOriginal: string;
    DatePublished: string;
    Season: "spring" | "summer" | "autumn" | "winter";
    Colors: string[];
    CaptionAbstract?: string;
    /**
     * In format YYYY-MM-DD, e.g. 1999-12-31
     */
    OriginalTransmissionReference: string;
}

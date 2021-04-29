export interface Image {
    CountryPrimaryLocationName: string;
    Season: "spring" | "summer" | "autumn" | "winter";
}

export interface CountryCount {
    name: string;
    count: number;
}

export interface SeasonCount {
    name: string;
    count: number;
}

export type ImageAspectRatioIdentifier = "a4landscape" | "a4portrait" | "1to1" | "4to3" | "3to4" | "3to2" | "2to3" | "2to1" | "1to2" | "7to5" | "5to7" | "1to3" | "3to1";
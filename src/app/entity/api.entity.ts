export enum API {
    URL = "https://termo-api.cacko.net/api",
    ACTION_NOWDATA = "now",
    CDN = "https://cdn.cacko.net/termo"
};


export interface NowDataEntity {
    humid: number;
    model: string;
    temp: number;
}
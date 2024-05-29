import moment, { Moment } from 'moment';


export enum API {
    URL = "https://termo-api.cacko.net/api",
    ACTION_INDOOR_NOW = "indoor/now",
    ACTION_INDOOR_HOUR = "indoor/hour",
    CDN = "https://cdn.cacko.net/termo"
};

export enum SensorLocation {
    INDOOR = "indoor",
    OUTDOOR = "outdoor"
}

export interface NowDataEntity {
    humid: number;
    model: string;
    temp: number;
    timestamp: string;
    location: SensorLocation;
}
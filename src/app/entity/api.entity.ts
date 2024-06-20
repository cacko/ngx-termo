import moment, { Moment } from 'moment';
import { SensorLocation } from './location.emtity';


export enum API {
    URL = "https://termo-api.cacko.net/api",
    CDN = "https://cdn.cacko.net/termo"
};

export enum PERIOD {
    NOW = "now",
    HOUR = "hour",
    DAY = "day",
    WEEK = "week"
}


export interface NowDataEntity {
    humid: number;
    model: string;
    temp: number;
    timestamp: string;
    location: SensorLocation;
    temp_min ?: number;
}
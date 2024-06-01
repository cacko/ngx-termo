import moment, { Moment } from 'moment';
import { SensorLocation } from './location.emtity';


export enum API {
    URL = "https://termo-api.cacko.net/api",
    ACTION_INDOOR_NOW = "now/indoor",
    ACTION_INDOOR_HOUR = "hour/indoor",
    ACTION_OUTDOOR_NOW = "now/outdoor",
    ACTION_OUTDOOR_HOUR = "hour/outdoor",
    CDN = "https://cdn.cacko.net/termo"
};


export interface NowDataEntity {
    humid: number;
    model: string;
    temp: number;
    timestamp: string;
    location: SensorLocation;
}
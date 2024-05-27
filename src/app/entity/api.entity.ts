import moment, { Moment } from 'moment';


export enum API {
    URL = "https://termo-api.cacko.net/api",
    ACTION_NOWDATA = "now",
    ACTION_PERIOD_HOUR = "period/hour",
    CDN = "https://cdn.cacko.net/termo"
};


export interface NowDataEntity {
    humid: number;
    model: string;
    temp: number;
    timestamp: string;
}
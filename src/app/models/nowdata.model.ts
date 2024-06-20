 import { NowDataEntity } from "../entity/api.entity";
import moment, { Moment } from 'moment';
import { SensorLocation } from "../entity/location.emtity";


export class NowDataModel implements NowDataEntity {

    temp !: number;
    humid !: number;
    model !: string;
    timestamp !: string;
    location !: SensorLocation;
    temp_min ?: number;

    readonly MIN_TEMP = -10;
    readonly MAX_TEMP = 40;

    constructor(
        original: NowDataEntity
    ) {

        Object.assign(this, original);
    }

    get tempGradient() {
        const heat= ((this.temp - this.MIN_TEMP) / (this.MAX_TEMP - this.MIN_TEMP) * 100) + '%';
        return `linear-gradient(rgba(241,122,101,0.3) ${heat}, rgba(61,202,223,0.4))`;
    }

    get tempHeight() {
        return (this.temp - this.MIN_TEMP) / (this.MAX_TEMP - this.MIN_TEMP) * 100 + '%';
    }

    get tempLabel() {
        return `${this.temp.toFixed(1)}°C`;
    }

    get tempClass() {
        switch (true) {
            case this.temp > 35:
                return 'extreme_heat';
            case this.temp > 25:
                return 'heat';
            case this.temp > 18:
                return 'normal';
            case this.temp > 3:
                return 'vold';
            default:
                return 'severe-cold';
        }
    }

    get timestampLabel() {
        return moment(this.timestamp).utc().format('LT');
    }

    get timestampDate() {
        return moment(this.timestamp).utc();
    }

    get timestampDay() {
        return moment(this.timestamp).utc().toDate();
    }

    get humidLabel() {
        return `${this.humid.toFixed(1)}%`
    }

    get humidIcon() {
        switch (true) {
            case this.humid > 80:
                return 'humidity_high';
            case this.humid > 50:
                return 'humidity_mid';
            default:
                return 'humidity_low';
        }
    }

    get locationIcon() {
        switch (this.location) {
            case SensorLocation.INDOOR:
                return 'aq_indoor';
            case SensorLocation.OUTDOOR:
                return 'outdoor_garden';
        }
    }

    get image() {
        switch (this.location) {
            case SensorLocation.INDOOR:
                return this.indoorImage;
            case SensorLocation.OUTDOOR:
                return this.outdoorImage;
        }

    }

    get indoorImage() {
        return 'https://cdn.cacko.net/termo/indoor-day.webp';
    }

    get outdoorImage() {
        return 'https://cdn.cacko.net/termo/outdoor-day.webp';
    }
}
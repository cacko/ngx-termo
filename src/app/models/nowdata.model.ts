import { NowDataEntity, SensorLocation } from "../entity/api.entity";
import moment, { Moment } from 'moment';


export class NowDataModel implements NowDataEntity {

    temp !: number;
    humid !: number;
    model !: string;
    timestamp !: string;
    location !: SensorLocation;

    readonly MIN_TEMP = -20;
    readonly MAX_TEMP = 50;

    constructor(
        original: NowDataEntity
    ) {

        Object.assign(this, original);
    }

    get tempGradient() {
        return ((this.temp - this.MIN_TEMP) / (this.MAX_TEMP - this.MIN_TEMP) * 100) + '%';
    }

    get tempHeight() {
        return (this.temp - this.MIN_TEMP) / (this.MAX_TEMP - this.MIN_TEMP) * 100 + '%';
    }

    get tempLabel() {
        return `${this.temp}°C`;
    }

    get timestampLabel() {
        return moment(this.timestamp).utc().format('LT');
    }

    get timestampDate() {
        return moment(this.timestamp).utc();
    }

    get humidLabel() {
        return `${this.humid}%`
    }

    get humidIcon() {
        switch(true) {
            case this.humid > 80:
                return 'humidity_high';
            case this.humid > 50:
                return 'humidity_mid';
            default:
                return 'humidity_low';
        }
    }
}
import { NowDataEntity } from "../entity/api.entity";
import moment, { Moment } from 'moment';


export class NowDataModel implements NowDataEntity {

    temp !: number;
    humid !: number;
    model !: string;
    timestamp !: string;

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
}
import { NowDataEntity } from "../entity/api.entity";


export class NowDataModel implements NowDataEntity {

    temp !: number;
    humid !: number;
    model !: string;

    readonly MIN_TEMP = -20;
    readonly MAX_TEMP = 50;

    constructor(
        original: NowDataEntity
    ) {
        Object.assign(this, original);
    }


    get tempHeight() {
        return (this.temp - this.MIN_TEMP) / (this.MAX_TEMP - this.MIN_TEMP) * 100 + '%';
    }

    get tempLabel() {
        return `${this.temp}°C`;
    }
}